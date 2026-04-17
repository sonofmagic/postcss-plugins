# postcss-rule-unit-converter

基于规则的通用 PostCSS 单位转换插件。

- 场景示例文档：[COOKBOOK.zh-CN.md](./COOKBOOK.zh-CN.md)

## 特性

- 一个插件统一处理 `rpx`、`px`、`rem`、`vw`、`vh` 以及自定义单位
- 按规则顺序匹配转换
- 内置常见单位的双向 preset
- 复用仓库里现有的属性过滤、选择器黑名单、文件排除等能力
- 同时支持单个 preset 和按场景封装好的 preset group

## 心智模型

- 每条规则负责匹配一种源单位并生成一个新值。
- 规则按顺序执行。
- 如果多条规则都能命中同一个源单位，先写的那条优先。
- 需要组合多组 preset 和自定义规则时，用 `composeRules(...)` 明确最终顺序。

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

## 分组 Preset

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

内置的分组 preset：

- `presets.rpxPresetGroup()` 把 `px/rem/vw/vh` 归一成 `rpx`
- `presets.pxPresetGroup()` 把 `rem/rpx/vw/vh` 归一成 `px`
- `presets.viewportPresetGroup()` 把 `px/rem/rpx` 归一成单一目标轴的 `vw` 或 `vh`
- `presets.webPresetGroup()` 提供一组偏 Web 场景的 `px/rem/vw/vh/rpx` 常用规则

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

## 自定义 Preset

单条 preset，自带导出的类型：

```ts
import type { PresetFactory, RemBasedPresetOptions } from 'postcss-rule-unit-converter'
import postcss from 'postcss'
import unitConverter, {
  definePreset

} from 'postcss-rule-unit-converter'

const remToDp: PresetFactory<RemBasedPresetOptions> = definePreset((options = {}) => {
  const { rootValue = 16, minValue, to = 'dp' } = options
  return {
    from: 'rem',
    to,
    minValue,
    transform: (value, context) => {
      const resolvedRootValue = typeof rootValue === 'function'
        ? rootValue(context.input)
        : rootValue
      return value * resolvedRootValue
    },
  }
})

const result = await postcss([
  unitConverter({
    rules: [remToDp({ rootValue: 20 })],
  }),
]).process('.demo{font-size:1rem}', { from: undefined })
```

分组 preset，自带导出的类型：

```ts
import type { PresetGroupFactory, RemBasedPresetOptions } from 'postcss-rule-unit-converter'
import postcss from 'postcss'
import unitConverter, {
  definePresetGroup

} from 'postcss-rule-unit-converter'

type MyPresetOptions = RemBasedPresetOptions & {
  ratio?: number
}

const mobilePresetGroup: PresetGroupFactory<MyPresetOptions> = definePresetGroup((options = {}) => {
  const { rootValue = 16, ratio = 2 } = options
  return [
    {
      from: 'rem',
      to: 'rpx',
      transform: (value, context) => {
        const resolvedRootValue = typeof rootValue === 'function'
          ? rootValue(context.input)
          : rootValue
        return value * resolvedRootValue * ratio
      },
    },
    {
      from: 'px',
      to: 'rpx',
      factor: ratio,
    },
  ]
})

const result = await postcss([
  unitConverter({
    rules: mobilePresetGroup({ rootValue: 16, ratio: 2 }),
  }),
]).process('.demo{font-size:1rem;margin:16px}', { from: undefined })
```

自定义 transform 规则：

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

## 使用建议

- 想保留兜底声明时，用 `replace: false`。
- 想避免多条 preset 对同一源单位发生竞争时，用 `propList` 把适用范围收窄。
- 项目里如果有一个主单位体系，优先使用 preset group。
- 如果你要严格控制命中顺序，优先直接写显式规则数组。
- 使用 `presets.viewportPresetGroup()` 时，建议显式指定 `viewportUnit: 'vw'` 或 `viewportUnit: 'vh'`。
- 在业务里沉淀可复用 preset 时，优先使用 `definePreset(...)` 和 `definePresetGroup(...)`。
- 如果你想直接抄场景配置，优先看 cookbook。

## Presets

自定义 preset 辅助类型：

- `definePreset()`
- `definePresetGroup()`
- `type PresetFactory<TOptions>`
- `type PresetGroupFactory<TOptions>`

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
