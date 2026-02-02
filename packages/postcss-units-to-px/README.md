# postcss-units-to-px

Convert multiple CSS units to `px` with PostCSS. The default unit map covers `rem`, `em`, `vw`, `vh`, `vmin`, `vmax`, and `rpx`, and you can override or extend the rules as needed.

## Install

```bash
pnpm add postcss-units-to-px postcss
```

## Usage

```ts
import postcss from 'postcss'
import unitsToPx from 'postcss-units-to-px'

const input = '.rule { margin: 1rem 1vw; }'
const output = postcss(unitsToPx()).process(input).css
```

## Options

Type: `Object | Null`
Default:

```ts
const defaultOptions = {
  unitMap: {
    rem: 16,
    em: 16,
    vw: 3.75,
    vh: 6.67,
    vmin: 3.75,
    vmax: 6.67,
    rpx: 0.5,
  },
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ['*'],
  replace: true,
  mediaQuery: false,
  minValue: 0,
  exclude: [/node_modules/i],
  disabled: false,
}
```

### unitMap

Type: `Record<string, number | (value, context) => number | null>`

Per-unit conversion rules. A numeric value is treated as a multiplier (e.g. `1rem * 16 = 16px`). A function should return the final px value. If the rule is `null`, the plugin will fall back to the global `transform` (if provided).

Note: `unitMap` merges with defaults. To override a unit, set that key explicitly.

### transform

Type: `(value, unit, context) => number`

Global conversion function used when a unit does not have a per-unit rule (or when that rule is `null`).

### unitPrecision

Type: `number`
Default: `5`

Decimal precision for generated px values.

### minValue

Type: `number`
Default: `0`

Minimum source value to convert. Values below this are left unchanged.

### propList

Type: `(string | RegExp)[]`

Only declarations with matching properties are processed. Supports `'*'` to match all properties.

### selectorBlackList

Type: `(string | RegExp)[]`

Selectors to ignore and leave unchanged.

### replace

Type: `boolean`

Replace the original declaration value instead of adding a fallback declaration.

### mediaQuery

Type: `boolean`

Allow unit conversion inside `@media` params.

### exclude

Type: `(string | RegExp)[] | ((filePath: string) => boolean)`

Exclude files from processing based on their file path.

### disabled

Type: `boolean`

Disable this plugin.

## Transform Context

The conversion functions receive a context object with:

```ts
interface TransformContext {
  root: Root
  input: Input
  filePath?: string
  decl?: Declaration
  rule?: Rule
  atRule?: AtRule
  prop?: string
  selector?: string
}
```

## Notes

- The unit regex skips quoted strings, `url(...)`, and `var(...)` to avoid accidental replacements.
- Absolute units (`in/cm/mm/pt/pc/q`) are not converted by default, but you can add them in `unitMap`.
