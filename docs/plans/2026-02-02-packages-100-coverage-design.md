# packages 100% coverage design

Date: 2026-02-02
Status: accepted

## Summary

Raise all packages under `packages/` to 100% coverage (lines/branches/functions) with unit tests. Coverage is enforced per package, and `/* c8 ignore */` is allowed only for truly unreachable branches.

## Goals

- 100% lines/branches/functions coverage for:
  - `postcss-plugin-shared`
  - `postcss-rem-to-viewport`
  - `postcss-rem-to-responsive-pixel`
  - `postcss-pxtrans`
  - `postcss-units-to-px`
- Prefer behavior-driven tests, with targeted white-box tests for remaining branches.
- Minimize production code changes; only add `/* c8 ignore */` when a branch is not realistically testable.

## Non-goals

- Large refactors or behavior changes.
- Expanding APIs solely to facilitate testing.

## Strategy

- Add/extend tests per package using Vitest and PostCSS processing.
- Cover configuration branches (e.g., option merge, mediaQuery, replace vs clone, selector blacklists).
- Drive switch-case platform coverage for `postcss-pxtrans` with focused option fixtures.
- Validate regex skip behavior for quoted strings, `url(...)`, and `var(...)`.
- Use explicit tests to cover edge-case branches (e.g., min values, zero handling, optional fallbacks).

## Package plans

### postcss-plugin-shared

- Extend tests to cover `createSelectorBlacklistMatcher` and `walkAndReplaceValues`.
- Ensure regex options (skip/ignoreCase), merge options, and prop/exclude matchers hit all branches.

### postcss-rem-to-viewport

- Exercise rootValue (number/function), unitPrecision (0 and >0), minRemValue, replace/clone, and mediaQuery.

### postcss-rem-to-responsive-pixel

- Exercise processorStage (`Once` and `OnceExit`), rootValue function path, and mediaQuery.
- Cover guard branches when `input` is missing.

### postcss-pxtrans

- Cover platform switch branches (`h5`, `weapp`, `rn`, `quickapp`, `harmony`).
- Validate targetUnit variants, onePxTransform, and special pixel cases.

### postcss-units-to-px

- Cover unitMap merge, per-unit functions, global transform fallback, minValue guard, and mediaQuery.

## Testing

- Run coverage per package (`pnpm --filter <pkg> test -- --coverage`) and ensure 100% for lines/branches/functions.
- Add `/* c8 ignore */` only when a branch is impossible to trigger in tests.
