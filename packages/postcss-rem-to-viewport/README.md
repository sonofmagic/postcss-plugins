# postcss-rem-to-viewport

A plugin for [PostCSS](https://github.com/ai/postcss) that generates px or rpx units from rem units.

- Rewrite with `typescript` and well tested.
- TransformUnit Support `vw` and others !

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
  rootValue: 375,
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

Type: `number`
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

## transformUnit

Type: `string`
Default: `vw`

The transform output unit.

## disabled

Type: `boolean`

If disable this plugin.

### A message about ignoring properties

Currently, the easiest way to have a single property ignored is to use a capital in the rem unit declaration.

```css
/* `rem` is converted to `px` */
.convert {
  font-size: 1rem;
}

/* `Rem` or `REM` is ignored by `postcss-rem-to-pixel` but still accepted by browsers */
.ignore {
  border: 1rem solid;
  border-width: 2rem;
}
```

Thanks to the author of `postcss-rem-to-pixel` and `postcss-pxtorem`.
