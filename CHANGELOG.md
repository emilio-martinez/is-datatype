# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## Project Status Note

This project is stable and 100% covered with tests; as the maintainer, I've been using it successfully in production for over a year. However, I've been iterating and tuning it across time, so the following can be expected in the next releases prior to 1.0.0 release:

- _Large performance improvements_. Some of these changes have already been made and are the most meaningful changes since the last release.
- _A cleaner API_. The current API reflects initial thinking, and while very functional has several areas that could be polished. Some work in this regard has taken place as shown in this document.

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [0.5.0]

### Added

- `DataType.null` is now an available `DataType`.
- **(Breaking change)** `package.json` now reflects `module` (ESM5) and `browser` (UMD) entries in addition to `main` (CommonJs). Previously, `main` was UMD.

### Changed

- Large performance improvements across the board
  - All checks are several multiple times faster (25x faster in avg, 4x at the lower end)
  - Library is now being iterated on against benchmarks.
  - Faster options and DataType validation.
  - Removed redundant options validation in `matchesSchema`.
  - De-duplicated some numeric logic checks.
- Enum now avoids zero as a value. This makes checks safer in the long term.
- Enable `strict` Typescript flag. This ensures greater code quality.
- Enable `alwaysStrict` Typescript flag.
- Use Webpack scope hoisting to shave off some weight.
- All comparisons are strict equality checks.
- The `is` return type is now a type guard where possible.
- This package no longer exports redundant JsDoc annotations.
- This package is now being tested against node 8 (LTS) instead of node 6.
- (Internal) Output a gzipped version of bundle for size verification purposes.
- (Internal) Karma => AVA.
- (Internal) Webpack => Rollup + Closure Compiler.

### Fixed

- Validate for number on private function `isMultipleOf`.
- **(Breaking change)** Allow `null` values as part of `DataType.any`. This ensures that "any" literally means any DataType.

### Removed

- **(Breaking change)** `allowNull` is no longer a `DataType.object` option. Use `DataType.null` instead.
- **(Breaking change)** `exclMin` and `exclMax` is no longer `DataType.number` and `DataType.array` options. Please use `min` and `max` instead.

[unreleased]: https://github.com/emilio-martinez/is-datatype/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/emilio-martinez/is-datatype/compare/v0.3.1...v0.5.0
