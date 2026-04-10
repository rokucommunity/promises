import {
    type Plugin,
    type Program,
    type BscFile,
    type BsDiagnostic,
    type CallExpression,
    type Expression,
    type LiteralExpression,
    type ReturnStatement,
    type FunctionExpression,
    type OnGetCodeActionsEvent,
    type InsertChange,
    type DeleteChange,
    type Position,
    type ProvideHoverEvent,
    type ProvideCompletionsEvent,
    isBrsFile,
    WalkMode,
    createVisitor,
    DiagnosticSeverity,
    isDottedGetExpression,
    isVariableExpression,
    isCallExpression,
    isFunctionExpression,
    isLiteralExpression,
    TokenKind,
    codeActionUtil,
    CodeActionKind,
} from 'brighterscript';

/**
 * Options accepted by the promises plugin factory.
 *
 * In most projects you don't need to set anything — the plugin auto-detects
 * the ropm alias by scanning for `roku_modules/<alias>/source/promises.brs`.
 *
 * If auto-detection fails (e.g. non-standard install layout) supply the alias
 * explicitly:
 *
 * ```js
 * // bsplugin-promises.js  (reference this file from bsconfig.json)
 * const plugin = require('@rokucommunity/promises/plugin');
 * module.exports = plugin({ alias: 'myPromises' });
 * ```
 */
interface PromisesPluginOptions {
    /**
     * The ropm alias used when installing @rokucommunity/promises.
     * Accepts a single string or an array for multiple aliases.
     * When omitted the plugin scans roku_modules for the installed alias.
     */
    alias?: string | string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_NAMESPACE = 'promises';

// BrightScript is case-insensitive, so all comparisons use lowercased names.

/** Functions where context is passed as the 2nd callback param: (value, context) */
const THEN_CATCH_FNS = new Set(['onthen', 'oncatch']);

/** Functions where context is passed as the 1st callback param: (context) */
const FINALLY_FNS = new Set(['onfinally']);

/** Diagnostic codes emitted by the promises plugin. */
enum PromisesDiagnosticCode {
    /** A context argument was passed but the inline callback has no parameter to receive it. */
    ContextParamMissing = 'PRMS1001',
    /** A chain expression was returned without calling `.toPromise()` first. */
    ChainMissingToPromise = 'PRMS1002',
    /** The inline callback has more parameters than will be provided — the extra params will crash at runtime. */
    ExtraCallbackParam = 'PRMS1003',
}

// ─────────────────────────────────────────────────────────────────────────────
// AST helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true when `expr` is the `invalid` keyword literal (not a variable named "invalid"). */
function isInvalidLiteral(expr: Expression): boolean {
    return isLiteralExpression(expr) && (expr as LiteralExpression & { token: { kind: string } }).token?.kind === TokenKind.Invalid;
}

/**
 * If `expr` is an inline `function`/`sub` literal, returns its parameter count.
 * Returns `null` for variable references or any other non-literal expression —
 * those cases are skipped silently to avoid false positives.
 */
function getInlineParamCount(expr: Expression): number | null {
    return isFunctionExpression(expr) ? expr.parameters.length : null;
}

/**
 * Extracts the callee name and optional namespace from a call expression.
 *
 * | Source                   | Result                               |
 * |--------------------------|--------------------------------------|
 * | `promises.onThen(...)`   | `{ name: 'onThen', namespace: 'promises' }` |
 * | `myAlias_onThen(...)`    | `{ name: 'myAlias_onThen' }`         |
 */
function getCallCallee(node: CallExpression): { name: string; namespace?: string } | null {
    const { callee } = node;
    if (isDottedGetExpression(callee)) {
        const name = callee.name.text;
        const namespace = isVariableExpression(callee.obj)
            ? ((callee.obj as any).name?.text as string | undefined)
            : undefined;
        return name ? { name: name, namespace: namespace } : null;
    }
    if (isVariableExpression(callee)) {
        const name = (callee as any).name?.text as string;
        return name ? { name: name } : null;
    }
    return null;
}

/**
 * Matches a call expression against the known promise functions, supporting
 * both namespace-style (`promises.onThen`) and flat/ropm-style (`alias_onThen`).
 *
 * Returns the display name and whether context is expected as the 1st or 2nd
 * callback parameter, or `null` if the call is unrelated to promises.
 */
function matchPromiseFn(
    node: CallExpression,
    namespaces: string[],
): { displayName: string; type: 'thenCatch' | 'finally' } | null {
    const info = getCallCallee(node);
    if (!info?.name) {
        return null;
    }

    const lowerName = info.name.toLowerCase();
    const lowerNs = info.namespace?.toLowerCase();

    // Namespace style: promises.onThen(...) / alias.onThen(...)
    // Namespaces stored as-is; file-path derived aliases are already lowercase.
    if (lowerNs && namespaces.some(n => n.toLowerCase() === lowerNs)) {
        const dn = `${info.namespace}.${info.name}`;
        if (THEN_CATCH_FNS.has(lowerName)) {
            return { displayName: dn, type: 'thenCatch' };
        }
        if (FINALLY_FNS.has(lowerName)) {
            return { displayName: dn, type: 'finally' };
        }
    }

    // Flat-function style: promises_onThen(...) / alias_onThen(...)
    for (const ns of namespaces) {
        const prefix = `${ns.toLowerCase()}_`;
        if (lowerName.startsWith(prefix)) {
            const fn = lowerName.slice(prefix.length);
            if (THEN_CATCH_FNS.has(fn)) {
                return { displayName: info.name, type: 'thenCatch' };
            }
            if (FINALLY_FNS.has(fn)) {
                return { displayName: info.name, type: 'finally' };
            }
        }
    }

    return null;
}

/**
 * Returns true if `expr` is a direct call to our `chain()` function
 * (either namespace-style `promises.chain(...)` or flat-style `alias_chain(...)`).
 */
function isOurChainRoot(expr: Expression, namespaces: string[]): boolean {
    if (!isCallExpression(expr)) {
        return false;
    }
    const ce = expr as CallExpression;
    if (isDottedGetExpression(ce.callee)) {
        const method = ce.callee.name.text.toLowerCase();
        if (method === 'chain') {
            const lowerNs = (isVariableExpression(ce.callee.obj)
                ? (ce.callee.obj as any).name?.text as string
                : ''
            ).toLowerCase();
            return namespaces.some(n => n.toLowerCase() === lowerNs);
        }
    } else if (isVariableExpression(ce.callee)) {
        const lowerName = ((ce.callee as any).name?.text as string ?? '').toLowerCase();
        return namespaces.some(n => lowerName === `${n.toLowerCase()}_chain`);
    }
    return false;
}

/**
 * Returns true if `expr` is a chain builder call (`.then/.catch/.finally`)
 * rooted at one of our `chain()` functions, and does NOT end in `.toPromise()`.
 * Such an expression yields a chain builder AA, not a Promise node.
 */
function isUnterminatedChainExpr(expr: Expression, namespaces: string[]): boolean {
    if (!isCallExpression(expr)) {
        return false;
    }
    const ce = expr as CallExpression;
    if (!isDottedGetExpression(ce.callee)) {
        return false;
    }
    const method = ce.callee.name.text.toLowerCase();
    if (method === 'topromise') {
        return false;
    }
    if (method === 'then' || method === 'catch' || method === 'finally') {
        const obj = ce.callee.obj;
        return isOurChainRoot(obj, namespaces) || isUnterminatedChainExpr(obj, namespaces);
    }
    return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hover / completion helpers
// ─────────────────────────────────────────────────────────────────────────────


function isPositionInRange(
    pos: { line: number; character: number },
    range: { start: { line: number; character: number }; end: { line: number; character: number } }
): boolean {
    if (pos.line < range.start.line || pos.line > range.end.line) {
        return false;
    }
    if (pos.line === range.start.line && pos.character < range.start.character) {
        return false;
    }
    if (pos.line === range.end.line && pos.character > range.end.character) {
        return false;
    }
    return true;
}

/**
 * Walks backwards up a method call chain to find the root `chain()` call,
 * regardless of whether a context argument was provided.
 */
function findChainRoot(expr: Expression, namespaces: string[]): CallExpression | null {
    if (!isCallExpression(expr)) {
        return null;
    }
    const ce = expr as CallExpression;

    if (isDottedGetExpression(ce.callee)) {
        const method = ce.callee.name.text.toLowerCase();
        if (method === 'then' || method === 'catch' || method === 'finally') {
            return findChainRoot(ce.callee.obj, namespaces);
        }
        if (method === 'chain') {
            const lowerNs = (isVariableExpression(ce.callee.obj)
                ? (ce.callee.obj as any).name?.text as string
                : ''
            ).toLowerCase();
            if (namespaces.some(n => n.toLowerCase() === lowerNs)) {
                return ce;
            }
        }
    } else if (isVariableExpression(ce.callee)) {
        const lowerName = ((ce.callee as any).name?.text as string ?? '').toLowerCase();
        for (const ns of namespaces) {
            if (lowerName === `${ns.toLowerCase()}_chain`) {
                return ce;
            }
        }
    }

    return null;
}

interface PromiseCallContext {
    fnType: 'thenCatch' | 'finally' | 'chain';
    argIndex: number;
}

/**
 * Given text on the current line up to the cursor, returns which promise
 * function we're inside and which argument position the cursor is at.
 * Returns null if the cursor is not inside a recognized promise function call.
 */
function detectPromiseCallContext(beforeCursor: string, namespaces: string[]): PromiseCallContext | null {
    // Walk backwards to find the last unclosed '('
    let depth = 0;
    let parenIdx = -1;
    for (let i = beforeCursor.length - 1; i >= 0; i--) {
        const ch = beforeCursor[i];
        if (ch === ')') {
            depth++;
        } else if (ch === '(') {
            if (depth === 0) {
                parenIdx = i;
                break;
            }
            depth--;
        }
    }
    if (parenIdx === -1) {
        return null;
    }

    // Text before the open paren identifies the function being called
    const callSite = beforeCursor.slice(0, parenIdx).trimEnd().toLowerCase();
    // Count commas at depth 0 inside the parens to determine argument index
    const argText = beforeCursor.slice(parenIdx + 1);
    let argIndex = 0;
    let innerDepth = 0;
    for (const ch of argText) {
        if (ch === '(' || ch === '[') {
            innerDepth++;
        } else if (ch === ')' || ch === ']') {
            innerDepth--;
        } else if (ch === ',' && innerDepth === 0) {
            argIndex++;
        }
    }

    for (const ns of namespaces) {
        const lns = ns.toLowerCase();
        if (callSite.endsWith(`${lns}.onthen`) || callSite.endsWith(`${lns}_onthen`) ||
            callSite.endsWith(`${lns}.oncatch`) || callSite.endsWith(`${lns}_oncatch`)) {
            return { fnType: 'thenCatch', argIndex: argIndex };
        }
        if (callSite.endsWith(`${lns}.onfinally`) || callSite.endsWith(`${lns}_onfinally`)) {
            return { fnType: 'finally', argIndex: argIndex };
        }
        if (callSite.endsWith(`${lns}.chain`) || callSite.endsWith(`${lns}_chain`)) {
            return { fnType: 'chain', argIndex: argIndex };
        }
    }

    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Diagnostic construction
// ─────────────────────────────────────────────────────────────────────────────

function makeDiagnostic(
    displayName: string,
    isFinally: boolean,
    callbackArg: Expression,
    file: BscFile,
): BsDiagnostic | null {
    // range can be undefined for synthetic nodes — skip those
    if (!callbackArg.range) {
        return null;
    }
    const hint = isFinally
        ? 'Add a first parameter to receive it (e.g. `sub(context)`).'
        : 'Add a second parameter to receive it (e.g. `function(value, context)`).';

    // Compute the insertion point for the quick-fix action.
    // callbackArg is guaranteed to be a FunctionExpression here (isFunctionExpression
    // was already confirmed by getInlineParamCount returning a non-null value).
    const fn = callbackArg as FunctionExpression;
    let insertPosition: Position | undefined;
    let insertText: string;
    if (isFinally || fn.parameters.length === 0) {
        insertPosition = fn.leftParen.range?.end;
        insertText = isFinally ? 'context' : 'value, context';
    } else {
        insertPosition = fn.parameters[0].range?.end;
        insertText = ', context';
    }

    return {
        file: file,
        range: callbackArg.range,
        severity: DiagnosticSeverity.Warning,
        source: 'roku-promises-plugin',
        code: PromisesDiagnosticCode.ContextParamMissing,
        message: `'${displayName}' was called with a context argument, but the inline callback has no parameter to receive it. ${hint}`,
        data: insertPosition ? { insertPosition: insertPosition, insertText: insertText } : undefined,
    };
}

/**
 * Builds a PRMS1003 diagnostic for a callback that declares more parameters
 * than the promise function will supply.
 *
 * The quick-fix data holds a range to delete:
 *   - `thenCatch` (keep param[0]): delete from `params[0].end` → `rightParen.start`
 *   - `finally`   (keep nothing):  delete from `leftParen.end` → `rightParen.start`
 */
function makeExtraParamDiagnostic(
    displayName: string,
    isFinally: boolean,
    callbackArg: Expression,
    file: BscFile,
): BsDiagnostic | null {
    if (!callbackArg.range) {
        return null;
    }
    const fn = callbackArg as FunctionExpression;

    let deleteStart: Position | undefined;
    const deleteEnd: Position | undefined = fn.rightParen.range?.start;

    if (isFinally) {
        deleteStart = fn.leftParen.range?.end;
    } else {
        deleteStart = fn.parameters[0]?.range?.end;
    }

    return {
        file: file,
        range: callbackArg.range,
        severity: DiagnosticSeverity.Error,
        source: 'roku-promises-plugin',
        code: PromisesDiagnosticCode.ExtraCallbackParam,
        message: `'${displayName}' does not pass a context argument, but the inline callback declares extra parameter(s) that will never receive a value — this will crash at runtime. Remove the extra parameter(s) or pass a context argument.`,
        data: (deleteStart && deleteEnd) ? { deleteRange: { start: deleteStart, end: deleteEnd } } : undefined,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// File checker
// ─────────────────────────────────────────────────────────────────────────────

function checkFile(file: BscFile, namespaces: string[]): void {
    const diagnostics: BsDiagnostic[] = [];

    // `isBrsFile` is already checked by the caller; cast to access Body.walk
    (file.ast as any).walk(
        createVisitor({
            CallExpression: function CallExpression(node: CallExpression) {
                // ──────────────────────────────────────────────────────────
                // Case 1: promises.onThen / promises.onCatch / promises.onFinally
                //         and their ropm-aliased flat-function variants
                //
                //   promises.onThen(promise, function(value)    ← missing ctx param
                //       ...
                //   end function, myContext)
                // ──────────────────────────────────────────────────────────
                const match = matchPromiseFn(node, namespaces);
                if (match) {
                    // context is the 3rd argument (index 2)
                    const ctxArg = node.args[2];
                    const hasContext = Boolean(ctxArg && !isInvalidLiteral(ctxArg));
                    const cbArg = node.args[1];
                    if (cbArg) {
                        const paramCount = getInlineParamCount(cbArg);
                        if (paramCount !== null) {
                            const isFinally = match.type === 'finally';
                            const need = isFinally ? 1 : 2;  // params required when context is present
                            const max = need - 1;             // params allowed when context is absent
                            if (hasContext && paramCount < need) {
                                // PRMS1001: context passed but callback won't receive it
                                const diag = makeDiagnostic(match.displayName, isFinally, cbArg, file);
                                if (diag) {
                                    diagnostics.push(diag);
                                }
                            } else if (!hasContext && paramCount > max) {
                                // PRMS1003: no context but callback declares extra params that will crash
                                const diag = makeExtraParamDiagnostic(match.displayName, isFinally, cbArg, file);
                                if (diag) {
                                    diagnostics.push(diag);
                                }
                            }
                        }
                    }
                    return;
                }

                // ──────────────────────────────────────────────────────────
                // Case 2: promises.chain(promise, ctx).then(cb)
                //                                     .catch(cb)
                //                                     .finally(cb)
                //
                //   promises.chain(promise, myCtx)
                //       .then(function(value)    ← missing ctx param
                //           ...
                //       end function)
                // ──────────────────────────────────────────────────────────
                const { callee } = node;
                if (!isDottedGetExpression(callee)) {
                    return;
                }

                const method = callee.name.text.toLowerCase();
                if (method !== 'then' && method !== 'catch' && method !== 'finally') {
                    return;
                }

                const chainRoot = findChainRoot(callee.obj, namespaces);
                if (!chainRoot) {
                    return;
                }

                const cbArg = node.args[0];
                if (!cbArg) {
                    return;
                }

                const paramCount = getInlineParamCount(cbArg);
                if (paramCount === null) {
                    return;
                }

                const isChainFinally = method === 'finally';
                const chainCtxArg = chainRoot.args[1];
                const chainHasContext = Boolean(chainCtxArg && !isInvalidLiteral(chainCtxArg));
                const need = isChainFinally ? 1 : 2;
                const max = need - 1;

                if (chainHasContext && paramCount < need) {
                    // PRMS1001: context passed to chain() but callback won't receive it
                    const diag = makeDiagnostic(`.${method}`, isChainFinally, cbArg, file);
                    if (diag) {
                        diagnostics.push(diag);
                    }
                } else if (!chainHasContext && paramCount > max) {
                    // PRMS1003: chain() has no context but callback declares extra params that will crash
                    const diag = makeExtraParamDiagnostic(`.${method}`, isChainFinally, cbArg, file);
                    if (diag) {
                        diagnostics.push(diag);
                    }
                }
            },

            // ──────────────────────────────────────────────────────────
            // Case 3: returning a chain builder without .toPromise()
            //
            //   return promises.chain(promise, ctx).then(cb)  ← missing .toPromise()
            //   return promises.chain(promise)                ← same issue
            // ──────────────────────────────────────────────────────────
            ReturnStatement: function ReturnStatement(node: ReturnStatement) {
                if (!node.value || !node.range) {
                    return;
                }
                if (isOurChainRoot(node.value, namespaces) || isUnterminatedChainExpr(node.value, namespaces)) {
                    diagnostics.push({
                        file: file,
                        range: node.range,
                        severity: DiagnosticSeverity.Warning,
                        source: 'roku-promises-plugin',
                        code: PromisesDiagnosticCode.ChainMissingToPromise,
                        message: `Chain result returned without '.toPromise()'. The chain builder is not a Promise node — add '.toPromise()' at the end to return the underlying Promise.`,
                        data: {
                            insertPosition: node.value.range?.end,
                        },
                    });
                }
            }
        }),
        { walkMode: WalkMode.visitAllRecursive }
    );

    if (diagnostics.length > 0) {
        file.addDiagnostics(diagnostics);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Namespace / alias detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the list of promise namespaces to watch.
 *
 * Always includes `'promises'` (the default namespace used when the library is
 * used directly or installed via ropm with the default alias).
 *
 * When ropm installs the package under a different alias it renames all files
 * and function prefixes from `promises` to `<alias>`. This function detects
 * those aliases by looking for `roku_modules/<alias>/source/promises.brs` in
 * the program's file list.
 */
function detectNamespaces(program: Program, options: PromisesPluginOptions): string[] {
    const result = new Set<string>([DEFAULT_NAMESPACE]);

    if (options.alias) {
        const aliases = Array.isArray(options.alias) ? options.alias : [options.alias];
        aliases.forEach(a => result.add(a));
        return [...result];
    }

    // Auto-detect from roku_modules directory layout
    const filesMap = (program as any).files as Record<string, unknown> | undefined;
    for (const path of Object.keys(filesMap ?? {})) {
        const normalized = path.replace(/\\/g, '/');
        const m = /roku_modules\/([^/]+)\/source\/promises\.(?:brs|d\.bs)$/i.exec(normalized);
        if (m) {
            result.add(m[1]);
        }
    }

    return [...result];
}

// ─────────────────────────────────────────────────────────────────────────────
// Plugin factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BrighterScript plugin that warns when a context argument is passed to a
 * promise chain function but the inline callback has no parameter to receive it.
 *
 * **Usage in bsconfig.json:**
 * ```json
 * {
 *   "plugins": ["@rokucommunity/promises/plugin"]
 * }
 * ```
 *
 * **Detected patterns:**
 *
 * ```brightscript
 * ' Direct function style
 * promises.onThen(myPromise, function(value)   ' ← warning: missing context param
 *     print value
 * end function, myContext)
 *
 * ' Chain builder style
 * promises.chain(myPromise, myContext)
 *     .then(function(value)                    ' ← warning: missing context param
 *         print value
 *     end function)
 *     .catch(function(err, context)            ' ← ok
 *         print err
 *     end function)
 * ```
 */
function promisesPlugin(options: PromisesPluginOptions = {}): Plugin {
    let namespaces: string[] = [DEFAULT_NAMESPACE];

    return {
        name: 'roku-promises-plugin',

        /**
         * Called once before the program validates any files.
         * All project files (including roku_modules) are already registered
         * in the program at this point, so alias auto-detection is reliable here.
         */
        beforeProgramValidate: function beforeProgramValidate(program: Program) {
            namespaces = detectNamespaces(program, options);
        },

        afterFileValidate: function afterFileValidate(file: BscFile) {
            if (!isBrsFile(file)) {
                return;
            }
            checkFile(file, namespaces);
        },

        onGetCodeActions: function onGetCodeActions(event: OnGetCodeActionsEvent) {
            const srcPath = event.file.srcPath;

            // ── Per-diagnostic quick fixes ────────────────────────────────────
            for (const diag of event.diagnostics) {
                if (diag.code === PromisesDiagnosticCode.ContextParamMissing && diag.data?.insertPosition) {
                    event.codeActions.push(codeActionUtil.createCodeAction({
                        title: 'Add missing context parameter',
                        diagnostics: [diag],
                        isPreferred: true,
                        kind: CodeActionKind.QuickFix,
                        changes: [{
                            type: 'insert',
                            filePath: srcPath,
                            position: diag.data.insertPosition,
                            newText: diag.data.insertText,
                        } as InsertChange],
                    }));
                } else if (diag.code === PromisesDiagnosticCode.ExtraCallbackParam && diag.data?.deleteRange) {
                    event.codeActions.push(codeActionUtil.createCodeAction({
                        title: 'Remove extra parameter(s)',
                        diagnostics: [diag],
                        isPreferred: true,
                        kind: CodeActionKind.QuickFix,
                        changes: [{
                            type: 'delete',
                            filePath: srcPath,
                            range: diag.data.deleteRange,
                        } as DeleteChange],
                    }));
                } else if (diag.code === PromisesDiagnosticCode.ChainMissingToPromise && diag.data?.insertPosition) {
                    event.codeActions.push(codeActionUtil.createCodeAction({
                        title: 'Add \'.toPromise()\'',
                        diagnostics: [diag],
                        isPreferred: true,
                        kind: CodeActionKind.QuickFix,
                        changes: [{
                            type: 'insert',
                            filePath: srcPath,
                            position: diag.data.insertPosition,
                            newText: '.toPromise()',
                        } as InsertChange],
                    }));
                }
            }

            // ── Fix-all actions (shown when 2+ fixable issues exist in the file) ──
            const allFileDiags = event.program.getDiagnostics().filter(
                d => d.file?.srcPath === srcPath
            );

            const allContextParam = allFileDiags.filter(
                d => d.code === PromisesDiagnosticCode.ContextParamMissing && d.data?.insertPosition
            );
            if (allContextParam.length > 1) {
                event.codeActions.push(codeActionUtil.createCodeAction({
                    title: `Add missing context parameter to all callbacks in file (${allContextParam.length})`,
                    diagnostics: allContextParam,
                    kind: CodeActionKind.QuickFix,
                    changes: allContextParam.map(d => ({
                        type: 'insert',
                        filePath: srcPath,
                        position: d.data.insertPosition,
                        newText: d.data.insertText,
                    } as InsertChange)),
                }));
            }

            const allExtraParam = allFileDiags.filter(
                d => d.code === PromisesDiagnosticCode.ExtraCallbackParam && d.data?.deleteRange
            );
            if (allExtraParam.length > 1) {
                event.codeActions.push(codeActionUtil.createCodeAction({
                    title: `Remove extra parameter(s) from all callbacks in file (${allExtraParam.length})`,
                    diagnostics: allExtraParam,
                    kind: CodeActionKind.QuickFix,
                    changes: allExtraParam.map(d => ({
                        type: 'delete',
                        filePath: srcPath,
                        range: d.data.deleteRange,
                    } as DeleteChange)),
                }));
            }

            const allToPromise = allFileDiags.filter(
                d => d.code === PromisesDiagnosticCode.ChainMissingToPromise && d.data?.insertPosition
            );
            if (allToPromise.length > 1) {
                event.codeActions.push(codeActionUtil.createCodeAction({
                    title: `Add '.toPromise()' to all chains in file (${allToPromise.length})`,
                    diagnostics: allToPromise,
                    kind: CodeActionKind.QuickFix,
                    changes: allToPromise.map(d => ({
                        type: 'insert',
                        filePath: srcPath,
                        position: d.data.insertPosition,
                        newText: '.toPromise()',
                    } as InsertChange)),
                }));
            }
        },

        // ── Hover documentation for .then / .catch / .finally ─────────────────
        provideHover: function provideHover(event: ProvideHoverEvent) {
            if (!isBrsFile(event.file)) {
                return;
            }
            const pos = event.position;

            (event.file.ast as any).walk(
                createVisitor({
                    CallExpression: function CallExpression(node: CallExpression) {
                        if (!isDottedGetExpression(node.callee)) {
                            return;
                        }
                        const callee = node.callee;
                        const methodLower = callee.name.text.toLowerCase();
                        if (methodLower !== 'then' && methodLower !== 'catch' && methodLower !== 'finally') {
                            return;
                        }

                        const nameRange = callee.name.range;
                        if (!nameRange || !isPositionInRange(pos, nameRange)) {
                            return;
                        }

                        const chainRoot = findChainRoot(callee.obj, namespaces);
                        if (!chainRoot) {
                            return;
                        }

                        const ctxArg = chainRoot.args[1];
                        const hasContext = Boolean(ctxArg && !isInvalidLiteral(ctxArg));

                        let sig: string;
                        let docs: string;
                        if (methodLower === 'then') {
                            sig = hasContext
                                ? `.then(function(value, context)\n    ' ...\nend function)`
                                : `.then(function(value)\n    ' ...\nend function)`;
                            docs = hasContext
                                ? '- **value** — the resolved value\n- **context** — the value passed to `chain()`'
                                : '- **value** — the resolved value';
                        } else if (methodLower === 'catch') {
                            sig = hasContext
                                ? `.catch(function(error, context)\n    ' ...\nend function)`
                                : `.catch(function(error)\n    ' ...\nend function)`;
                            docs = hasContext
                                ? '- **error** — the rejection value\n- **context** — the value passed to `chain()`'
                                : '- **error** — the rejection value';
                        } else {
                            sig = hasContext
                                ? `.finally(function(context)\n    ' ...\nend function)`
                                : `.finally(function()\n    ' ...\nend function)`;
                            docs = hasContext
                                ? '- **context** — the value passed to `chain()`'
                                : 'Called when the chain settles regardless of outcome.';
                        }

                        event.hovers.push({
                            contents: `\`\`\`brightscript\n${sig}\n\`\`\`\n\n${docs}`,
                            range: nameRange,
                        });
                    },
                }),
                { walkMode: WalkMode.visitAllRecursive }
            );
        },

        // ── Callback snippet completions ──────────────────────────────────────
        provideCompletions: function provideCompletions(event: ProvideCompletionsEvent) {
            if (!isBrsFile(event.file)) {
                return;
            }
            const text: string = (event.file as any).fileContents ?? '';
            const lines = text.split(/\r?\n/);
            const line = lines[event.position.line] ?? '';
            const beforeCursor = line.slice(0, event.position.character);

            const ctx = detectPromiseCallContext(beforeCursor, namespaces);
            if (!ctx) {
                return;
            }

            // insertTextFormat 2 = Snippet, kind 15 = Snippet (LSP constants)
            // eslint-disable-next-line no-template-curly-in-string
            const tabstop = (n: number, label: string) => `\${${n}:${label}}`;
            if (ctx.fnType === 'thenCatch' && ctx.argIndex === 1) {
                event.completions.push(
                    {
                        label: 'function(value, context)',
                        detail: 'Callback with context parameter',
                        insertText: `function(${tabstop(1, 'value')}, ${tabstop(2, 'context')})\n\t$0\nend function`,
                        insertTextFormat: 2,
                        kind: 15,
                        sortText: '00',
                    },
                    {
                        label: 'function(value)',
                        detail: 'Callback (no context)',
                        insertText: `function(${tabstop(1, 'value')})\n\t$0\nend function`,
                        insertTextFormat: 2,
                        kind: 15,
                        sortText: '01',
                    }
                );
            } else if (ctx.fnType === 'finally' && ctx.argIndex === 1) {
                event.completions.push(
                    {
                        label: 'function(context)',
                        detail: 'Finally callback with context',
                        insertText: `function(${tabstop(1, 'context')})\n\t$0\nend function`,
                        insertTextFormat: 2,
                        kind: 15,
                        sortText: '00',
                    },
                    {
                        label: 'function()',
                        detail: 'Finally callback (no context)',
                        insertText: 'function()\n\t$0\nend function',
                        insertTextFormat: 2,
                        kind: 15,
                        sortText: '01',
                    }
                );
            } else if (ctx.fnType === 'chain' && ctx.argIndex === 1) {
                event.completions.push({
                    label: 'context',
                    detail: 'Context value passed through the chain',
                    insertText: tabstop(1, 'context'),
                    insertTextFormat: 2,
                    kind: 15,
                    sortText: '00',
                });
            }
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace promisesPlugin {
    /** The diagnostic code emitted when context is passed but the callback has no parameter to receive it. */
    export const MISSING_CONTEXT_PARAM_CODE = PromisesDiagnosticCode.ContextParamMissing;
    /** The diagnostic code emitted when the callback declares extra parameters that will never receive a value. */
    export const EXTRA_CALLBACK_PARAM_CODE = PromisesDiagnosticCode.ExtraCallbackParam;
    export import DiagnosticCode = PromisesDiagnosticCode;
    export type Options = PromisesPluginOptions;
}

export = promisesPlugin;
