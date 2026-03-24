# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.6.8](https://github.com/rokucommunity/promises/compare/0.6.7...v0.6.8) - 2026-03-24
### Changed
 - Better context param mismatch handling ([#69](https://github.com/rokucommunity/promises/pull/69))
 - Reduce data cloning ([#68](https://github.com/rokucommunity/promises/pull/68))
 - Make the demo app debugable ([#66](https://github.com/rokucommunity/promises/pull/66))
 - upgrade to [@rokucommunity/bslint@0.8.40](https://github.com/rokucommunity/bslint/blob/master/CHANGELOG.md#0840---2026-03-24). Notable changes since 0.8.38:
     - Fix parameters not getting flagged as unused ([#174](https://github.com/rokucommunity/bslint/pull/174))
     - Fixes issue with running tests on newer node versions ([#175](https://github.com/rokucommunity/bslint/pull/175))
 - upgrade to [brighterscript@0.70.4](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0704---2026-03-24). Notable changes since 0.69.10:
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
     - Rename setting to `enableProjectDiscovery` ([#1525](https://github.com/rokucommunity/brighterscript/pull/1525))
     - Support projects array in settings ([#1521](https://github.com/rokucommunity/brighterscript/pull/1521))
     - Bump brace-expansion from 1.1.11 to 1.1.12 ([#1522](https://github.com/rokucommunity/brighterscript/pull/1522))
     - chore: Support dispatch workflows ([#1514](https://github.com/rokucommunity/brighterscript/pull/1514))
     - Add `enableDiscovery` language server option ([#1520](https://github.com/rokucommunity/brighterscript/pull/1520))
     - Improve manifests discovery ([#1518](https://github.com/rokucommunity/brighterscript/pull/1518))
     - Improve `bsconfig.json` auto-discovery ([#1512](https://github.com/rokucommunity/brighterscript/pull/1512))
     - Add some docs about ObserveField namespace caveats ([#1513](https://github.com/rokucommunity/brighterscript/pull/1513))
 - upgrade to [roku-deploy@3.16.3](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3163---2026-03-24). Notable changes since 3.14.4:
     - Bump flatted from 3.2.2 to 3.4.2 ([#236](https://github.com/rokucommunity/roku-deploy/pull/236))
     - Bump minimatch from 3.1.2 to 3.1.5 ([#234](https://github.com/rokucommunity/roku-deploy/pull/234))
     - Bump ajv from 6.12.6 to 6.14.0 ([#232](https://github.com/rokucommunity/roku-deploy/pull/232))
     - Bump lodash from 4.17.21 to 4.17.23 ([#227](https://github.com/rokucommunity/roku-deploy/pull/227))
     - Add ecpSettingMode to device-info interface ([#225](https://github.com/rokucommunity/roku-deploy/pull/225))
     - Add support for detecting ecpNetworkAccessMode ([#223](https://github.com/rokucommunity/roku-deploy/pull/223))
     - Support installing and deleting component libraries ([#220](https://github.com/rokucommunity/roku-deploy/pull/220))
 - upgrade to [ropm@0.11.5](https://github.com/rokucommunity/ropm/blob/master/CHANGELOG.md#0115---2026-03-24). Notable changes since 0.11.2:
     - Bump flatted from 3.3.1 to 3.4.2 ([#132](https://github.com/rokucommunity/ropm/pull/132))
     - Bump minimatch ([#128](https://github.com/rokucommunity/ropm/pull/128))
     - Bump ajv from 6.12.6 to 6.14.0 ([#127](https://github.com/rokucommunity/ropm/pull/127))
     - Increase install buffer for json ([#125](https://github.com/rokucommunity/ropm/pull/125))
     - Add support for workspace projects ([#67](https://github.com/rokucommunity/ropm/pull/67))



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
