# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.6.4](https://github.com/rokucommunity/promises/compare/0.6.3...v0.6.4) - 2025-06-10
### Added
 - Add linting ([#42](https://github.com/rokucommunity/promises/pull/42))
 - added [@rokucommunity/bslint@0.8.32](https://github.com/rokucommunity/bslint)
### Changed
 - Shared CI Support Prerelease ([#43](https://github.com/rokucommunity/promises/pull/43))
 - Migrate to Shared CI ([#41](https://github.com/rokucommunity/promises/pull/41))
 - Update the demo with the latest code ([#37](https://github.com/rokucommunity/promises/pull/37))
 - upgrade to [brighterscript@0.69.10](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06910---2025-06-03). Notable changes since 0.65.5:
     - chore: Shared CI remove merged check on publish releases ([#1494](https://github.com/rokucommunity/promises/pull/1494))
     - removed no-throw-literal lint rule ([#1489](https://github.com/rokucommunity/promises/pull/1489))
     - Add `bsc0` cli binary name ([#1490](https://github.com/rokucommunity/promises/pull/1490))
     - Shared CI Support Prerelease ([#1483](https://github.com/rokucommunity/promises/pull/1483))
     - Shared CI Support Prerelease ([#1475](https://github.com/rokucommunity/promises/pull/1475))
     - Prevent runtime crash for non-referencable funcs in ternary and null coalescing ([#1474](https://github.com/rokucommunity/promises/pull/1474))
     - Fix `removeParameterTypes` compile errors for return types ([#1414](https://github.com/rokucommunity/promises/pull/1414))
     - Remove `npm ci` from the `package` npm script since it's redundant ([#1461](https://github.com/rokucommunity/promises/pull/1461))
     - Flag incorrect return statements in functions and subs ([#1463](https://github.com/rokucommunity/promises/pull/1463))
     - Updated the type definition of the `InStr` global callable ([#1456](https://github.com/rokucommunity/promises/pull/1456))
     - More safely wrap expressions for template string transpile ([#1445](https://github.com/rokucommunity/promises/pull/1445))
     - Migration to the new shared CI ([#1440](https://github.com/rokucommunity/promises/pull/1440))
     - Support plugin factory detecting brighterscript version ([#1438](https://github.com/rokucommunity/promises/pull/1438))
     - Fixed getClosestExpression bug to return undefined when position not found ([#1433](https://github.com/rokucommunity/promises/pull/1433))
     - Adds Alias statement syntax from v1 to v0 ([#1430](https://github.com/rokucommunity/promises/pull/1430))
     - Remove temporary code that was accidentally committed ([#1432](https://github.com/rokucommunity/promises/pull/1432))
     - Significantly improve the performance of standardizePath ([#1425](https://github.com/rokucommunity/promises/pull/1425))
     - Bump @babel/runtime from 7.24.5 to 7.26.10 ([#1426](https://github.com/rokucommunity/promises/pull/1426))
     - Backport v1 typecast syntax to v0 ([#1421](https://github.com/rokucommunity/promises/pull/1421))
     - Prevent running the lsp project in a worker thread ([#1423](https://github.com/rokucommunity/promises/pull/1423))
     - Language Server Rewrite ([#993](https://github.com/rokucommunity/promises/pull/993))
     - Add `validate` flag to ProgramBuilder.run() ([#1409](https://github.com/rokucommunity/promises/pull/1409))
     - Fix class transpile issue with child class constructor not inherriting parent params ([#1390](https://github.com/rokucommunity/promises/pull/1390))
     - Export more items ([#1394](https://github.com/rokucommunity/promises/pull/1394))
     - Add more convenience exports from vscode-languageserver ([#1359](https://github.com/rokucommunity/promises/pull/1359))
     - Fix bug with ternary transpile for indexed set ([#1357](https://github.com/rokucommunity/promises/pull/1357))
     - Bump cross-spawn from 7.0.3 to 7.0.6 in /benchmarks ([#1349](https://github.com/rokucommunity/promises/pull/1349))
     - Add Namespace Source Literals ([#1353](https://github.com/rokucommunity/promises/pull/1353))
     - [Proposal] Add Namespace Source Literals ([#1354](https://github.com/rokucommunity/promises/pull/1354))
     - Enhance lexer to support long numeric literals with type designators ([#1351](https://github.com/rokucommunity/promises/pull/1351))
     - Fix issues with the ast walkArray function ([#1347](https://github.com/rokucommunity/promises/pull/1347))
     - Optimize ternary transpilation for assignments ([#1341](https://github.com/rokucommunity/promises/pull/1341))
     - Fix namespace-relative transpile bug for standalone file ([#1324](https://github.com/rokucommunity/promises/pull/1324))
     - Update README.md with "help" items ([3abcdaf3](https://github.com/rokucommunity/promises/commit/3abcdaf3))
     - Prevent crash when ProgramBuilder.run called with no options ([#1316](https://github.com/rokucommunity/promises/pull/1316))
     - Ast node clone ([#1281](https://github.com/rokucommunity/promises/pull/1281))
     - Bump micromatch from 4.0.5 to 4.0.8 in /benchmarks ([#1295](https://github.com/rokucommunity/promises/pull/1295))
     - Bump micromatch from 4.0.4 to 4.0.8 ([#1292](https://github.com/rokucommunity/promises/pull/1292))
     - Add support for resolving sourceRoot at time of config load ([#1290](https://github.com/rokucommunity/promises/pull/1290))
     - Add support for roIntrinsicDouble ([#1291](https://github.com/rokucommunity/promises/pull/1291))
     - Add plugin naming convention ([#1284](https://github.com/rokucommunity/promises/pull/1284))
     - Bump requirejs from 2.3.6 to 2.3.7 ([#1269](https://github.com/rokucommunity/promises/pull/1269))
     - Add templatestring support for annotation.getArguments() ([#1264](https://github.com/rokucommunity/promises/pull/1264))
     - Update Digitial Picture Frame url and img ([#1237](https://github.com/rokucommunity/promises/pull/1237))
     - Fix crash with missing scope ([#1234](https://github.com/rokucommunity/promises/pull/1234))
     - Bump braces from 3.0.2 to 3.0.3 in /benchmarks ([#1229](https://github.com/rokucommunity/promises/pull/1229))
     - fix: conform bsconfig.schema.json to strict types ([#1205](https://github.com/rokucommunity/promises/pull/1205))
     - Flag using devDependency in production code ([#1222](https://github.com/rokucommunity/promises/pull/1222))
     - Fix crash with optional chaining in signature help ([#1207](https://github.com/rokucommunity/promises/pull/1207))
     - Logger nocolor ([#1189](https://github.com/rokucommunity/promises/pull/1189))
     - Fix crash when diagnostic is missing range ([#1174](https://github.com/rokucommunity/promises/pull/1174))
     - Fix formatting with logger output ([#1171](https://github.com/rokucommunity/promises/pull/1171))
     - Move function calls to separate diagnostic ([#1169](https://github.com/rokucommunity/promises/pull/1169))
     - fix: resolve the stagingDir option relative to the bsconfig.json file ([#1148](https://github.com/rokucommunity/promises/pull/1148))
     - Bump tar from 6.1.13 to 6.2.1 in /benchmarks ([#1131](https://github.com/rokucommunity/promises/pull/1131))
     - Fix node14 issues ([#1153](https://github.com/rokucommunity/promises/pull/1153))
     - Upgrade to @rokucommunity/logger ([#1137](https://github.com/rokucommunity/promises/pull/1137))
     - Improve workspace/document symbol handling ([#1120](https://github.com/rokucommunity/promises/pull/1120))
     - Plugin hook provide workspace symbol ([#1118](https://github.com/rokucommunity/promises/pull/1118))
     - Upgade LSP packages ([#1117](https://github.com/rokucommunity/promises/pull/1117))
     - Add plugin hook for documentSymbol ([#1116](https://github.com/rokucommunity/promises/pull/1116))
     - Increase max param count to 63 ([#1112](https://github.com/rokucommunity/promises/pull/1112))
     - Prevent unused variable warnings on ternary and null coalescence expressions ([#1101](https://github.com/rokucommunity/promises/pull/1101))
     - Support when tokens have null ranges ([#1072](https://github.com/rokucommunity/promises/pull/1072))
     - Support whitespace in conditional compile keywords ([#1090](https://github.com/rokucommunity/promises/pull/1090))
     - Add `create-test-package` command for easier tgz testing ([#1088](https://github.com/rokucommunity/promises/pull/1088))
     - Allow negative patterns in diagnostic filters ([#1078](https://github.com/rokucommunity/promises/pull/1078))
     - Bump ip from 2.0.0 to 2.0.1 in /benchmarks ([#1079](https://github.com/rokucommunity/promises/pull/1079))
     - Reduce null safety issues in Statement and Expression subclasses ([#1033](https://github.com/rokucommunity/promises/pull/1033))
     - TBD-204: Empty interfaces break the parser ([#1082](https://github.com/rokucommunity/promises/pull/1082))
     - fix maestro link ([#1068](https://github.com/rokucommunity/promises/pull/1068))
     - Add support for `provideReferences` in plugins ([#1066](https://github.com/rokucommunity/promises/pull/1066))
     - Fix sourcemap comment and add `file` prop to map ([#1064](https://github.com/rokucommunity/promises/pull/1064))
     - Allow v1 syntax: built-in types for class member types and type declarations on lhs ([#1059](https://github.com/rokucommunity/promises/pull/1059))
     - Move `coveralls-next` to a devDependency since it's not needed at runtime ([#1051](https://github.com/rokucommunity/promises/pull/1051))
     - Fix parsing issues with multi-index IndexedSet and IndexedGet ([#1050](https://github.com/rokucommunity/promises/pull/1050))
     - Add plugin hooks for getDefinition ([#1045](https://github.com/rokucommunity/promises/pull/1045))
     - Backport v1 syntax changes ([#1034](https://github.com/rokucommunity/promises/pull/1034))
     - Refactor bsconfig documentation ([#1024](https://github.com/rokucommunity/promises/pull/1024))
     - Prevent overwriting the Program._manifest if already set on startup ([#1027](https://github.com/rokucommunity/promises/pull/1027))
     - Improving null safety: Add FinalizedBsConfig and tweak plugin events ([#1000](https://github.com/rokucommunity/promises/pull/1000))
     - adds support for libpkg prefix ([#1017](https://github.com/rokucommunity/promises/pull/1017))
     - add documentation on pruneEmptyCodeFiles to the README ([#1012](https://github.com/rokucommunity/promises/pull/1012))
     - Assign .program to the builder BEFORE calling afterProgram ([#1011](https://github.com/rokucommunity/promises/pull/1011))
     - Prevent publishing of empty files ([#997](https://github.com/rokucommunity/promises/pull/997))
     - Improve null safety ([#996](https://github.com/rokucommunity/promises/pull/996))
     - Prevent errors when using enums in a file that's not included in any scopes ([#995](https://github.com/rokucommunity/promises/pull/995))
     - Fix multi-namespace class inheritance transpile bug ([#990](https://github.com/rokucommunity/promises/pull/990))
     - Add check for onChange function ([#941](https://github.com/rokucommunity/promises/pull/941))
     - Fix broken enum transpiling ([#985](https://github.com/rokucommunity/promises/pull/985))
     - Fix out-of-date transpile blocks in docs ([#956](https://github.com/rokucommunity/promises/pull/956))
     - Add `optional` modifier for interface and class members ([#955](https://github.com/rokucommunity/promises/pull/955))
     - Use regex for faster manifest/typedef detection ([#976](https://github.com/rokucommunity/promises/pull/976))
     - fix the create-package script ([#974](https://github.com/rokucommunity/promises/pull/974))
     - Correct RANGE in template string when dealing with quotes in annotations ([#975](https://github.com/rokucommunity/promises/pull/975))
     - Add manifest loading from files ([#942](https://github.com/rokucommunity/promises/pull/942))
     - Fix for the fix ([#953](https://github.com/rokucommunity/promises/pull/953))
     - Enums as class initial values ([#950](https://github.com/rokucommunity/promises/pull/950))
     - Add create-package label build script ([#945](https://github.com/rokucommunity/promises/pull/945))
     - Fix issue with unary expression parsing ([#938](https://github.com/rokucommunity/promises/pull/938))
     - ci: Don't run `test-related-projects` on release since it already ran on build ([157fc2ee](https://github.com/rokucommunity/promises/commit/157fc2ee))
     - Bump postcss from 8.2.15 to 8.4.31 ([#928](https://github.com/rokucommunity/promises/pull/928))
     - Add interface parameter support ([#924](https://github.com/rokucommunity/promises/pull/924))
     - Better typing for `Deferred` ([#923](https://github.com/rokucommunity/promises/pull/923))
     - fix bug in --noproject flag logic ([#922](https://github.com/rokucommunity/promises/pull/922))
     - Add some more details to the plugins docs ([#913](https://github.com/rokucommunity/promises/pull/913))
     - Fix incorrect quasi location in template string ([#921](https://github.com/rokucommunity/promises/pull/921))
     - Fix UnaryExpression transpile for ns and const ([#914](https://github.com/rokucommunity/promises/pull/914))
     - Add missing emitDefinitions to docs and fix iface ([#893](https://github.com/rokucommunity/promises/pull/893))
     - add noProject flag to bsc so BSConfig.json not expected ([#868](https://github.com/rokucommunity/promises/pull/868))
 - upgrade to [roku-deploy@3.12.6](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3126---2025-06-03). Notable changes since 3.10.3:
     - chore: Upgrade to the undent package instead of dedent ([#196](https://github.com/rokucommunity/promises/pull/196))
     - chore: Shared CI remove merged check on publish releases ([#194](https://github.com/rokucommunity/promises/pull/194))
     - Add missing template workflows for shared ci ([#189](https://github.com/rokucommunity/promises/pull/189))
     - Shared CI Support Prerelease ([#185](https://github.com/rokucommunity/promises/pull/185))
     - fixed an issue with 577 error codes ([#182](https://github.com/rokucommunity/promises/pull/182))
     - Fix issues with detecting "check for updates required" ([#181](https://github.com/rokucommunity/promises/pull/181))
     - Identify when a 577 error is thrown, send a new developer friendly message ([#180](https://github.com/rokucommunity/promises/pull/180))
     - Bump dependencies to remove audit issues ([#178](https://github.com/rokucommunity/promises/pull/178))
     - fixes #175 - updated regex to find a signed package on `/plugin_package` page ([#176](https://github.com/rokucommunity/promises/pull/176))
     - Fix bug with absolute paths and getDestPath ([#171](https://github.com/rokucommunity/promises/pull/171))
     - fix-node14 ([#165](https://github.com/rokucommunity/promises/pull/165))
     - Support overriding various package upload form data ([#136](https://github.com/rokucommunity/promises/pull/136))
     - Retry the convertToSquahsfs request given the HPE_INVALID_CONSTANT error ([#145](https://github.com/rokucommunity/promises/pull/145))
     - Update wrong host password error message ([#134](https://github.com/rokucommunity/promises/pull/134))
     - Wait for file stream to close before resolving promise ([#133](https://github.com/rokucommunity/promises/pull/133))
     - Add public function to normalize device-info field values ([#129](https://github.com/rokucommunity/promises/pull/129))
     - Add better device-info docs ([#128](https://github.com/rokucommunity/promises/pull/128))
     - Added some more message grabbing logic ([#127](https://github.com/rokucommunity/promises/pull/127))
     - Enhance getDeviceInfo() method ([#120](https://github.com/rokucommunity/promises/pull/120))
 - upgrade to [rooibos-roku@5.15.7](https://github.com/rokucommunity/rooibos/blob/master/CHANGELOG.md#5157---2025-04-16). Notable changes since 5.15.6:
     - Migrate to Shared CI ([#327](https://github.com/rokucommunity/promises/pull/327))
     - Docs restructuring ([#331](https://github.com/rokucommunity/promises/pull/331))
     - Fixed indentations ([#334](https://github.com/rokucommunity/promises/pull/334))
     - Project restructure ([#332](https://github.com/rokucommunity/promises/pull/332))
### Fixed
 - Fix bug in preprocessing script that missed some default arg prefixing ([#47](https://github.com/rokucommunity/promises/pull/47))
 - Fix wrong error message when missing context and add listener location debugging ([#40](https://github.com/rokucommunity/promises/pull/40))
 - Fixed an issue where the LSP was not detecting the demo folder as a project ([#38](https://github.com/rokucommunity/promises/pull/38))



## [0.6.3](https://github.com/rokucommunity/promises/compare/v0.6.2...0.6.3) - 2025-03-26
### Fixed
 - Issue that resulted in needing bslib as a dependancy ([#36](https://github.com/rokucommunity/promises/pull/36))



## [0.6.2](https://github.com/rokucommunity/promises/compare/v0.6.1...0.6.2) - 2025-03-25
### Fixed
 - Issue where user defined errors would also be logged ([#35](https://github.com/rokucommunity/promises/pull/35))



## [0.6.1](https://github.com/rokucommunity/promises/compare/v0.6.0...0.6.1) - 2025-03-25
### Fixed
 - Issue where type definitions where malformed ([#34](https://github.com/rokucommunity/promises/pull/34))



## [0.6.0](https://github.com/rokucommunity/promises/compare/v0.5.0...v0.6.0) - 2025-03-25
### Added
 - Add `Promises.try()` function ([#33](https://github.com/rokucommunity/promises/pull/33))
 - Support logging when crashes are detected in callback functions ([#32](https://github.com/rokucommunity/promises/pull/32))
 - Support default callback handlers ([#30](https://github.com/rokucommunity/promises/pull/30))
### Fixed
 - better callback param missmatch handling ([#31](https://github.com/rokucommunity/promises/pull/31))
 - (breaking change) `.finally()` not correctly respecting rejections ([#29](https://github.com/rokucommunity/promises/pull/29))



## [0.5.0](https://github.com/rokucommunity/promises/compare/v0.4.0...v0.5.0) - 2024-11-18
### Added
 - Feature/allSettled(), any(), race(). ([#25](https://github.com/rokucommunity/promises/pull/25))
### Changed
 - all internal promise rejections now reject with an exception object instead of a string ([#25](https://github.com/rokucommunity/promises/pull/25))



## [0.4.0](https://github.com/rokucommunity/promises/compare/v0.3.0...v0.4.0) - 2024-10-18
### Fixed
 - Prevent stackoverflow ([#23](https://github.com/rokucommunity/promises/pull/23))



## [0.3.0](https://github.com/rokucommunity/promises/compare/v0.2.0...v0.3.0) - 2024-08-23
### Fixed
 - fix bug where `resolve` and `reject` could unintentionally cause node creation ([#21](https://github.com/rokucommunity/promises/pull/21))



## [0.2.0](https://github.com/rokucommunity/promises/compare/v0.1.0...v0.2.0) - 2023-12-14
### Fixed
 - issue with recursive promise callbacks not calling the inner-registered callbacks ([#13](https://github.com/rokucommunity/promises/pull/13))



## [0.1.0](https://github.com/rokucommunity/promises/compare/v0.0.1...v0.1.0) - 2023-09-12
### Changed
 - use GitHub Actions to publish releases



## [0.0.1](https://github.com/rokucommunity/promises/compare/ead925eabcb57c80bb27968a96c71494c78b3fdf...97d15723c631b36d15b92d283822b9cd042ac81b) - 2023-09-12
### Added
 - initial release
