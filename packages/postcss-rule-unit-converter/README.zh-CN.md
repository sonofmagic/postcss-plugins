# postcss-rule-unit-converter

基于规则的通用 PostCSS 单位转换插件。

## 特性

- 一个插件统一处理 `rpx`、`px`、`rem`、`vw`、`vh` 以及自定义单位
- 按规则顺序匹配转换
- 内置常见单位的双向 preset
- 复用仓库里现有的属性过滤、选择器黑名单、文件排除等能力

## 用法

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

## 更多示例

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
