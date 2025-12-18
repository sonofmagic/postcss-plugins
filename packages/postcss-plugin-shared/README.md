# postcss-plugin-shared

English | [简体中文](./README.zh-CN.md)

`postcss-plugin-shared` is a shared utilities package used across the `postcss-plugins` monorepo to avoid duplicated logic (option merging, selector blacklists, declaration dedupe, exclude matching, unit regexes, numeric helpers, etc.).

> Goals: **small, stable, side-effect free, and reusable**. This package intentionally does not include specific unit-conversion formulas (e.g. rem→px); it only provides generic building blocks.

## Install / Usage

### Inside this repo (pnpm workspace)

Use a workspace dependency:

```jsonc
// packages/your-plugin/package.json
{
  "dependencies": {
    "postcss-plugin-shared": "workspace:^"
  }
}
```

Then import utilities in your plugin:

```ts
import { createExcludeMatcher, remRegex } from 'postcss-plugin-shared'
```

### Outside this repo

If you publish this package to npm, install it normally:

```bash
pnpm add postcss-plugin-shared
```

This package declares `postcss` as a peer dependency (`^8`).

## Exports

Entry: `packages/postcss-plugin-shared/src/index.ts`

- `mergeOptions`: option merging based on `defu` (arrays use “override” strategy)
- `createConfigGetter`: create a `getConfig(options?)` helper based on `mergeOptions`
- `toFixed`: stable rounding helper (avoids `-0`/precision noise)
- `createUnitRegex`: build a unit regex with configurable skip rules
- `remRegex` / `pxRegex`: shared regexes for rem/px replacement (skips string literals, `url()`, `var()`)
- `blacklistedSelector`: selector blacklist matcher (string includes / RegExp match)
- `maybeBlacklistedSelector`: like `blacklistedSelector`, but returns `undefined` for non-string selectors
- `createPropListMatcher`: builds a property matcher from `propList` (supports `*`)
- `createAdvancedPropListMatcher`: advanced prop matcher (wildcards + negation) for `string[]`
- `createExcludeMatcher`: builds an exclude matcher from `exclude` (array or function)
- `declarationExists`: checks whether a rule/decls already contains the same `prop/value` to avoid duplicates

## API

### `mergeOptions(options, defaults)`

Merges user options with defaults:

- Object fields follow `defu` semantics (fallback to `defaults` when not provided in `options`)
- **Arrays are overridden**: if both sides are arrays, the user array replaces the default array

```ts
import { mergeOptions } from 'postcss-plugin-shared'

interface Options {
  propList: string[]
  unitPrecision: number
}

const defaults: Options = { propList: ['*'], unitPrecision: 5 }
const resolved = mergeOptions<Options>({ propList: ['font-size'] }, defaults)
// resolved.propList === ['font-size']
```

### `createConfigGetter(defaults)`

Creates a strongly-typed `getConfig(options?)` function:

```ts
import { createConfigGetter } from 'postcss-plugin-shared'

const defaultOptions = { rootValue: 16, propList: ['*'] as string[] }
export const getConfig = createConfigGetter(defaultOptions)

getConfig() // => defaultOptions
getConfig({ rootValue: 10 }) // => merged result
```

### `toFixed(number, precision)`

Stable rounding helper:

- returns `0` when `number === 0`
- preserves sign (supports negative values)
- uses `Number.EPSILON` to reduce floating-point edge cases

```ts
import { toFixed } from 'postcss-plugin-shared'

toFixed(1.005, 2) // 1.01
toFixed(0, 5) // 0
```

### `createUnitRegex(options)`

Creates a global regex for unit replacement with configurable “skip” rules.

Notes:

- capture group 1 is the numeric portion
- defaults to skipping quoted strings, `url(...)` and `var(...)`

```ts
import { createUnitRegex } from 'postcss-plugin-shared'

const pxLike = createUnitRegex({ units: ['px', 'rpx'], ignoreCase: true })
```

### `remRegex` / `pxRegex`

Global regexes for `String.prototype.replace`, designed to reduce false positives:

- skip double-quoted strings `"..."` and single-quoted strings `'...'`
- skip `url(...)`
- skip `var(...)`
- capture group 1 is the numeric portion (e.g. `1.25`)

```ts
import { remRegex } from 'postcss-plugin-shared'

const value = 'margin: 1rem 0; background: url("1rem.png")'
value.replace(remRegex, (m, num) => `${Number(num) * 16}px`)
// => margin: 16px 0; background: url("1rem.png")
```

### `blacklistedSelector(blacklist, selector?)`

Returns `true` if `selector` matches the blacklist:

- `blacklist` supports `string | RegExp`
- returns `false` when `selector` is not a string
- `string`: `selector.includes(rule)`
- `RegExp`: `Boolean(selector.match(rule))`

```ts
import { blacklistedSelector } from 'postcss-plugin-shared'

blacklistedSelector(['.ignore', /^\.no-/], '.ignore .a') // true
blacklistedSelector(['.ignore', /^\.no-/], '.no-test') // true
```

### `maybeBlacklistedSelector(blacklist, selector?)`

Same matching logic as `blacklistedSelector`, but returns `undefined` when `selector` is not a string.

### `createPropListMatcher(propList)`

Builds a matcher `(prop: string) => boolean` to decide whether a CSS property should be processed.

Rules:

- If `propList` includes `'*'`, it matches everything.
- Otherwise:
  - `string`: `prop.includes(rule)`
  - `RegExp`: `Boolean(prop.match(rule))`

```ts
import { createPropListMatcher } from 'postcss-plugin-shared'

const match = createPropListMatcher(['font', /height$/])
match('font-size') // true (contains 'font')
match('line-height') // true (/height$/)
match('color') // false
```

### `createAdvancedPropListMatcher(propList)`

Advanced property matcher for `string[]` `propList`, compatible with `postcss-pxtrans` patterns:

- `*` matches all properties
- `foo` exact match
- `foo*` prefix match
- `*foo` suffix match
- `*foo*` contains match
- `!pattern` negates (deny-list)

```ts
import { createAdvancedPropListMatcher } from 'postcss-plugin-shared'

const match = createAdvancedPropListMatcher(['*', '!border', 'font*', '*height'])
match('font-size') // true
match('border') // false
```

### `createExcludeMatcher(exclude)`

Builds an exclude matcher `(filepath?: string) => boolean`.

- `exclude` can be `Array<string | RegExp>` or `(filePath) => boolean`
- returns `false` when `filepath` is `undefined`

```ts
import { createExcludeMatcher } from 'postcss-plugin-shared'

const isExcluded = createExcludeMatcher([/node_modules/i, 'vendor'])
isExcluded('/a/node_modules/x.css') // true
isExcluded('/a/src/vendor.css') // true
```

### `declarationExists(decls, prop, value)`

Checks whether a rule already contains the same declaration (commonly used to avoid duplicates when `replace: false` and `cloneAfter` is used).

`decls` only needs a `.some(...)` method that iterates PostCSS `ChildNode`s (usually a `Rule`).

```ts
import { declarationExists } from 'postcss-plugin-shared'

// inside PostCSS visitor
if (!declarationExists(rule, decl.prop, nextValue)) {
  decl.cloneAfter({ value: nextValue })
}
```

## Development

This package uses `tsup`:

- `pnpm -C packages/postcss-plugin-shared dev`
- `pnpm -C packages/postcss-plugin-shared build`

## Use cases

This package currently powers multiple plugins in this monorepo, e.g.:

- `postcss-rem-to-responsive-pixel`
- `postcss-rem-to-viewport`
- `postcss-pxtrans`

If you want to extract more shared logic, this is the recommended place. Keep the scope:

- utilities only (no plugin state, no IO, no side effects)
- decoupled from conversion formulas (each plugin can define its own conversion)
