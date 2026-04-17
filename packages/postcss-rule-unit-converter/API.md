# API Reference

Reference for `postcss-rule-unit-converter`.

- Overview examples: [README.md](./README.md)
- Scenario recipes: [COOKBOOK.md](./COOKBOOK.md)
- Preset authoring: [PRESET_AUTHORING.md](./PRESET_AUTHORING.md)

## Plugin

```ts
import unitConverter from 'postcss-rule-unit-converter'
```

```ts
type PostcssUnitConverter = PluginCreator<UserDefinedOptions>
```

## Options

```ts
interface UserDefinedOptions {
  rules?: readonly ConversionRule[]
  unitRegex?: RegExp
  unitPrecision?: number
  minValue?: number
  keepZeroUnit?: boolean
  selectorBlackList?: (string | RegExp)[]
  propList?: (string | RegExp)[]
  replace?: boolean
  mediaQuery?: boolean
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  disabled?: boolean
}
```

- `rules`: ordered conversion rules. First match wins.
- `unitRegex`: override the generated matching regex.
- `unitPrecision`: decimal precision for generated values.
- `minValue`: global minimum source value to convert.
- `keepZeroUnit`: keep `0px`/`0rem` style output instead of collapsing to bare `0`.
- `selectorBlackList`: skip matching selectors.
- `propList`: restrict processing to matching properties.
- `replace`: replace the original declaration instead of cloning a fallback declaration.
- `mediaQuery`: also convert matching units in `@media` params.
- `exclude`: skip files by path or predicate.
- `disabled`: no-op mode.

## Rules

```ts
type UnitMatcher = string | RegExp | ((unit: string) => boolean)

interface ConversionRule {
  from: UnitMatcher
  to?: string
  factor?: number
  minValue?: number
  transform?: RuleTransform
}
```

- `from`: source unit matcher.
- `to`: fallback output unit.
- `factor`: shorthand numeric conversion.
- `minValue`: per-rule minimum source value override.
- `transform`: full callback when `factor` is not enough.

Rules are evaluated in array order. If multiple rules can match the same source unit, the first matching rule is used.

## Transform Callback

```ts
type RuleTransform = (
  value: number,
  context: RuleContext,
) => number | ConvertedValue | undefined

interface ConvertedValue {
  value: number
  unit?: string
}
```

- Return `number` to reuse `to` as the output unit.
- Return `{ value, unit }` to override the output unit.
- Return `undefined` to leave the original match unchanged.

## RuleContext

`RuleContext` extends the shared replace context from `postcss-plugin-shared`.

```ts
interface RuleContext {
  root: Root
  input: Input
  filePath?: string
  decl?: Declaration
  rule?: Rule
  atRule?: AtRule
  prop?: string
  selector?: string
  fromUnit: string
  rawUnit: string
  rawValue: string
  match: string
}
```

- `fromUnit`: normalized lowercase source unit.
- `rawUnit`: original matched unit text.
- `rawValue`: original matched numeric text.
- `match`: full matched fragment.

## Helpers

```ts
function composeRules(...groups: RuleGroup[]): ConversionRule[]
```

Flatten preset groups and individual rules into one ordered rule array.

```ts
function definePreset<TOptions extends PresetOptions = undefined>(
  factory: (options?: TOptions) => ConversionRule,
): PresetFactory<TOptions>

function definePresetGroup<TOptions extends PresetOptions = undefined>(
  factory: (options?: TOptions) => ConversionRule[],
): PresetGroupFactory<TOptions>
```

Use these helpers when authoring reusable presets in app code or other packages.

## Exported Types

```ts
type PresetFactory<TOptions extends PresetOptions = undefined> = (
  options?: TOptions,
) => ConversionRule

type PresetGroupFactory<TOptions extends PresetOptions = undefined> = (
  options?: TOptions,
) => ConversionRule[]
```

Also exported:

- `ConversionRule`
- `ConvertedValue`
- `RuleContext`
- `RuleGroup`
- `RuleTransform`
- `UnitMatcher`
- `PostcssUnitConverter`

## Built-in Presets

Single-rule presets:

- `presets.remToPx()`
- `presets.remToRpx()`
- `presets.remToRpxRatio()`
- `presets.remToRpxByRatio()`
- `presets.remToResponsivePixel()`
- `presets.remToViewport()`
- `presets.remToVw()`
- `presets.remToVh()`
- `presets.pxToRem()`
- `presets.pxToViewport()`
- `presets.pxToVw()`
- `presets.pxToVh()`
- `presets.pxToRpx()`
- `presets.rpxToPx()`
- `presets.rpxToRem()`
- `presets.rpxToVw()`
- `presets.rpxToVh()`
- `presets.vwToPx()`
- `presets.vhToPx()`
- `presets.vwToRem()`
- `presets.vhToRem()`
- `presets.vwToRpx()`
- `presets.vhToRpx()`

Grouped presets:

- `presets.pxPresetGroup()`
- `presets.rpxPresetGroup()`
- `presets.viewportPresetGroup()`
- `presets.webPresetGroup()`
- `presets.unitsToPx()`
