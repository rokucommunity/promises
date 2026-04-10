import {
    type Plugin,
    type Program,
    type BscFile,
    type BsDiagnostic,
    type CallExpression,
    type Expression,
    type LiteralExpression,
    type ReturnStatement,
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

/** Chain builder methods that pass context through from chain() */
const CHAIN_BUILDER_METHODS = new Set(['then', 'catch', 'finally', 'topromise']);

/** Diagnostic codes emitted by the promises plugin. */
enum PromisesDiagnosticCode {
    /** A context argument was passed but the inline callback has no parameter to receive it. */
    ContextParamMissing = 'PRMS1001',
    /** A chain expression was returned without calling `.toPromise()` first. */
    ChainMissingToPromise = 'PRMS1002',
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
 * Walks backwards up a method call chain to find the root `chain()` call.
 *
 * ```brightscript
 * promises.chain(promise, ctx)   ← we want this (namespace style)
 * promises_chain(promise, ctx)   ← or this (flat/ropm style)
 *     .then(cb1)
 *     .catch(cb2)                ← walking up from here
 * ```
 *
 * Returns the `chain()` `CallExpression` only if it was called with a
 * non-`invalid` context argument, otherwise returns `null`.
 */
function findChainCallWithContext(expr: Expression, namespaces: string[]): CallExpression | null {
    if (!isCallExpression(expr)) {
        return null;
    }

    const ce = expr as CallExpression;

    if (isDottedGetExpression(ce.callee)) {
        const method = ce.callee.name.text.toLowerCase();

        // Keep walking up through chain builder methods
        if (CHAIN_BUILDER_METHODS.has(method)) {
            return findChainCallWithContext(ce.callee.obj, namespaces);
        }

        // Namespace-style chain call: promises.chain(...) / alias.chain(...)
        if (method === 'chain') {
            const lowerNs = (isVariableExpression(ce.callee.obj)
                ? (ce.callee.obj as any).name?.text as string
                : ''
            ).toLowerCase();
            if (namespaces.some(n => n.toLowerCase() === lowerNs)) {
                const ctxArg = ce.args[1];
                if (ctxArg && !isInvalidLiteral(ctxArg)) {
                    return ce;
                }
            }
        }
    } else if (isVariableExpression(ce.callee)) {
        // Flat-function style: promises_chain(...) / alias_chain(...)
        const lowerName = ((ce.callee as any).name?.text as string ?? '').toLowerCase();
        for (const ns of namespaces) {
            if (lowerName === `${ns.toLowerCase()}_chain`) {
                const ctxArg = ce.args[1];
                if (ctxArg && !isInvalidLiteral(ctxArg)) {
                    return ce;
                }
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
    return {
        file: file,
        range: callbackArg.range,
        severity: DiagnosticSeverity.Warning,
        source: 'roku-promises-plugin',
        code: PromisesDiagnosticCode.ContextParamMissing,
        message: `'${displayName}' was called with a context argument, but the inline callback has no parameter to receive it. ${hint}`,
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
                    if (ctxArg && !isInvalidLiteral(ctxArg)) {
                        const cbArg = node.args[1];
                        if (cbArg) {
                            const paramCount = getInlineParamCount(cbArg);
                            if (paramCount !== null) {
                                const need = match.type === 'finally' ? 1 : 2;
                                if (paramCount < need) {
                                    const diag = makeDiagnostic(match.displayName, match.type === 'finally', cbArg, file);
                                    if (diag) {
                                        diagnostics.push(diag);
                                    }
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

                if (!findChainCallWithContext(callee.obj, namespaces)) {
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
                const need = isChainFinally ? 1 : 2;
                if (paramCount < need) {
                    const diag = makeDiagnostic(`.${method}`, isChainFinally, cbArg, file);
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
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace promisesPlugin {
    /** The diagnostic code emitted when context is passed but the callback has no parameter to receive it. */
    export const MISSING_CONTEXT_PARAM_CODE = PromisesDiagnosticCode.ContextParamMissing;
    export import DiagnosticCode = PromisesDiagnosticCode;
    export type Options = PromisesPluginOptions;
}

export = promisesPlugin;
