# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.7.2](https://github.com/rokucommunity/promises/compare/0.7.1...v0.7.2) - 2026-09-02
### Changed
 - Security enhancements ([#84](https://github.com/rokucommunity/promises/pull/84))
 - Security enhancements ([#83](https://github.com/rokucommunity/promises/pull/83))
 - Security enhancements ([#82](https://github.com/rokucommunity/promises/pull/82))
 - upgrade to [@rokucommunity/bslint@0.8.44](https://github.com/rokucommunity/bslint/blob/master/CHANGELOG.md#0844---2026-06-10). Notable changes since 0.8.43:
     - Update minimum audit threshold ([#191](https://github.com/rokucommunity/bslint/pull/191))
     - Accept GHSA-w5hq-g745-h8pq (uuid <11.1.1) advisory ([#190](https://github.com/rokucommunity/bslint/pull/190))
     - Add security-audit-required job to security-audit.yml ([#189](https://github.com/rokucommunity/bslint/pull/189))
     - Security enhancements ([#186](https://github.com/rokucommunity/bslint/pull/186))
 - upgrade to [brighterscript@0.73.1](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0731---2026-09-02). Notable changes since 0.72.5:
     - Security enhancements ([#1782](https://github.com/rokucommunity/brighterscript/pull/1782))
     - Keep synthesized Tokens on the lexer's hidden class ([#1781](https://github.com/rokucommunity/brighterscript/pull/1781))
     - Report mismatched XML element pairs ([#1746](https://github.com/rokucommunity/brighterscript/pull/1746))
     - Add <field> and <function> completions in xml interfaces ([#1748](https://github.com/rokucommunity/brighterscript/pull/1748))
     - Cap LSP worker thread pool to fix memory scaling with project count ([#1776](https://github.com/rokucommunity/brighterscript/pull/1776))
     - Add warning for function names that exceed the truncation limit ([#1777](https://github.com/rokucommunity/brighterscript/pull/1777))
     - Security enhancements ([#1775](https://github.com/rokucommunity/brighterscript/pull/1775))
     - Bump brace-expansion in /benchmarks ([#1774](https://github.com/rokucommunity/brighterscript/pull/1774))
     - Security enhancements ([#1773](https://github.com/rokucommunity/brighterscript/pull/1773))
     - Bump qs from 6.14.2 to 6.15.3 ([#1766](https://github.com/rokucommunity/brighterscript/pull/1766))
     - Bump postcss from 8.5.10 to 8.5.25 ([#1764](https://github.com/rokucommunity/brighterscript/pull/1764))
     - Bump fast-uri from 3.1.2 to 3.1.4 ([#1763](https://github.com/rokucommunity/brighterscript/pull/1763))
     - chore: Simplify create-vsix inputs and improve branch resolution ([#1772](https://github.com/rokucommunity/brighterscript/pull/1772))
     - chore: Give fork PRs a clear create-vsix failure message ([#1770](https://github.com/rokucommunity/brighterscript/pull/1770))
     - Fix compile break against roku-deploy 3.18 ([#1752](https://github.com/rokucommunity/brighterscript/pull/1752))
     - Add SceneGraph XML element and attribute completions ([#1741](https://github.com/rokucommunity/brighterscript/pull/1741))
     - chore: Update create-vsix to support multi-vsix and shared bot logic ([#1740](https://github.com/rokucommunity/brighterscript/pull/1740))
     - Validate eval/rsg_version against firmware lifecycle ([#1698](https://github.com/rokucommunity/brighterscript/pull/1698))
     - Remove more prod deps: (drop array-flat-polyfill/readline, consolidate minimatch into micromatch) ([#1737](https://github.com/rokucommunity/brighterscript/pull/1737))
     - Replace single-use deps with util/formatUtils helpers ([#1736](https://github.com/rokucommunity/brighterscript/pull/1736))
     - chore: remove dead production dependencies ([#1735](https://github.com/rokucommunity/brighterscript/pull/1735))
     - Bump form-data from 2.5.5 to 2.5.6 ([#1733](https://github.com/rokucommunity/brighterscript/pull/1733))
 - upgrade to [roku-deploy@3.18.4](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3184---2026-09-02). Notable changes since 3.17.6:
     - fix: signed .pkg downloads are corrupted by utf8 decoding ([#359](https://github.com/rokucommunity/roku-deploy/pull/359))
     - chore: Hard-reboot device via smart switch for device tests ([#354](https://github.com/rokucommunity/roku-deploy/pull/354))
     - Add 1s breathing room between device tests ([#346](https://github.com/rokucommunity/roku-deploy/pull/346))
     - Security enhancements ([#345](https://github.com/rokucommunity/roku-deploy/pull/345))
     - chore: Fix mocha/ts-node breaking on Node 22+ ([#342](https://github.com/rokucommunity/roku-deploy/pull/342))
     - chore: Simplify create-vsix inputs and improve branch resolution ([#340](https://github.com/rokucommunity/roku-deploy/pull/340))
     - chore: Give fork PRs a clear create-vsix failure message ([#339](https://github.com/rokucommunity/roku-deploy/pull/339))
     - Restore dist/Logger as a compatibility shim ([#327](https://github.com/rokucommunity/roku-deploy/pull/327))
     - Fix write EPIPE when uploading large zips through digest auth ([#324](https://github.com/rokucommunity/roku-deploy/pull/324))
     - Migrate to @rokucommunity/logger ([#318](https://github.com/rokucommunity/roku-deploy/pull/318))
     - Fix device test timeout durations and remove dead code ([#319](https://github.com/rokucommunity/roku-deploy/pull/319))
     - Better undersized zip error handling ([#312](https://github.com/rokucommunity/roku-deploy/pull/312))
     - Add deleteAllSideloadedPlugins, expose listSideloadedPlugins ([#309](https://github.com/rokucommunity/roku-deploy/pull/309))
     - Migrate networking library from `postman-request` to `needle` ([#282](https://github.com/rokucommunity/roku-deploy/pull/282))
     - chore: Update create-vsix to support multi-vsix and shared bot logic ([#305](https://github.com/rokucommunity/roku-deploy/pull/305))
     - Extract normalizeDeviceInfo helper from getDeviceInfo ([#300](https://github.com/rokucommunity/roku-deploy/pull/300))
     - Fix: potential crash in normalizeDeviceInfoFieldValue when supplied non-string values ([#301](https://github.com/rokucommunity/roku-deploy/pull/301))
     - Declare picomatch as a direct dependency ([#299](https://github.com/rokucommunity/roku-deploy/pull/299))
     - Inline lodash.camelCase and temp-dir into util ([#298](https://github.com/rokucommunity/roku-deploy/pull/298))
     - Consolidate date libraries into dependency-free helpers ([#297](https://github.com/rokucommunity/roku-deploy/pull/297))
     - Bump form-data from 2.5.5 to 2.5.6 ([#293](https://github.com/rokucommunity/roku-deploy/pull/293))
 - upgrade to [rooibos-roku@5.16.4](https://github.com/rokucommunity/rooibos/blob/master/CHANGELOG.md#5164---2026-06-10). Notable changes since 5.16.3:
     - Make tests less brittle - removes full transpile string checks ([#396](https://github.com/rokucommunity/rooibos/pull/396))
     - Update minimum audit threshold ([#397](https://github.com/rokucommunity/rooibos/pull/397))
     - Accept GHSA-w5hq-g745-h8pq (uuid <11.1.1) advisory ([#395](https://github.com/rokucommunity/rooibos/pull/395))
     - Add security-audit-required job to security-audit workflow ([#393](https://github.com/rokucommunity/rooibos/pull/393))
 - upgrade to [ropm@0.11.9](https://github.com/rokucommunity/ropm/blob/master/CHANGELOG.md#0119---2026-06-10). Notable changes since 0.11.8:



## [0.7.1](https://github.com/rokucommunity/promises/compare/0.7.0...v0.7.1) - 2026-06-10
### Changed
 - Security enhancements ([#76](https://github.com/rokucommunity/promises/pull/76)) ([#77](https://github.com/rokucommunity/promises/pull/77)) ([#78](https://github.com/rokucommunity/promises/pull/78)) ([#79](https://github.com/rokucommunity/promises/pull/79)) ([#80](https://github.com/rokucommunity/promises/pull/80))
 - upgrade to [@rokucommunity/bslint@0.8.43](https://github.com/rokucommunity/bslint/blob/master/CHANGELOG.md#0843---2026-05-12).
   - Security enhancements
 - upgrade to [brighterscript@0.72.5](https://github.com/rokucommunity/brighterscript/blob/master/CHANGELOG.md#0725---2026-06-10).
   - Security enhancements
 - upgrade to [roku-deploy@3.17.6](https://github.com/rokucommunity/roku-deploy/blob/master/CHANGELOG.md#3176---2026-06-04).
   - Security enhancements
 - upgrade to [rooibos-roku@5.16.3](https://github.com/rokucommunity/rooibos/blob/master/CHANGELOG.md#5163---2026-05-20).
   - Security enhancements
 - upgrade to [ropm@0.11.8](https://github.com/rokucommunity/ropm/blob/master/CHANGELOG.md#0118---2026-05-30).
   - Security enhancements



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
