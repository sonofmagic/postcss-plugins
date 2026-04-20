# postcss-rem-to-responsive-pixel

A plugin for [PostCSS](https://github.com/ai/postcss) that generates px or rpx units from rem units.

If you need to combine this behavior with other unit conversions or author custom presets, prefer `postcss-rule-unit-converter`. Keep this package when you want the legacy `rem -> px/rpx` API surface unchanged. For equivalent config examples, see [`postcss-rule-unit-converter` migration guide](../postcss-rule-unit-converter/MIGRATION.md).

English | [简体中文](./README.zh-CN.md)

- Rewrite with `typescript` and well tested.
- TransformUnit Support `px` and `rpx`!
- Internally reuses shared utilities from `postcss-plugin-shared`.

> If you still use `postcss@7.x`, you should use `postcss-rem-to-responsive-pixel@5.x` > [See version 6 breaking changes](./v6.md)

## Install

```shell
npm i -D postcss-rem-to-responsive-pixel
yarn add -D postcss-rem-to-responsive-pixel
pnpm i -D postcss-rem-to-responsive-pixel
```

## Usage

### Use with postcss.config.js

```js
// postcss.config.js
module.exports = {
  plugins: [
    // for example
    // require('autoprefixer'),
    // require('tailwindcss'),
    require('postcss-rem-to-responsive-pixel')({
      rootValue: 32,
      propList: ['*'],
      transformUnit: 'rpx',
    }),
  ],
}
```

When you use `tailwindcss` to write your website or miniprogram, the default unit is `rem`, so sometimes we have to transform our unit to `px` or `rpx`.

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-rem-to-responsive-pixel')({
      rootValue: 32,
      propList: ['*'],
      transformUnit: 'rpx',
    }),
  ],
}
```

## Input/Output

_With the default settings, only font related properties are targeted._

```scss
// input
h1 {
  margin: 0 0 20px;
  font-size: 2rem;
  line-height: 1.2;
  letter-spacing: 0.0625rem;
}

// output
h1 {
  margin: 0 0 20px;
  font-size: 64rpx;
  line-height: 1.2;
  letter-spacing: 2rpx;
}
```

## Options

Type: `Object | Null`
Default:

```js
const defaultOptions = {
  rootValue: 16, // number | (input) => number
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  replace: true,
  mediaQuery: false,
  minRemValue: 0,
  exclude: [/node_modules/i],
  transformUnit: 'px',
  disabled: false,
  processorStage: 'Once',
}
```

### rootValue

Type: `number | (input) => number`

The root element font size.

## unitPrecision

Type: `number`

The decimal precision px units are allowed to use, floored (rounding down on half).

## propList

Type: `(string | RegExp)[]`

The properties that can change from rem to px.

String entries keep the existing substring-match behavior. String entries
starting with `!` exclude properties. If a string contains `*`, it is treated
as a glob pattern:

```js
propList: ['*', '!font-size', '!padding*']
```

- `!font-size`: exclude the exact property
- `!padding*`: exclude `padding`, `padding-left`, `padding-right`, etc.
- `!--wot-*-font-size`: exclude custom properties like `--wot-body-font-size`

## selectorBlackList

Type: `(string | RegExp)[]`

The selectors to ignore and leave as rem.

## processorStage

Type: `'Once' | 'OnceExit'`
Default: `'Once'`

Controls which PostCSS stage the plugin runs at. Use `OnceExit` if you need it to run after other plugins.

## replace

Type: `boolean`

replaces rules containing rems instead of adding fallbacks.

## mediaQuery

Type: `boolean`

Allow rem to be converted in media queries.

## minRemValue

Type: `number`

Set the minimum rem value to replace.

## exclude

Type: `(string | RegExp)[] | ((filePath: string) => boolean)`

The file path to ignore and leave as px.

### Choosing Between `exclude`, `selectorBlackList`, and `propList`

- `exclude`: skip the whole file before any declaration is processed
- `selectorBlackList`: skip matching selectors inside an otherwise processed file
- `propList`: skip or include specific CSS properties inside matched selectors

Use `exclude` for file-level boundaries such as `node_modules` or generated CSS.
Use `selectorBlackList` when a rule or component should be left untouched. Use
`propList` when the file and selector should still be processed, but some
properties such as `font-size` or `--wot-*-font-size` should be skipped.

## transformUnit

Type: `'px' | 'rpx'`

The transform output unit.

## disabled

Type: `boolean`

If disable this plugin.

### A message about ignoring properties

If you only want to skip a few properties, prefer configuring `propList` with
negated entries. Uppercase units are still supported as a compatibility trick.

```text
// `rem` is converted to `px`
.convert {
  font-size: 1rem; // converted to 16px
}

// `Rem` or `REM` is ignored by `postcss-rem-to-pixel` but still accepted by browsers
.ignore {
  border: 1Rem solid; // ignored
  border-width: 2REM; // ignored
}
```

Thanks to the author of `postcss-rem-to-pixel` and `postcss-pxtorem`.
