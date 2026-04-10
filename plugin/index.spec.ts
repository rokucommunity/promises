import { expect } from 'chai';
import { type BsDiagnostic, type CodeAction, Program } from 'brighterscript';
import promisesPlugin = require('./index');

const DIAG_CODE = promisesPlugin.MISSING_CONTEXT_PARAM_CODE;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Wraps a snippet in a sub so it's valid BrightScript. */
function inSub(snippet: string): string {
    return `
        sub test()
            promise = invalid
            myContext = {}
            ${snippet}
        end sub
    `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite
// ─────────────────────────────────────────────────────────────────────────────

describe('roku-promises-plugin', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program({ rootDir: '/' });
        program.plugins.add(promisesPlugin());
    });

    afterEach(() => {
        program.dispose();
    });

    /**
     * Sets source/test.bs with the given snippet, validates the program, and
     * returns only the diagnostics emitted by this plugin.
     */
    function validate(snippet: string) {
        program.setFile('source/test.bs', inSub(snippet));
        program.validate();
        return program.getDiagnostics().filter(d => d.code === DIAG_CODE);
    }

    // ── onThen ────────────────────────────────────────────────────────────────

    describe('onThen', () => {
        it('no diagnostic when callback accepts 2 params and context is provided', () => {
            expect(validate(`
                promises.onThen(promise, function(value, context)
                end function, myContext)
            `)).to.be.empty;
        });

        it('no diagnostic when no context argument is provided', () => {
            expect(validate(`
                promises.onThen(promise, function(value)
                end function)
            `)).to.be.empty;
        });

        it('no diagnostic when invalid is passed as context', () => {
            expect(validate(`
                promises.onThen(promise, function(value)
                end function, invalid)
            `)).to.be.empty;
        });

        it('no diagnostic when callback is a variable reference (not inline)', () => {
            expect(validate(`
                myCallback = function(value)
                end function
                promises.onThen(promise, myCallback, myContext)
            `)).to.be.empty;
        });

        it('warns when callback has 1 param but context is provided', () => {
            const diags = validate(`
                promises.onThen(promise, function(value)
                end function, myContext)
            `);
            expect(diags).to.have.lengthOf(1);
            expect(diags[0].message).to.include('onThen');
        });

        it('warns when callback has 0 params but context is provided', () => {
            expect(validate(`
                promises.onThen(promise, sub()
                end sub, myContext)
            `)).to.have.lengthOf(1);
        });

        it('diagnostic range points at the callback, not the whole call', () => {
            const diags = validate(`
                promises.onThen(promise, function(value)
                end function, myContext)
            `);
            expect(diags).to.have.lengthOf(1);
            // The squiggle should be on the function expression, not line 0
            expect(diags[0].range.start.line).to.be.greaterThan(0);
        });
    });

    // ── onCatch ───────────────────────────────────────────────────────────────

    describe('onCatch', () => {
        it('no diagnostic when callback accepts 2 params and context is provided', () => {
            expect(validate(`
                promises.onCatch(promise, function(error, context)
                end function, myContext)
            `)).to.be.empty;
        });

        it('no diagnostic when no context argument is provided', () => {
            expect(validate(`
                promises.onCatch(promise, function(error)
                end function)
            `)).to.be.empty;
        });

        it('warns when callback has 1 param but context is provided', () => {
            const diags = validate(`
                promises.onCatch(promise, function(error)
                end function, myContext)
            `);
            expect(diags).to.have.lengthOf(1);
            expect(diags[0].message).to.include('onCatch');
        });
    });

    // ── onFinally ─────────────────────────────────────────────────────────────

    describe('onFinally', () => {
        it('no diagnostic when callback accepts 1 param and context is provided', () => {
            expect(validate(`
                promises.onFinally(promise, sub(context)
                end sub, myContext)
            `)).to.be.empty;
        });

        it('no diagnostic when no context argument is provided', () => {
            expect(validate(`
                promises.onFinally(promise, sub()
                end sub)
            `)).to.be.empty;
        });

        it('warns when callback has 0 params but context is provided', () => {
            const diags = validate(`
                promises.onFinally(promise, sub()
                end sub, myContext)
            `);
            expect(diags).to.have.lengthOf(1);
            expect(diags[0].message).to.include('onFinally');
        });

        it('hint message says to add a first parameter (not second)', () => {
            const diags = validate(`
                promises.onFinally(promise, sub()
                end sub, myContext)
            `);
            expect(diags[0].message).to.include('first parameter');
        });
    });

    // ── chain API ─────────────────────────────────────────────────────────────

    describe('chain API', () => {
        it('no diagnostic when .then callback has 2 params and chain has context', () => {
            expect(validate(`
                promises.chain(promise, myContext).then(function(value, context)
                end function)
            `)).to.be.empty;
        });

        it('no diagnostic when chain is called without context', () => {
            expect(validate(`
                promises.chain(promise).then(function(value)
                end function)
            `)).to.be.empty;
        });

        it('no diagnostic when chain context is invalid literal', () => {
            expect(validate(`
                promises.chain(promise, invalid).then(function(value)
                end function)
            `)).to.be.empty;
        });

        it('warns when .then callback has 1 param but chain has context', () => {
            const diags = validate(`
                promises.chain(promise, myContext).then(function(value)
                end function)
            `);
            expect(diags).to.have.lengthOf(1);
            expect(diags[0].message).to.include('.then');
        });

        it('warns when .catch callback has 1 param but chain has context', () => {
            const diags = validate(`
                promises.chain(promise, myContext).catch(function(error)
                end function)
            `);
            expect(diags).to.have.lengthOf(1);
            expect(diags[0].message).to.include('.catch');
        });

        it('warns when .finally callback has 0 params but chain has context', () => {
            const diags = validate(`
                promises.chain(promise, myContext).finally(sub()
                end sub)
            `);
            expect(diags).to.have.lengthOf(1);
            expect(diags[0].message).to.include('.finally');
        });

        it('no diagnostic when .finally callback has 1 param and chain has context', () => {
            expect(validate(`
                promises.chain(promise, myContext).finally(sub(context)
                end sub)
            `)).to.be.empty;
        });

        it('emits one diagnostic per missing param across a multi-method chain', () => {
            // .then is missing context param, .catch has it, .finally is missing
            expect(validate(`
                promises.chain(promise, myContext).then(function(value)
                end function).catch(function(error, context)
                end function).finally(sub()
                end sub)
            `)).to.have.lengthOf(2);
        });
    });

    // ── ropm alias detection ──────────────────────────────────────────────────

    describe('ropm alias detection', () => {
        it('detects alias from roku_modules directory and applies the rule', () => {
            program.setFile('roku_modules/myAlias/source/promises.brs', '');
            program.setFile('source/test.bs', inSub(`
                myAlias_onThen(promise, function(value)
                end function, myContext)
            `));
            program.validate();
            const diags = program.getDiagnostics().filter(d => d.code === DIAG_CODE);
            expect(diags).to.have.lengthOf(1);
        });

        it('does not warn for an unknown alias', () => {
            // No roku_modules entry for "unknownAlias" — should produce no diagnostic
            program.setFile('source/test.bs', inSub(`
                unknownAlias_onThen(promise, function(value)
                end function, myContext)
            `));
            program.validate();
            const diags = program.getDiagnostics().filter(d => d.code === DIAG_CODE);
            expect(diags).to.be.empty;
        });

        it('supports multiple aliases simultaneously', () => {
            program.setFile('roku_modules/aliasA/source/promises.brs', '');
            program.setFile('roku_modules/aliasB/source/promises.brs', '');
            program.setFile('source/test.bs', inSub(`
                aliasA_onThen(promise, function(value)
                end function, myContext)
                aliasB_onThen(promise, function(value)
                end function, myContext)
            `));
            program.validate();
            const diags = program.getDiagnostics().filter(d => d.code === DIAG_CODE);
            expect(diags).to.have.lengthOf(2);
        });

        it('applies alias to chain API as well', () => {
            program.setFile('roku_modules/myAlias/source/promises.brs', '');
            program.setFile('source/test.bs', inSub(`
                myAlias_chain(promise, myContext).then(function(value)
                end function)
            `));
            program.validate();
            const diags = program.getDiagnostics().filter(d => d.code === DIAG_CODE);
            expect(diags).to.have.lengthOf(1);
        });
    });

    // ── Shared code-action helpers ────────────────────────────────────────────

    /** Returns all newText strings across every workspace edit in the action. */
    function insertedTexts(action: CodeAction): string[] {
        const result: string[] = [];
        for (const edits of Object.values(action.edit?.changes ?? {})) {
            for (const edit of edits) {
                result.push(edit.newText);
            }
        }
        return result;
    }

    /** Validates the current file state and returns code actions at the first matching diagnostic. */
    function codeActionsFor(code: string): CodeAction[] {
        program.validate();
        const diag = program.getDiagnostics().find(d => d.code === code) as BsDiagnostic;
        if (!diag) {
            return [];
        }
        return program.getCodeActions(diag.file.srcPath, diag.range);
    }

    const CHAIN_RETURN_CODE = promisesPlugin.DiagnosticCode.ChainMissingToPromise;

    describe('chain .toPromise()', () => {
        it('no warning when .toPromise() is called', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise).then(function(value)
                    end function).toPromise()
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.be.empty;
        });

        it('no warning when chain result is not returned', () => {
            program.setFile('source/test.bs', inSub(`
                promises.chain(promise).then(function(value)
                end function)
            `));
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.be.empty;
        });

        it('warns when .then() result is returned without .toPromise()', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise).then(function(value)
                    end function)
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.have.lengthOf(1);
        });

        it('warns when .catch() result is returned without .toPromise()', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise).catch(function(err)
                    end function)
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.have.lengthOf(1);
        });

        it('warns when multi-step chain is returned without .toPromise()', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise).then(function(value)
                    end function).catch(function(err)
                    end function)
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.have.lengthOf(1);
        });

        it('warns when chain root is returned directly without any method call', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise)
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.have.lengthOf(1);
        });

        it('warns inside a .then() callback that returns a sub-chain without .toPromise()', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise).then(function(value)
                        return promises.chain(promise).then(function(inner)
                        end function)
                    end function).toPromise()
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.have.lengthOf(1);
        });

        it('no warning for an unrelated object with a .then() method', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    builder = { then: function(cb) : return m : end function }
                    return builder.then(myCallback)
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.be.empty;
        });

        it('warns when using ropm alias without .toPromise()', () => {
            program.setFile('roku_modules/myAlias/source/promises.brs', '');
            program.setFile('source/test.bs', `
                function doWork() as object
                    return myAlias_chain(promise).then(function(value)
                    end function)
                end function
            `);
            program.validate();
            expect(program.getDiagnostics().filter(d => d.code === CHAIN_RETURN_CODE)).to.have.lengthOf(1);
        });
    });

    // ── Code actions ──────────────────────────────────────────────────────────

    describe('code actions: PRMS1001 add context parameter', () => {
        it('inserts "value, context" when callback has 0 params', () => {
            program.setFile('source/test.bs', inSub(
                'promises.onThen(promise, function() end function, myContext)'
            ));
            const actions = codeActionsFor(DIAG_CODE);
            const fix = actions.find(a => a.title === 'Add missing context parameter');
            expect(fix).to.exist;
            expect(fix!.isPreferred).to.be.true;
            expect(insertedTexts(fix!)).to.include('value, context');
        });

        it('inserts ", context" when callback already has 1 param', () => {
            program.setFile('source/test.bs', inSub(
                'promises.onThen(promise, function(value) end function, myContext)'
            ));
            const actions = codeActionsFor(DIAG_CODE);
            const fix = actions.find(a => a.title === 'Add missing context parameter');
            expect(fix).to.exist;
            expect(insertedTexts(fix!)).to.include(', context');
        });

        it('inserts "context" as first param for onFinally', () => {
            program.setFile('source/test.bs', inSub(
                'promises.onFinally(promise, function() end function, myContext)'
            ));
            const actions = codeActionsFor(DIAG_CODE);
            const fix = actions.find(a => a.title === 'Add missing context parameter');
            expect(fix).to.exist;
            expect(insertedTexts(fix!)).to.deep.equal(['context']);
        });

        it('offers fix-all when multiple PRMS1001 diagnostics exist in the file', () => {
            program.setFile('source/test.bs', inSub(`
                promises.onThen(promise, function() end function, myContext)
                promises.onThen(promise, function() end function, myContext)
            `));
            const actions = codeActionsFor(DIAG_CODE);
            const fixAll = actions.find(a => a.title.includes('all') && a.title.includes('(2)'));
            expect(fixAll).to.exist;
            expect(insertedTexts(fixAll!)).to.have.lengthOf(2);
        });

        it('does not offer fix-all when only one PRMS1001 exists', () => {
            program.setFile('source/test.bs', inSub(
                'promises.onThen(promise, function() end function, myContext)'
            ));
            const actions = codeActionsFor(DIAG_CODE);
            const fixAll = actions.find(a => a.title.includes('all'));
            expect(fixAll).to.be.undefined;
        });
    });

    describe('code actions: PRMS1002 add .toPromise()', () => {
        it('inserts ".toPromise()" at the end of the chain expression', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise).then(function(value)
                    end function)
                end function
            `);
            const actions = codeActionsFor(CHAIN_RETURN_CODE);
            const fix = actions.find(a => a.title.includes('.toPromise()'));
            expect(fix).to.exist;
            expect(fix!.isPreferred).to.be.true;
            expect(insertedTexts(fix!)).to.deep.equal(['.toPromise()']);
        });

        it('offers fix-all when multiple PRMS1002 diagnostics exist in the file', () => {
            program.setFile('source/test.bs', `
                function doWork1() as object
                    return promises.chain(promise).then(function(value)
                    end function)
                end function
                function doWork2() as object
                    return promises.chain(promise).catch(function(err)
                    end function)
                end function
            `);
            const actions = codeActionsFor(CHAIN_RETURN_CODE);
            const fixAll = actions.find(a => a.title.includes('all') && a.title.includes('(2)'));
            expect(fixAll).to.exist;
            expect(insertedTexts(fixAll!)).to.deep.equal(['.toPromise()', '.toPromise()']);
        });

        it('does not offer fix-all when only one PRMS1002 exists', () => {
            program.setFile('source/test.bs', `
                function doWork() as object
                    return promises.chain(promise).then(function(value)
                    end function)
                end function
            `);
            const actions = codeActionsFor(CHAIN_RETURN_CODE);
            const fixAll = actions.find(a => a.title.includes('all'));
            expect(fixAll).to.be.undefined;
        });
    });
});
