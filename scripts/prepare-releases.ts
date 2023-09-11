/**
 * the github releases package should INCLUDE the `promises_` prefixes, so run this script 
 * right afer the brighterscript build, before regex renaming
 */
import { rokuDeploy } from 'roku-deploy';
import { standardizePath as s } from 'brighterscript';
import { execSync } from 'child_process';
import * as fsExtra from 'fs-extra';
const versionReplacement = [/\$\{VERSION_NUMBER\}/, 'v' + fsExtra.readJsonSync(`${__dirname}/../package.json`).version] as [RegExp, string];

const distDir = s`${__dirname}/../dist`;

async function run() {
    //transpile
    execSync('npm run build', { cwd: s`${__dirname}/..`, stdio: 'inherit' });

    setVersionNumber();
    await removeBslib();
    await createGithubReleaseZip();
    await prepareForNpm();

    execSync('npm pack', { cwd: s`${__dirname}/..`, stdio: 'inherit' });
}

function setVersionNumber() {
    //remove the bslib script import because we're not actually using anything from it
    replaceInFile(s`${distDir}/components/Promise.xml`, versionReplacement);
    replaceInFile(s`${distDir}/source/promises.brs`, versionReplacement);
    replaceInFile(s`${distDir}/source/promises.d.bs`, versionReplacement);
}

function removeBslib() {
    //remove the bslib script import because we're not actually using anything from it
    replaceInFile(s`${distDir}/components/Promise.xml`,
        [/\r?\n[ \t]*<script[^>]+uri="pkg:\/source\/bslib.brs"\s*\/>/, ''],
        versionReplacement
    );
}

async function createGithubReleaseZip() {
    await rokuDeploy.zipFolder(
        s`${__dirname}/../dist`,
        s`${__dirname}/../promises.zip`,
        undefined,
        [
            'components/Promise.xml',
            'source/promises.brs',
            'source/promises.d.bs'
        ]
    );
}

async function prepareForNpm() {
    //remove the `promises_` namespace
    replaceInFile(s`${distDir}/source/promises.brs`,
        [/\bpromises_/g, ''],
        versionReplacement
    );

    //remove the `promises.namespace stuff` from d.bs files
    replaceInFile(s`${distDir}/source/promises.d.bs`,
        [/namespace promises\r?\n/, ''],
        [/end namespace\r?\n\s*namespace promises\.internal/, 'namespace internal'],
        versionReplacement
    );
}

function replaceInFile(filePath: string, ...searches: Array<[find: RegExp, replace: string]>) {
    console.log('processing', filePath);
    let text = fsExtra.readFileSync(filePath)?.toString();
    for (const [find, replace] of searches) {
        text = text.replace(find, replace);
    }
    fsExtra.outputFileSync(filePath, text);
}


run().catch(e => {
    console.error(e);
    process.exit(1);
});