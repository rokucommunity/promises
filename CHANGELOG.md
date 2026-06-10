# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.7.1](https://github.com/rokucommunity/promises/compare/0.7.0...v0.7.1) - 2026-06-10
### Changed
 - Update minimum audit threshold ([#80](https://github.com/rokucommunity/promises/pull/80))
 - Accept GHSA-w5hq-g745-h8pq (uuid <11.1.1) advisory ([#79](https://github.com/rokucommunity/promises/pull/79))
 - Implement security audit failure condition ([#78](https://github.com/rokucommunity/promises/pull/78))
 - Bump ropm to ^0.11.7 ([#77](https://github.com/rokucommunity/promises/pull/77))
 - Security enhancements ([#76](https://github.com/rokucommunity/promises/pull/76))
 - upgrade to [@rokucommunity/bslint@0.8.43](https://github.com/rokucommunity/bslint/blob/master/CHANGELOG.md#0843---2026-05-12). Notable changes since 0.8.41:
     - Add for-terminator-style rule ([#182](https://github.com/rokucommunity/bslint/pull/182))
 - upgrade to [brighterscript@0.72.5](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0725---2026-06-10). Notable changes since 0.69.11:
     - Add parameter name inlay hints ([#1703](https://github.com/rokucommunity/brighterscript/pull/1703))
     - Update minimum audit threshold ([#1723](https://github.com/rokucommunity/brighterscript/pull/1723))
     - Accept GHSA-w5hq-g745-h8pq (uuid <11.1.1) advisory ([#1722](https://github.com/rokucommunity/brighterscript/pull/1722))
     - Add security-audit-required gate job to security-audit workflow ([#1720](https://github.com/rokucommunity/brighterscript/pull/1720))
     - Security Audit workflow ([#1718](https://github.com/rokucommunity/brighterscript/pull/1718))
     - Security enhancements ([#1714](https://github.com/rokucommunity/brighterscript/pull/1714))
     - Recover from mismatched loop terminators with quick fixes ([#1696](https://github.com/rokucommunity/brighterscript/pull/1696))
     - Add diagnosticReporter config option ([#1701](https://github.com/rokucommunity/brighterscript/pull/1701))
     - Diagnose reserved BrightScript builtins used as values ([#1697](https://github.com/rokucommunity/brighterscript/pull/1697))
     - Add bs:disable / bs:enable block directives and diagnostic suppression quick fixes ([#1699](https://github.com/rokucommunity/brighterscript/pull/1699))
     - feat: add `validate` bsconfig flag to skip validation phase ([#1687](https://github.com/rokucommunity/brighterscript/pull/1687))
     - feat: allow line continuation in .brs files when minFirmwareVersion >= 15.3 ([#1693](https://github.com/rokucommunity/brighterscript/pull/1693))
     - Reload projects when manifest file changes ([#1700](https://github.com/rokucommunity/brighterscript/pull/1700))
     - Set up Copilot coding agent instructions ([#1695](https://github.com/rokucommunity/brighterscript/pull/1695))
     - Bump diff from 4.0.2 to 4.0.4 in /benchmarks ([#1610](https://github.com/rokucommunity/brighterscript/pull/1610))
     - Add `relativeSourceMaps` option for portable sourcemaps ([#1624](https://github.com/rokucommunity/brighterscript/pull/1624))
     - Auto-update imports when files are renamed ([#1688](https://github.com/rokucommunity/brighterscript/pull/1688))
     - Support minFirmwareVersion in bsconfig.json ([#1678](https://github.com/rokucommunity/brighterscript/pull/1678))
     - added source fix all code action support ([#1659](https://github.com/rokucommunity/brighterscript/pull/1659))
     - Limit project activation concurrency ([#1627](https://github.com/rokucommunity/brighterscript/pull/1627))
     - Share per-file namespace data via lazy ScopeNamespaceLookup view ([#1684](https://github.com/rokucommunity/brighterscript/pull/1684))
     - Lazy-allocate NamespaceContainer's optional fields ([#1683](https://github.com/rokucommunity/brighterscript/pull/1683))
     - Share BscSymbol references in SymbolTable.mergeSymbolTable ([#1682](https://github.com/rokucommunity/brighterscript/pull/1682))
     - Chain prebuild sourcemaps through BrighterScript transpile ([#1676](https://github.com/rokucommunity/brighterscript/pull/1676))
     - added selection range provider support to lsp capabilities ([#1657](https://github.com/rokucommunity/brighterscript/pull/1657))
     - Report const cycle diagnostic per node to match class convention ([#1681](https://github.com/rokucommunity/brighterscript/pull/1681))
     - Support line continuation ([#1667](https://github.com/rokucommunity/brighterscript/pull/1667))
     - Fix cross-file const inlining and flag const cycles ([#1680](https://github.com/rokucommunity/brighterscript/pull/1680))
     - Bump postcss from 8.4.31 to 8.5.10 ([#1679](https://github.com/rokucommunity/brighterscript/pull/1679))
     - Bump lodash from 4.17.23 to 4.18.1 ([#1673](https://github.com/rokucommunity/brighterscript/pull/1673))
     - Bump follow-redirects from 1.15.6 to 1.16.0 ([#1672](https://github.com/rokucommunity/brighterscript/pull/1672))
     - Bump lodash from 4.17.23 to 4.18.1 in /benchmarks ([#1670](https://github.com/rokucommunity/brighterscript/pull/1670))
     - Bump brace-expansion in /benchmarks ([#1666](https://github.com/rokucommunity/brighterscript/pull/1666))
     - Feature/more quick fixes ([#1662](https://github.com/rokucommunity/brighterscript/pull/1662))
     - bugfix/small perf improvements ([#1663](https://github.com/rokucommunity/brighterscript/pull/1663))
     - Bump picomatch from 2.3.1 to 2.3.2 ([#1661](https://github.com/rokucommunity/brighterscript/pull/1661))
     - Bump picomatch from 2.3.1 to 2.3.2 in /benchmarks ([#1660](https://github.com/rokucommunity/brighterscript/pull/1660))
     - Add computed property names (compile-time support only) ([#1658](https://github.com/rokucommunity/brighterscript/pull/1658))
     - Add AI agent instructions ([#1654](https://github.com/rokucommunity/brighterscript/pull/1654))
     - Bump flatted from 3.2.2 to 3.4.2 ([#1653](https://github.com/rokucommunity/brighterscript/pull/1653))
     - Set up comprehensive Copilot coding agent instructions ([#1650](https://github.com/rokucommunity/brighterscript/pull/1650))
     - perf(ProjectManager): cache PathCollection per project in flushDocumentChanges ([#1628](https://github.com/rokucommunity/brighterscript/pull/1628))
     - Fixes issue with running tests on newer node versions ([#1644](https://github.com/rokucommunity/brighterscript/pull/1644))
     - feat(LanguageServer): debounce onDidChangeWatchedFiles events ([#1626](https://github.com/rokucommunity/brighterscript/pull/1626))
     - Bump minimatch in /benchmarks ([#1640](https://github.com/rokucommunity/brighterscript/pull/1640))
     - Ensure we have consistent line endings ([#1642](https://github.com/rokucommunity/brighterscript/pull/1642))
     - Typedef namespace param fix ([#1641](https://github.com/rokucommunity/brighterscript/pull/1641))
     - Bump minimatch from 3.1.2 to 3.1.5 ([#1639](https://github.com/rokucommunity/brighterscript/pull/1639))
     - Backport V1 Typed function type syntax to v0 ([#1623](https://github.com/rokucommunity/brighterscript/pull/1623))
     - spelling fix ([#1621](https://github.com/rokucommunity/brighterscript/pull/1621))
     - Backport `for each` type syntax from V1 -> V0 ([#1617](https://github.com/rokucommunity/brighterscript/pull/1617))
     - Back ports intersection type and grouped type expressions ([#1608](https://github.com/rokucommunity/brighterscript/pull/1608))
     - Bump lodash from 4.17.21 to 4.17.23 ([#1611](https://github.com/rokucommunity/brighterscript/pull/1611))
     - Bump lodash from 4.17.21 to 4.17.23 in /benchmarks ([#1612](https://github.com/rokucommunity/brighterscript/pull/1612))
     - Add TKSS Software Inc logo to README ([#1604](https://github.com/rokucommunity/brighterscript/pull/1604))
     - Backports TypeStatement syntax from v1 to v0 ([#1600](https://github.com/rokucommunity/brighterscript/pull/1600))
     - Backported v1 inline interface syntax ([#1592](https://github.com/rokucommunity/brighterscript/pull/1592))
     - Add definition provider for import statement ([#1595](https://github.com/rokucommunity/brighterscript/pull/1595))
     - Fix confusing diagnostic when dottedGet follows function call in ExpressionStatement ([#1598](https://github.com/rokucommunity/brighterscript/pull/1598))
     - Bump glob from 10.2.1 to 10.5.0 in /benchmarks ([#1593](https://github.com/rokucommunity/brighterscript/pull/1593))
     - Fix crash when bsc plugin in worker loads another version of bsc ([#1579](https://github.com/rokucommunity/brighterscript/pull/1579))
     - Fix recursive const and enum resolution during transpilation ([#1578](https://github.com/rokucommunity/brighterscript/pull/1578))
     - chore: support OIDC for publishing ([#1582](https://github.com/rokucommunity/brighterscript/pull/1582))
     - Add manual entries for roUtils and roRenderThreadQueue ([#1574](https://github.com/rokucommunity/brighterscript/pull/1574))
     - Roku sdk updates ([#1573](https://github.com/rokucommunity/brighterscript/pull/1573))
     - Flag param names that are reserved words ([#1556](https://github.com/rokucommunity/brighterscript/pull/1556))
     - Fix for adding files on beforeProgramValidate ([#1568](https://github.com/rokucommunity/brighterscript/pull/1568))
     - Fix typdef generation of default param func ([#1551](https://github.com/rokucommunity/brighterscript/pull/1551))
     - Support transpiling class methods as named functions ([#1548](https://github.com/rokucommunity/brighterscript/pull/1548))
     - chore: update regex-literal docs about escaping the forward slash ([#1549](https://github.com/rokucommunity/brighterscript/pull/1549))
     - Add projectDiscoveryExclude setting and files.watcherExclude support ([#1535](https://github.com/rokucommunity/brighterscript/pull/1535))
     - Fix signature help crash on malformed function declarations ([#1536](https://github.com/rokucommunity/brighterscript/pull/1536))
     - Add max depth configuration for Roku project discovery ([#1533](https://github.com/rokucommunity/brighterscript/pull/1533))
     - chore: Add copilot files ([#1534](https://github.com/rokucommunity/brighterscript/pull/1534))
     - Fix discovery when `projects` is empty ([#1529](https://github.com/rokucommunity/brighterscript/pull/1529))
 - upgrade to [roku-deploy@3.17.6](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3176---2026-06-04). Notable changes since 3.16.5:
     - Fix case-insensitive matching for absolute `files.src` glob patterns on case-insensitive file systems ([#279](https://github.com/rokucommunity/roku-deploy/pull/279))
     - Preserve `!` glob-negation prefix in standardizePath ([#277](https://github.com/rokucommunity/roku-deploy/pull/277))
     - Update minimum audit threshold ([#273](https://github.com/rokucommunity/roku-deploy/pull/273))
     - Accept GHSA-w5hq-g745-h8pq (uuid <11.1.1) advisory ([#272](https://github.com/rokucommunity/roku-deploy/pull/272))
     - Add `security-audit-required` gate job to security audit workflow ([#269](https://github.com/rokucommunity/roku-deploy/pull/269))
     - Use explicit label on Security Audit badge ([#266](https://github.com/rokucommunity/roku-deploy/pull/266))
     - Security Audit workflow ([#265](https://github.com/rokucommunity/roku-deploy/pull/265))
     - npm audit fixes ([#263](https://github.com/rokucommunity/roku-deploy/pull/263))
     - Add `autoLaunch` option to control `dev_autolaunch` on sideload ([#261](https://github.com/rokucommunity/roku-deploy/pull/261))
     - Expanded the default files array to include the locale folder ([#237](https://github.com/rokucommunity/roku-deploy/pull/237))
     - Fix crash when loading roku-deploy on node < 18 ([#256](https://github.com/rokucommunity/roku-deploy/pull/256))
     - chore: drop undici, use native fetch ([#254](https://github.com/rokucommunity/roku-deploy/pull/254))
     - feat: add RokuDeploy.validateDeveloperPassword ([#252](https://github.com/rokucommunity/roku-deploy/pull/252))
     - fix: correct DeviceInfoRaw serial-number property name ([#251](https://github.com/rokucommunity/roku-deploy/pull/251))
 - upgrade to [rooibos-roku@5.16.3](https://github.com/rokucommunity/rooibos/blob/master/CHANGELOG.md#5163---2026-05-20). Notable changes since 5.15.7:
     - Update ropm to 0.11.7 and remove lodash override ([#391](https://github.com/rokucommunity/rooibos/pull/391))
     - Security enhancements ([#390](https://github.com/rokucommunity/rooibos/pull/390))
     - Bump fast-uri from 3.1.0 to 3.1.2 ([#388](https://github.com/rokucommunity/rooibos/pull/388))
     - fix: expectCalled/expectNotCalled broken for node tests since v5.15 ([#384](https://github.com/rokucommunity/rooibos/pull/384))
     - Bump ip-address and socks ([#386](https://github.com/rokucommunity/rooibos/pull/386))
     - Bump minimatch ([#373](https://github.com/rokucommunity/rooibos/pull/373))
     - Bump basic-ftp from 5.0.5 to 5.2.2 ([#379](https://github.com/rokucommunity/rooibos/pull/379))
     - Upgrade brighterscript to 0.71.1 and fix tests ([#381](https://github.com/rokucommunity/rooibos/pull/381))
     - Bump brace-expansion from 1.1.11 to 1.1.13 ([#377](https://github.com/rokucommunity/rooibos/pull/377))
     - Bump picomatch from 2.3.1 to 2.3.2 ([#376](https://github.com/rokucommunity/rooibos/pull/376))
     - Bump flatted from 3.2.2 to 3.4.2 ([#374](https://github.com/rokucommunity/rooibos/pull/374))
     - Add a node creator for generated test nodes ([#367](https://github.com/rokucommunity/rooibos/pull/367))
     - Bump js-yaml ([#357](https://github.com/rokucommunity/rooibos/pull/357))
     - chore: Support dispatch workflows ([#350](https://github.com/rokucommunity/rooibos/pull/350))
     - chore: Make `getTestFunctionContents` test helper more flexible for later bsc version usage ([#360](https://github.com/rokucommunity/rooibos/pull/360))
     - Fix method creation bug when bsc version is newer than version from rooibos ([#358](https://github.com/rokucommunity/rooibos/pull/358))
     - chore: add warning in docs on SceneGraph mocking limitations ([#359](https://github.com/rokucommunity/rooibos/pull/359))
     - chore: support OIDC ([#356](https://github.com/rokucommunity/rooibos/pull/356))
     - missing floating point precision and incorrect failure states ([#352](https://github.com/rokucommunity/rooibos/pull/352))
     - chore: Shared CI remove merged check on publish releases ([#348](https://github.com/rokucommunity/rooibos/pull/348))
     - Enable stricter linting for TypeScript ([#343](https://github.com/rokucommunity/rooibos/pull/343))
     - Fixed a crash when searching for assertions to rewrite ([#347](https://github.com/rokucommunity/rooibos/pull/347))
     - Fixed a runtime crash in the mocha reporting when generating diffs ([#345](https://github.com/rokucommunity/rooibos/pull/345))
     - Add and implement linting rules ([#338](https://github.com/rokucommunity/rooibos/pull/338))
     - Shared CI Support Prerelease ([#341](https://github.com/rokucommunity/rooibos/pull/341))
     - Shared CI Support Prerelease ([#339](https://github.com/rokucommunity/rooibos/pull/339))
 - upgrade to [ropm@0.11.8](https://github.com/rokucommunity/ropm/blob/master/CHANGELOG.md#0118---2026-05-30). Notable changes since 0.11.5:
     - Add --rootDir flag support to copy/install/clean commands ([#143](https://github.com/rokucommunity/ropm/pull/143))
     - Update minimum audit threshold ([#142](https://github.com/rokucommunity/ropm/pull/142))
     - Accept GHSA-w5hq-g745-h8pq (uuid <11.1.1) advisory ([#141](https://github.com/rokucommunity/ropm/pull/141))
     - Add security-audit-required job to security-audit workflow ([#140](https://github.com/rokucommunity/ropm/pull/140))
     - Replace @xml-tools/ast with in-repo shim ([#138](https://github.com/rokucommunity/ropm/pull/138))
     - Security enhancements ([#137](https://github.com/rokucommunity/ropm/pull/137))
     - Bump brace-expansion from 1.1.12 to 1.1.14 ([#136](https://github.com/rokucommunity/ropm/pull/136))
     - Bump picomatch from 2.3.1 to 2.3.2 ([#134](https://github.com/rokucommunity/ropm/pull/134))



## [0.7.0](https://github.com/rokucommunity/promises/compare/0.6.7...v0.7.0) - 2026-04-21
### Added
 - Full promise support in Task threads ([#67](https://github.com/rokucommunity/promises/pull/67))
### Changed
 - Better context param mismatch handling ([#69](https://github.com/rokucommunity/promises/pull/69))
 - Reduce data cloning ([#68](https://github.com/rokucommunity/promises/pull/68))
 - upgrade to [roku-deploy@3.16.5](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3165---2026-04-13). Notable changes since 3.14.4:



## [0.6.7](https://github.com/rokucommunity/promises/compare/0.6.6...v0.6.7) - 2025-10-31
### Fixed
 - Fix `repositoryUrl` ([529b745](https://github.com/rokucommunity/promises/commit/529b745))
 - Fix issue with default function callbacks being incorrectly prefixed ([#58](https://github.com/rokucommunity/promises/pull/58))
 - chore: fix link to roku-promise in README.md ([#56](https://github.com/rokucommunity/promises/pull/56))



## [0.6.6](https://github.com/rokucommunity/promises/compare/0.6.5...v0.6.6) - 2025-06-14
### Fixed
 - bug in publishing flow that wasn't properly preparing the package for npm publishing ([#](https://github.com/rokucommunity/promises/pull/52))



## [0.6.5](https://github.com/rokucommunity/promises/compare/0.6.4...v0.6.5) - 2025-06-10
### Changed
 - Change bslint to a devDependency ([#50](https://github.com/rokucommunity/promises/pull/50))



## [0.6.4](https://github.com/rokucommunity/promises/compare/0.6.3...v0.6.4) - 2025-06-10
### Changed
 - upgrade to [brighterscript@0.69.10](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#06910---2025-06-03). Notable changes since 0.65.5:
 - upgrade to [roku-deploy@3.12.6](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3126---2025-06-03). Notable changes since 3.10.3:
 - upgrade to [rooibos-roku@5.15.7](https://github.com/rokucommunity/rooibos/blob/master/CHANGELOG.md#5157---2025-04-16). Notable changes since 5.15.6:
 - chore: linting ([#42](https://github.com/rokucommunity/promises/pull/42))
 - chore: update the demo with the latest code ([#37](https://github.com/rokucommunity/promises/pull/37))
 - chore: an issue where the LSP was not detecting the demo folder as a project ([#38](https://github.com/rokucommunity/promises/pull/38))
### Fixed
 - bug in preprocessing script that missed some default arg prefixing ([#47](https://github.com/rokucommunity/promises/pull/47))
 - wrong error message when missing context and add listener location debugging ([#40](https://github.com/rokucommunity/promises/pull/40))



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
