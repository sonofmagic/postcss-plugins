# postcss-units-to-px

将多种 CSS 单位转换为 `px` 的 PostCSS 插件。默认支持 `rem`、`em`、`vw`、`vh`、`vmin`、`vmax`、`rpx`，并可按需覆盖或扩展规则。

## 安装

```bash
pnpm add postcss-units-to-px postcss
```

## 使用

```ts
import postcss from 'postcss'
import unitsToPx from 'postcss-units-to-px'

const input = '.rule { margin: 1rem 1vw; }'
const output = postcss(unitsToPx()).process(input).css
```

## 配置

类型: `Object | Null`
默认值:

```ts
const defaultOptions = {
  unitMap: {
    rem: 16,
    em: 16,
    vw: 3.75,
    vh: 6.67,
    vmin: 3.75,
    vmax: 6.67,
    rpx: 0.5,
  },
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ['*'],
  replace: true,
  mediaQuery: false,
  minValue: 0,
  exclude: [/node_modules/i],
  disabled: false,
}
```

### unitMap

类型: `Record<string, number | (value, context) => number | null | false> | Map<string | RegExp | (unit) => boolean, number | (value, context) => number | null | false> | Array<[string | RegExp | (unit) => boolean, number | (value, context) => number | null | false]>`

单位转换规则。数值表示倍率（例如 `1rem * 16 = 16px`）。函数需要返回最终 px 值。若某个单位规则为 `null`，则会回退使用全局 `transform`。若规则为 `false`，则保持原值，即使存在全局 `transform`。

注意：`unitMap` 仅在传入普通对象时与默认值合并；使用 `Map` 或 `Array` 时不会合并默认值。
对于 `Map`/`Array`，规则按顺序匹配，命中第一个即停止。

你可以通过导出的 `defaultUnitMap` 快速构建带默认值的 `Map`：

```ts
import unitsToPx from 'postcss-units-to-px'
import { defaultUnitMap } from 'postcss-units-to-px/defaults'

const unitMap = new Map(Object.entries(defaultUnitMap))
unitMap.set(/^v/, 3.75)
unitMap.set(unit => unit.endsWith('rpx'), false)

postcss(unitsToPx({ unitMap }))
```

### transform

类型: `((value, unit, context) => number) | false`

当某个单位未定义规则（或规则为 `null`）时使用的全局转换函数。设为 `false` 表示全部单位都不转换。

### unitPrecision

类型: `number`
默认值: `5`

输出 px 的小数精度。

### minValue

类型: `number`
默认值: `0`

小于该阈值的单位值不会被转换。

### propList

类型: `(string | RegExp)[]`

只处理匹配的属性。支持 `'*'` 表示全部属性。

### selectorBlackList

类型: `(string | RegExp)[]`

匹配到的选择器将被忽略。

### replace

类型: `boolean`

替换原声明值而不是追加一个新声明。

### mediaQuery

类型: `boolean`

允许在 `@media` 参数中转换单位。

### exclude

类型: `(string | RegExp)[] | ((filePath: string) => boolean)`

根据文件路径排除处理。

### disabled

类型: `boolean`

禁用插件。

## Transform Context

转换函数会接收到如下上下文：

```ts
interface TransformContext {
  root: Root
  input: Input
  filePath?: string
  decl?: Declaration
  rule?: Rule
  atRule?: AtRule
  prop?: string
  selector?: string
}
```

## 说明

- 正则会跳过引号字符串、`url(...)` 和 `var(...)`，避免误替换。
- 绝对单位（`in/cm/mm/pt/pc/q`）默认不处理，可自行添加到 `unitMap`。
