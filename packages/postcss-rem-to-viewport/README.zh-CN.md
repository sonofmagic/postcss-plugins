# postcss-rem-to-viewport

[English](./README.md) | 简体中文

一个用于 [PostCSS](https://github.com/ai/postcss) 的插件：把 `rem` 转换为 viewport 单位（默认 `vw`），用于响应式布局。

- 使用 `TypeScript` 重写并覆盖测试
- `transformUnit` 支持 `vw` 等其他单位
- 插件内部复用了 `postcss-plugin-shared` 的通用能力。

## 安装

```shell
npm i -D postcss-rem-to-viewport
yarn add -D postcss-rem-to-viewport
pnpm i -D postcss-rem-to-viewport
```

## 使用

### 在 postcss.config.js 中使用

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

类型：`Object | Null`

默认值：

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
  disabled: false,
}
```

### `rootValue`

类型：`number | (input) => number`
默认值：`375`

根元素字体大小（换算基数），也可以设置为 `750` 或其他设计稿宽度。

> `100vw = 375px = 23.4375rem`

## unitPrecision

类型：`number`
默认值：`16`

转换结果允许的小数精度。

## propList

类型：`(string | RegExp)[]`

需要从 rem 转换的属性列表。

## selectorBlackList

类型：`(string | RegExp)[]`

命中这些选择器时保持 rem 不变。

## replace

类型：`boolean`

是否直接替换；为 `false` 时会追加一条新声明作为 fallback。

## mediaQuery

类型：`boolean`

是否转换 `@media` 中的 rem。

## minRemValue

类型：`number`

小于该值的 rem 不会被转换。

## exclude

类型：`(string | RegExp)[] | ((filePath: string) => boolean)`

匹配的文件路径将被跳过。

## transformUnit

类型：`string`
默认值：`vw`

输出单位。

## disabled

类型：`boolean`

是否禁用插件。

### 关于“忽略 rem”的说明

目前最简单的方式是使用大写单位来标记不转换（浏览器仍可识别）：

```text
/* `rem` 会被转换 */
.convert {
  font-size: 1rem;
}

/* `Rem` 或 `REM` 会被忽略 */
.ignore {
  border: 1Rem solid;
  border-width: 2REM;
}
```
