# postcss-pxtrans

[PostCSS](https://github.com/postcss/postcss) unit transform plugin (px -> rpx/rem/vw/px), rewritten in TypeScript for PostCSS 8.

## Install

```bash
pnpm add -D postcss-pxtrans
```

## Usage

```ts
import postcss from 'postcss'
import pxTransform from 'postcss-pxtrans'

const result = await postcss([
  pxTransform({
    platform: 'weapp',
    designWidth: 750,
  }),
]).process('.rule { font-size: 16px }', { from: undefined })

console.log(result.css)
```

## Options

This plugin keeps compatibility with the original `postcss-pxtransform` option style.

- `platform`: `weapp | h5 | rn | quickapp | harmony` (default: `weapp`)
- `designWidth`: `number | (input) => number` (default: `750`)
- `targetUnit`: `rpx | rem | px | vw | vmin` (depends on platform)
- `deviceRatio`: mapping of designWidth to ratio
- `propList`, `selectorBlackList`, `unitPrecision`, `replace`, `mediaQuery`, `minPixelValue`
- Legacy keys like `propWhiteList`, `prop_white_list`, `root_value`, `unit_precision` are still supported.
