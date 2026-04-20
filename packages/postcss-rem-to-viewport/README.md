# postcss-rem-to-viewport

A plugin for [PostCSS](https://github.com/ai/postcss) that generates viewport units from rem units.

If you need to combine this behavior with other unit conversions or custom presets, prefer `postcss-rule-unit-converter`. Keep this package when you want the legacy `rem -> viewport` API surface unchanged. For equivalent config examples, see [`postcss-rule-unit-converter` migration guide](../postcss-rule-unit-converter/MIGRATION.md).

English | [简体中文](./README.zh-CN.md)

- Rewrite with `typescript` and well tested.
- TransformUnit Support `vw` and others !
- Internally reuses shared utilities from `postcss-plugin-shared`.

## Install

```shell
npm i -D postcss-rem-to-viewport
yarn add -D postcss-rem-to-viewport
pnpm i -D postcss-rem-to-viewport
```

## Usage

### Use with postcss.config.js

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-rem-to-viewport')({
      // default: rootValue: 375,
    }),
  ],
}
```

## Options

Type: `Object | Null`
Default:

```js
const defaultOptions = {
  rootValue: 375, // number | (input) => number
  unitPrecision: 16,
  selectorBlackList: [],
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  replace: true,
  mediaQuery: false,
  minRemValue: 0,
  exclude: [/node_modules/i],
  transformUnit: 'vw',
  disabled: false
}
```

### rootValue

Type: `number | (input) => number`
Default: `375`

The root element font size. can be `750` or other

> `100vw = 375px = 23.4375rem`

## unitPrecision

Type: `number`
Default: `16`

The decimal precision px units are allowed to use, floored (rounding down on half).

## propList

Type: `(string | RegExp)[]`

The properties that can change from rem to px.

String entries keep the existing substring-match behavior. String entries
starting with `!` exclude properties. If a string contains `*`, it is treated
as a glob pattern:

```js
propList: ['*', '!font-size', '!padding*', '!--wot-*-font-size']
```

## selectorBlackList

Type: `(string | RegExp)[]`

The selectors to ignore and leave as rem.

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

Type: `string`
Default: `vw`

The transform output unit.

## disabled

Type: `boolean`

If disable this plugin.

### A message about ignoring properties

Currently, the easiest way to have a single property ignored is to use a capital in the rem unit declaration.

```text
/* `rem` is converted to `px` */
.convert {
  font-size: 1rem;
}

/* `Rem` or `REM` is ignored by `postcss-rem-to-pixel` but still accepted by browsers */
.ignore {
  border: 1Rem solid;
  border-width: 2REM;
}
```

Thanks to the author of `postcss-rem-to-pixel` and `postcss-pxtorem`.
