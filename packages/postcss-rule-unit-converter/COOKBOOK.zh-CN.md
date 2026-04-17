# Cookbook

`postcss-rule-unit-converter` 的常见配置场景。

## H5 375 设计稿转 `vw`

```ts
import unitConverter, { presets } from 'postcss-rule-unit-converter'

export default {
  plugins: [
    unitConverter({
      rules: [
        presets.remToVw({
          rootValue: 16,
          viewportWidth: 375,
        }),
      ],
    }),
  ],
}
```

适用场景：

- 源样式主要使用 `rem`
- 目标输出想统一成 `vw`
- 只需要简单的 `rem -> vw` 转换

## 小程序 `rem/px -> rpx`

```ts
import unitConverter, { composeRules, presets } from 'postcss-rule-unit-converter'

export default {
  plugins: [
    unitConverter({
      rules: composeRules(
        presets.rpxPresetGroup({
          rootValue: 16,
          ratio: 2,
          viewportWidth: 375,
          viewportHeight: 667,
        }),
      ),
    }),
  ],
}
```

适用场景：

- 目标运行时更偏向 `rpx`
- 源样式里可能同时出现 `px`、`rem`、`vw`、`vh`
- 想统一归一到一个目标单位

## 只转换字体相关属性

```ts
import unitConverter, { presets } from 'postcss-rule-unit-converter'

export default {
  plugins: [
    unitConverter({
      propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
      rules: [
        presets.remToPx(),
      ],
    }),
  ],
}
```

适用场景：

- 间距和布局不想动
- 只想处理文字相关声明

## 保留兜底值

```ts
import unitConverter, { presets } from 'postcss-rule-unit-converter'

export default {
  plugins: [
    unitConverter({
      replace: false,
      rules: [
        presets.pxToRem({
          rootValue: 16,
        }),
      ],
    }),
  ],
}
```

这个配置会保留原始声明，并把转换后的声明追加在后面。

## 按文件动态切换 Root Value

```ts
import unitConverter, { presets } from 'postcss-rule-unit-converter'

export default {
  plugins: [
    unitConverter({
      rules: [
        presets.remToPx({
          rootValue: input => input.file?.includes('tablet') ? 18 : 16,
        }),
      ],
    }),
  ],
}
```

适用场景：

- 手机和平板共用一套构建
- 不同文件需要不同转换基准

## 在业务里自定义 Preset

```ts
import type { PresetFactory, RemBasedPresetOptions } from 'postcss-rule-unit-converter'
import unitConverter, {
  definePreset

} from 'postcss-rule-unit-converter'

const remToDp: PresetFactory<RemBasedPresetOptions> = definePreset((options = {}) => {
  const { rootValue = 16, minValue, to = 'dp' } = options
  return {
    from: 'rem',
    to,
    ...(minValue === undefined ? {} : { minValue }),
    transform: (value, context) => {
      const resolvedRootValue = typeof rootValue === 'function'
        ? rootValue(context.input)
        : rootValue
      return value * resolvedRootValue
    },
  }
})

export default {
  plugins: [
    unitConverter({
      rules: [remToDp()],
    }),
  ],
}
```

## 分组 Preset 和手写规则混用

```ts
import unitConverter, { composeRules, presets } from 'postcss-rule-unit-converter'

export default {
  plugins: [
    unitConverter({
      rules: composeRules(
        presets.pxPresetGroup({
          rootValue: 16,
          viewportWidth: 375,
          viewportHeight: 667,
        }),
        {
          from: 'em',
          to: 'px',
          factor: 16,
        },
      ),
    }),
  ],
}
```

适用场景：

- 大部分规则可以套标准 preset group
- 但项目里还有少量额外单位要单独处理
