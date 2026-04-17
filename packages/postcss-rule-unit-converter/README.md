# postcss-rule-unit-converter

Rule-driven PostCSS unit conversion plugin.

## Features

- One plugin for `rpx`, `px`, `rem`, `vw`, `vh`, and custom unit transforms
- Order-based matching rules
- Built-in common presets for two-way conversion between common units
- Reuses the same filtering options as the other packages in this monorepo
- Supports single presets and grouped preset collections for common workflows

## Mental Model

- Each rule matches a source unit and produces a next value.
- Rules are evaluated in order.
- If two rules can match the same source unit, the first matching rule wins.
- Use `composeRules(...)` when you want to merge multiple preset groups and custom rules into one ordered rule list.

## Usage

```ts
import postcss from 'postcss'
import unitConverter, { composeRules, presets } from 'postcss-rule-unit-converter'

const result = await postcss([
  unitConverter({
    rules: composeRules(
      presets.remToViewport({ viewportWidth: 375 }),
      presets.pxToRem({ rootValue: 16 }),
    ),
  }),
]).process('.title{font-size:1rem;margin:16px}', { from: undefined })
```

## Grouped Presets

```ts
import postcss from 'postcss'
import unitConverter, { composeRules, presets } from 'postcss-rule-unit-converter'

const result = await postcss([
  unitConverter({
    rules: composeRules(
      presets.rpxPresetGroup({
        ratio: 2,
        rootValue: 16,
        viewportWidth: 375,
        viewportHeight: 667,
      }),
      {
        from: 'em',
        to: 'rpx',
        factor: 32,
      },
    ),
  }),
]).process('.demo{font-size:32rpx;left:10vw}', { from: undefined })
```

Available grouped presets:

- `presets.rpxPresetGroup()` normalizes `px/rem/vw/vh` into `rpx`
- `presets.pxPresetGroup()` normalizes `rem/rpx/vw/vh` into `px`
- `presets.viewportPresetGroup()` normalizes `px/rem/rpx` into either `vw` or `vh`
- `presets.webPresetGroup()` bundles common `px/rem/vw/vh/rpx` web-style conversions

## More Examples

```ts
import postcss from 'postcss'
import unitConverter, { presets } from 'postcss-rule-unit-converter'

const result = await postcss([
  unitConverter({
    rules: [
      presets.rpxToPx(),
      presets.pxToRpx(),
      presets.rpxToRem({ rootValue: 16 }),
      presets.rpxToVw({ viewportWidth: 375 }),
      presets.rpxToVh({ viewportHeight: 667 }),
      presets.vwToPx({ viewportWidth: 375 }),
      presets.vhToPx({ viewportHeight: 667 }),
    ],
  }),
]).process('.demo{font-size:32rpx;width:10vw;height:10vh}', { from: undefined })
```

Custom transform rule:

```ts
import postcss from 'postcss'
import unitConverter from 'postcss-rule-unit-converter'

const result = await postcss([
  unitConverter({
    rules: [
      {
        from: /^x$/,
        to: 'px',
        transform(value, context) {
          return context.prop === 'letter-spacing' ? value * 4 : value * 8
        },
      },
    ],
  }),
]).process('.demo{letter-spacing:2x;margin:2x}', { from: undefined })
```

## Rule Tips

- Use `replace: false` when you want to keep fallback declarations beside converted values.
- Use `propList` to keep different presets from competing on the same source unit in unrelated properties.
- Prefer grouped presets when your project has one main unit system.
- Prefer explicit custom rule arrays when you need tight control over rule order.
- For `presets.viewportPresetGroup()`, choose `viewportUnit: 'vw'` or `viewportUnit: 'vh'` explicitly when you want one axis.

## Presets

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
- `presets.pxPresetGroup()`
- `presets.rpxPresetGroup()`
- `presets.viewportPresetGroup()`
- `presets.webPresetGroup()`
- `presets.unitsToPx()`
