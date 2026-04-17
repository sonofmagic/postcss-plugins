# postcss-rule-unit-converter

Rule-driven PostCSS unit conversion plugin.

## Features

- One plugin for `rpx`, `px`, `rem`, `vw`, `vh`, and custom unit transforms
- Order-based matching rules
- Built-in common presets for two-way conversion between common units
- Reuses the same filtering options as the other packages in this monorepo

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
- `presets.unitsToPx()`
