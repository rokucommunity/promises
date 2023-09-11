import { standardizePath as s } from 'brighterscript';
import * as fsExtra from 'fs-extra';

const stagingDir = s`${__dirname}/../dist/`;

//remove the bslib script import
replaceInFile(s`${stagingDir}/components/Promise.xml`,
    [/\r?\n[ \t]*<script[^>]+uri="pkg:\/source\/bslib.brs"\s*\/>/, '']
);

//remove the `promises_` namespace
replaceInFile(s`${stagingDir}/source/promises.brs`,
    [/\bpromises_/g, '']
);

//remove the `promises.namespace stuff` from d.bs files
replaceInFile(s`${stagingDir}/source/promises.d.bs`,
    [/namespace promises\r?\n/, ''],
    [/end namespace\r?\n\s*namespace promises\.internal/, 'namespace internal']
);

function replaceInFile(filePath: string, ...searches: Array<[find: RegExp, replace: string]>) {
    console.log('processing', filePath);
    let text = fsExtra.readFileSync(filePath)?.toString();
    for (const [find, replace] of searches) {
        text = text.replace(find, replace);
    }
    fsExtra.outputFileSync(filePath, text);
}