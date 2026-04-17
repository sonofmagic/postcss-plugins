# Migration Guide

Move legacy packages to `postcss-rule-unit-converter` without changing behavior.

- Overview: [README.md](./README.md)
- API: [API.md](./API.md)
- Recipes: [COOKBOOK.md](./COOKBOOK.md)

## When To Migrate

Prefer `postcss-rule-unit-converter` when you need:

- one plugin that handles multiple unit systems
- custom preset authoring
- ordered rule composition
- one shared API instead of several package-specific APIs

Keep the legacy packages when you need strict backward compatibility for existing config or public package names.

## `postcss-rem-to-viewport`

Legacy:

```ts
import remToViewport from 'postcss-rem-to-viewport'

remToViewport({
  rootValue: 375,
  transformUnit: 'vw',
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  unitPrecision: 16,
})
```

Unified:

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

Option mapping:

- `rootValue` -> `viewportWidth`
- `transformUnit` -> `to`
- `minRemValue` -> `minValue`
- `propList`, `selectorBlackList`, `replace`, `mediaQuery`, `exclude`, `disabled` -> same option names

## `postcss-rem-to-responsive-pixel`

Legacy:

```ts
import remToResponsivePixel from 'postcss-rem-to-responsive-pixel'

remToResponsivePixel({
  rootValue: 16,
  transformUnit: 'rpx',
  propList: ['*'],
})
```

Unified:

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

For `transformUnit: 'px'`, use `presets.remToPx({ rootValue })`.

Option mapping:

- `rootValue` -> `rootValue`
- `transformUnit: 'px'` -> `presets.remToPx(...)`
- `transformUnit: 'rpx'` -> `presets.remToRpx(...)`
- `minRemValue` -> `minValue`
- `processorStage` -> not needed; `postcss-rule-unit-converter` runs in `Once`
- `propList`, `selectorBlackList`, `replace`, `mediaQuery`, `exclude`, `disabled` -> same option names

## `postcss-units-to-px`

Legacy:

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

Unified:

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

Migration notes:

- `presets.unitsToPx()` covers the default `rem/em/vw/vh/vmin/vmax/rpx -> px` set.
- For custom unit maps, convert each item into a `ConversionRule`.
- If old `unitMap` used matcher order, preserve that order in the new `rules` array.
- If old `transform` handled fallback logic, move that logic into `transform(value, context)`.

## `postcss-pxtrans`

`postcss-pxtrans` has platform presets plus directive comment handling. Keep it if you rely on:

- `createDirectivePlugin()`
- `platform`-driven config
- Harmony `PX/Px/pX -> ch` behavior as a dedicated package API

If you only need the size conversion logic, the equivalent rule shape is:

```ts
import unitConverter from 'postcss-rule-unit-converter'

unitConverter({
  rules: [
    {
      from: unit => unit === 'px' || unit === 'rpx',
      to: 'rem',
      transform(value, context) {
        return value / 34.18803418803419
      },
    },
  ],
})
```

For exact `pxtrans` parity, you usually still want `postcss-pxtrans`, because it packages platform defaults, directive handling, and edge-case compatibility in one API.

## Custom Preset Strategy

If your app currently switches between multiple legacy plugins, prefer writing one local preset group:

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

This keeps app-specific logic in one place instead of distributing it across multiple plugin packages.
