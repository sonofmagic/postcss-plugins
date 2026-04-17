# Migration Guide

把老包迁移到 `postcss-rule-unit-converter`，同时尽量保持行为不变。

- 总览与快速上手：[README.zh-CN.md](./README.zh-CN.md)
- API 文档：[API.zh-CN.md](./API.zh-CN.md)
- 场景示例：[COOKBOOK.zh-CN.md](./COOKBOOK.zh-CN.md)

## 什么时候该迁移

如果你需要下面这些能力，更建议迁移到 `postcss-rule-unit-converter`：

- 一个插件统一处理多套单位体系
- 自定义 preset / preset group
- 显式控制规则顺序
- 用一套统一 API 替代多个包各自的配置方式

如果你当前主要诉求是保持老配置、老包名、老接入方式不变，那就继续使用老包。

## `postcss-rem-to-viewport`

老写法：

```ts
import remToViewport from 'postcss-rem-to-viewport'

remToViewport({
  rootValue: 375,
  transformUnit: 'vw',
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  unitPrecision: 16,
})
```

统一插件写法：

```ts
import unitConverter, { presets } from 'postcss-rule-unit-converter'

unitConverter({
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  unitPrecision: 16,
  rules: [
    presets.remToViewport({
      rootValue: 16,
      viewportWidth: 375,
      to: 'vw',
    }),
  ],
})
```

选项映射：

- `rootValue` -> `viewportWidth`
- `transformUnit` -> `to`
- `minRemValue` -> `minValue`
- `propList`、`selectorBlackList`、`replace`、`mediaQuery`、`exclude`、`disabled` -> 同名选项

## `postcss-rem-to-responsive-pixel`

老写法：

```ts
import remToResponsivePixel from 'postcss-rem-to-responsive-pixel'

remToResponsivePixel({
  rootValue: 16,
  transformUnit: 'rpx',
  propList: ['*'],
})
```

统一插件写法：

```ts
import unitConverter, { presets } from 'postcss-rule-unit-converter'

unitConverter({
  propList: ['*'],
  rules: [
    presets.remToRpx({
      rootValue: 16,
    }),
  ],
})
```

如果原来是 `transformUnit: 'px'`，则改为 `presets.remToPx({ rootValue })`。

选项映射：

- `rootValue` -> `rootValue`
- `transformUnit: 'px'` -> `presets.remToPx(...)`
- `transformUnit: 'rpx'` -> `presets.remToRpx(...)`
- `minRemValue` -> `minValue`
- `processorStage` -> 不需要；统一插件固定在 `Once`
- `propList`、`selectorBlackList`、`replace`、`mediaQuery`、`exclude`、`disabled` -> 同名选项

## `postcss-units-to-px`

老写法：

```ts
import unitsToPx from 'postcss-units-to-px'

unitsToPx({
  unitMap: {
    rem: 16,
    vw: 3.75,
    rpx: 0.5,
  },
})
```

统一插件写法：

```ts
import unitConverter, { composeRules, presets } from 'postcss-rule-unit-converter'

unitConverter({
  rules: composeRules(
    presets.unitsToPx(),
    {
      from: 'vw',
      to: 'px',
      factor: 3.75,
    },
  ),
})
```

迁移说明：

- `presets.unitsToPx()` 已经覆盖默认的 `rem/em/vw/vh/vmin/vmax/rpx -> px`
- 自定义 `unitMap` 时，把每个映射项改写成一条 `ConversionRule`
- 如果老 `unitMap` 依赖命中顺序，就按原顺序写在新的 `rules` 数组里
- 如果老 `transform` 用来兜底，就把逻辑迁到 `transform(value, context)`

## `postcss-pxtrans`

`postcss-pxtrans` 除了尺寸转换，还包含平台预设和指令注释处理。以下场景建议继续保留：

- 依赖 `createDirectivePlugin()`
- 依赖 `platform` 预设配置
- 依赖 Harmony 的 `PX/Px/pX -> ch` 专用行为

如果你只需要尺寸转换逻辑，统一插件里等价的 rule 形态大致如下：

```ts
import unitConverter from 'postcss-rule-unit-converter'

unitConverter({
  rules: [
    {
      from: unit => unit === 'px' || unit === 'rpx',
      to: 'rem',
      transform(value) {
        return value / 34.18803418803419
      },
    },
  ],
})
```

但如果你要完整复刻 `pxtrans` 的平台默认值、指令能力和边界兼容行为，通常还是继续使用 `postcss-pxtrans` 更合适。

## 自定义 Preset 策略

如果你的项目现在是多个老插件混着用，更建议在业务里沉淀一个自己的 preset group：

```ts
import { definePresetGroup } from 'postcss-rule-unit-converter'

export const appPresetGroup = definePresetGroup((options = {}) => {
  return [
    // rem -> rpx
    // px -> rpx
    // vw -> px
  ]
})
```

这样项目侧的规则会集中在一个地方维护，而不是分散在多个插件包里。
