/**
 * This script is used to test the ropm package. It does the following:
 * 1. builds the ropm package
 * 2. renames the package so that npm caching won't accidentally use a cached version from a previous run
 * 3. installs the package with an alias (to ensure ropm is prefixing things correctly)
 * 4. do a brighterscript validation of the package to ensure there are no issues
 */

import { execSync } from 'child_process';
import * as fsExtra from 'fs-extra';
import * as semver from 'semver';
import * as path from 'path';

const rootDir = path.resolve(__dirname, '../');
const tempDir = path.resolve(rootDir, '.tmp');
const testProjectDir = path.resolve(tempDir, 'test-project');

//set during the `run()` function
let renamedPackagePath: string;

function run() {

    //make a temp directory
    fsExtra.emptydirSync(testProjectDir);

    execSync('npm i', { stdio: 'inherit' });
    execSync('npm run package', { stdio: 'inherit' });
    const tgzPackageName = fsExtra
        .readdirSync(rootDir)
        .filter((file) => file.endsWith('.tgz'))
        .sort((a, b) => {
            const aVersion = a.match(/(\d+\.\d+\.\d+.*)\.tgz/)?.[1];
            const bVersion = b.match(/(\d+\.\d+\.\d+.*)\.tgz/)?.[1];
            return semver.rcompare(aVersion, bVersion);
        })[0];
    const tgzPackagePath = path.resolve(rootDir, tgzPackageName);

    renamedPackagePath = `${tempDir}/${path.basename(tgzPackagePath.replace('.tgz', `-${Date.now()}.tgz`))}`;
    //rename the package so that npm caching won't accidentally use a cached version from a previous run
    fsExtra.moveSync(tgzPackagePath, renamedPackagePath);

    //create a temp project to test this package
    execSync(`npm init -y`, { cwd: testProjectDir, stdio: 'inherit' });
    execSync(`npm i brighterscript ropm --save-dev`, {
        cwd: testProjectDir,
        stdio: 'inherit'
    });
    //install the package
    execSync(`npm i "${renamedPackagePath}"`, {
        cwd: testProjectDir,
        stdio: 'inherit'
    });
    //do a ropm install
    execSync(`npx ropm install`, {
        cwd: testProjectDir,
        stdio: 'inherit'
    });

    //create a brighterscript project that uses the stuff from promises
    fsExtra.outputJsonSync(`${testProjectDir}/bsconfig.json`, {
        rootDir: testProjectDir
    });
    fsExtra.outputFileSync(`${testProjectDir}/source/main.bs`, `
        import "pkg:/source/roku_modules/rokucommunity_promises/promises.brs"

        function main()
            'test a normal function from the lib
            promise = rokucommunity.promises.create()

            'use promise chaining
            result = rokucommunity.promises.chain(promise, function(result)
                return rokucommunity.promises.resolve("Hello world")
            end function).toPromise()

            'make sure the internal namespace exists
            uuid = rokucommunity.promises.internal.createUuid()
        end function
    `);

    //do a brighterscript validation of the package to ensure there are no issues
    execSync(`npx bsc --loglevel trace`, {
        cwd: testProjectDir,
        stdio: 'inherit'
    });
}

try {
    run();
    console.log('\n\ntest package script completed successfully');
} finally {
    if (!process.argv.includes('--noclean')) {
        fsExtra.removeSync(tempDir);
        fsExtra.removeSync(renamedPackagePath);
    }
}
