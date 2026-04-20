# postcss-rem-to-responsive-pixel

[English](./README.md) | 简体中文

一个用于 [PostCSS](https://github.com/ai/postcss) 的插件：把 `rem` 转换为 `px` 或 `rpx`，用于响应式与多端适配。

如果你想把这类规则和其他单位转换、自定义 preset 组合到一个插件里，更建议直接使用 `postcss-rule-unit-converter`。如果你只是想保持现有 `rem -> px/rpx` API 不变，则继续使用这个包。对应的一一迁移写法可以直接看 [`postcss-rule-unit-converter` 迁移文档](../postcss-rule-unit-converter/MIGRATION.zh-CN.md)。

- 使用 `TypeScript` 重写并覆盖测试
- `transformUnit` 支持 `px` 和 `rpx`
- 插件内部复用了 `postcss-plugin-shared` 的通用能力。

> 如果你仍在使用 `postcss@7.x`，请使用 `postcss-rem-to-responsive-pixel@5.x`（参见 `v6` 的 breaking changes：`./v6.md`）。

## 安装

```shell
npm i -D postcss-rem-to-responsive-pixel
yarn add -D postcss-rem-to-responsive-pixel
pnpm i -D postcss-rem-to-responsive-pixel
```

## 使用

### 在 postcss.config.js 中使用

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-rem-to-responsive-pixel')({
      rootValue: 32,
      propList: ['*'],
      transformUnit: 'rpx',
    }),
  ],
}
```

当你使用 `tailwindcss` 编写 H5 或小程序样式时，默认单位通常是 `rem`，此时可以用该插件把 `rem` 统一转换为 `px` 或 `rpx`：

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

## 输入 / 输出示例

_默认配置下仅会处理字体相关属性。_

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

类型：`Object | Null`

默认值：

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

### `rootValue`

类型：`number | (input) => number`

根元素字体大小（换算基数）。

## unitPrecision

类型：`number`

转换结果允许的小数精度（四舍五入策略见实现）。

## propList

类型：`(string | RegExp)[]`

需要从 rem 转换的属性列表。

字符串条目仍然保持现在的“包含匹配”行为；以 `!` 开头的字符串条目表示排除属性；只要字符串里包含 `*`，就会按 glob 模式匹配，例如：

```js
propList: ['*', '!font-size', '!padding*']
```

- `!font-size`：排除精确属性
- `!padding*`：排除 `padding`、`padding-left`、`padding-right` 等属性
- `!--wot-*-font-size`：排除 `--wot-body-font-size` 这类自定义属性

## selectorBlackList

类型：`(string | RegExp)[]`

命中这些选择器时保持 rem 不变。

## processorStage

类型：`'Once' | 'OnceExit'`
默认值：`'Once'`

控制插件运行的 PostCSS 阶段。如果需要在其他插件处理完成后再执行，可以设置为 `OnceExit`。

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

类型：`'px' | 'rpx'`

输出单位。

## disabled

类型：`boolean`

是否禁用插件。

### 关于“忽略 rem”的说明

如果只是想跳过少量属性，优先使用带 `!` 的 `propList` 配置。大写单位仍然保留，作为兼容技巧使用：

```text
// `rem` 会被转换
.convert {
  font-size: 1rem; // => 16px
}

// `Rem` 或 `REM` 会被忽略
.ignore {
  border: 1Rem solid; // ignored
  border-width: 2REM; // ignored
}
```
