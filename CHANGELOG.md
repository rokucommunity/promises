# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.6.7](https://github.com/rokucommunity/promises/compare/0.6.6...v0.6.7) - 2025-10-20
### Changed
 - upgrade to [@rokucommunity/bslint@0.8.37](https://github.com/rokucommunity/bslint/blob/master/CHANGELOG.md#0837---2025-10-16). Notable changes since 0.8.32:
     - Ignore unused parameters if they begin with leading underscore ([#165](https://github.com/rokucommunity/promises/pull/165))
     - Identify unused function parameters ([#163](https://github.com/rokucommunity/promises/pull/163))
     - chore: Support dispatch workflows ([#158](https://github.com/rokucommunity/promises/pull/158))
 - upgrade to [brighterscript@0.70.2](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0702---2025-10-10). Notable changes since 0.69.10:
     - Add manual entries for roUtils and roRenderThreadQueue ([#1574](https://github.com/rokucommunity/promises/pull/1574))
     - Roku sdk updates ([#1573](https://github.com/rokucommunity/promises/pull/1573))
     - Flag param names that are reserved words ([#1556](https://github.com/rokucommunity/promises/pull/1556))
     - Fix for adding files on beforeProgramValidate ([#1568](https://github.com/rokucommunity/promises/pull/1568))
     - Fix typdef generation of default param func ([#1551](https://github.com/rokucommunity/promises/pull/1551))
     - Support transpiling class methods as named functions ([#1548](https://github.com/rokucommunity/promises/pull/1548))
     - chore: update regex-literal docs about escaping the forward slash ([#1549](https://github.com/rokucommunity/promises/pull/1549))
     - Add projectDiscoveryExclude setting and files.watcherExclude support ([#1535](https://github.com/rokucommunity/promises/pull/1535))
     - Fix signature help crash on malformed function declarations ([#1536](https://github.com/rokucommunity/promises/pull/1536))
     - Add max depth configuration for Roku project discovery ([#1533](https://github.com/rokucommunity/promises/pull/1533))
     - chore: Add copilot files ([#1534](https://github.com/rokucommunity/promises/pull/1534))
     - Fix discovery when `projects` is empty ([#1529](https://github.com/rokucommunity/promises/pull/1529))
     - Rename setting to `enableProjectDiscovery` ([#1525](https://github.com/rokucommunity/promises/pull/1525))
     - Support projects array in settings ([#1521](https://github.com/rokucommunity/promises/pull/1521))
     - Bump brace-expansion from 1.1.11 to 1.1.12 ([#1522](https://github.com/rokucommunity/promises/pull/1522))
     - chore: Support dispatch workflows ([#1514](https://github.com/rokucommunity/promises/pull/1514))
     - Add `enableDiscovery` language server option ([#1520](https://github.com/rokucommunity/promises/pull/1520))
     - Improve manifests discovery ([#1518](https://github.com/rokucommunity/promises/pull/1518))
     - Improve `bsconfig.json` auto-discovery ([#1512](https://github.com/rokucommunity/promises/pull/1512))
     - Add some docs about ObserveField namespace caveats ([#1513](https://github.com/rokucommunity/promises/pull/1513))
 - upgrade to [roku-deploy@3.13.0](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3130---2025-08-04). Notable changes since 3.12.6:
     - chore: Support dispatch workflows ([#198](https://github.com/rokucommunity/promises/pull/198))
     - Add standards-compliant User-Agent header ([#203](https://github.com/rokucommunity/promises/pull/203))
 - upgrade to [ropm@0.11.1](https://github.com/rokucommunity/ropm/blob/master/CHANGELOG.md#0111---2025-10-10). Notable changes since 0.10.34:
     - Bump brace-expansion from 1.1.11 to 1.1.12 ([#120](https://github.com/rokucommunity/promises/pull/120))
     - Fix Issues with npm-ls ([#118](https://github.com/rokucommunity/promises/pull/118))
     - Fix packageRootDir crash when directory doesn't exist ([#110](https://github.com/rokucommunity/promises/pull/110))
     - Add support for the `create-package` label ([#111](https://github.com/rokucommunity/promises/pull/111))
     - chore: Support dispatch workflows ([#107](https://github.com/rokucommunity/promises/pull/107))
### Fixed
 - Fix link to roku-promise in README.md ([#56](https://github.com/rokucommunity/promises/pull/56))



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
