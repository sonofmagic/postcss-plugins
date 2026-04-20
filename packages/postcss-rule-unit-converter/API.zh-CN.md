# API Reference

`postcss-rule-unit-converter` 的 API 参考。

- 总览与快速上手：[README.zh-CN.md](./README.zh-CN.md)
- 场景化示例：[COOKBOOK.zh-CN.md](./COOKBOOK.zh-CN.md)
- Preset 编写指南：[PRESET_AUTHORING.zh-CN.md](./PRESET_AUTHORING.zh-CN.md)

## 插件入口

```ts
import unitConverter from 'postcss-rule-unit-converter'
```

```ts
type PostcssUnitConverter = PluginCreator<UserDefinedOptions>
```

## 配置项

```ts
interface UserDefinedOptions {
  rules?: readonly ConversionRule[]
  unitRegex?: RegExp
  unitPrecision?: number
  minValue?: number
  keepZeroUnit?: boolean
  selectorBlackList?: (string | RegExp)[]
  propList?: (string | RegExp)[]
  replace?: boolean
  mediaQuery?: boolean
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  disabled?: boolean
}
```

- `rules`：有序转换规则，先命中的先生效。
- `unitRegex`：覆盖插件自动生成的匹配正则。
- `unitPrecision`：输出值的小数精度。
- `minValue`：全局最小转换阈值。
- `keepZeroUnit`：保留 `0px`、`0rem` 这类带单位的零值输出，而不是折叠成裸 `0`。
- `selectorBlackList`：命中这些选择器时跳过。
- `propList`：仅处理匹配的属性。支持 `!font-size`、`!padding*`、
  `!--wot-*-font-size` 这类取反 / glob 写法。
- `replace`：是否直接替换原声明；否则追加 fallback。
- `mediaQuery`：是否处理 `@media` 参数中的单位。
- `exclude`：按文件路径或 predicate 跳过整文件。
- `disabled`：禁用插件。

## 规则类型

```ts
type UnitMatcher = string | RegExp | ((unit: string) => boolean)

interface ConversionRule {
  from: UnitMatcher
  to?: string
  factor?: number
  minValue?: number
  transform?: RuleTransform
}
```

- `from`：源单位匹配器。
- `to`：默认输出单位。
- `factor`：简单倍率转换写法。
- `minValue`：单条规则自己的最小转换阈值，会覆盖全局 `minValue`。
- `transform`：需要完整自定义逻辑时使用。

规则按数组顺序执行。如果多条规则都能命中同一个源单位，只有第一条会生效。

## transform 回调

```ts
type RuleTransform = (
  value: number,
  context: RuleContext,
) => number | ConvertedValue | undefined

interface ConvertedValue {
  value: number
  unit?: string
}
```

- 返回 `number`：沿用 `to` 作为输出单位。
- 返回 `{ value, unit }`：同时自定义输出值和输出单位。
- 返回 `undefined`：保持原始匹配结果不变。

## RuleContext

`RuleContext` 基于 `postcss-plugin-shared` 的 replace context 扩展而来。

```ts
interface RuleContext {
  root: Root
  input: Input
  filePath?: string
  decl?: Declaration
  rule?: Rule
  atRule?: AtRule
  prop?: string
  selector?: string
  fromUnit: string
  rawUnit: string
  rawValue: string
  match: string
}
```

- `fromUnit`：归一化后的小写源单位。
- `rawUnit`：原始匹配到的单位文本。
- `rawValue`：原始匹配到的数字文本。
- `match`：完整匹配片段。

## 辅助函数

```ts
function composeRules(...groups: RuleGroup[]): ConversionRule[]
```

把 preset group 和单条规则拍平成一个最终有序规则数组。

```ts
function definePreset<TOptions extends PresetOptions = undefined>(
  factory: (options?: TOptions) => ConversionRule,
): PresetFactory<TOptions>

function definePresetGroup<TOptions extends PresetOptions = undefined>(
  factory: (options?: TOptions) => ConversionRule[],
): PresetGroupFactory<TOptions>
```

在业务侧或其他包里封装可复用 preset 时，优先使用这两个 helper。

## 导出的类型

```ts
type PresetFactory<TOptions extends PresetOptions = undefined> = (
  options?: TOptions,
) => ConversionRule

type PresetGroupFactory<TOptions extends PresetOptions = undefined> = (
  options?: TOptions,
) => ConversionRule[]
```

另外还会导出：

- `ConversionRule`
- `ConvertedValue`
- `RuleContext`
- `RuleGroup`
- `RuleTransform`
- `UnitMatcher`
- `PostcssUnitConverter`

## 内置 Preset

单条规则 preset：

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

分组 preset：

- `presets.pxPresetGroup()`
- `presets.rpxPresetGroup()`
- `presets.viewportPresetGroup()`
- `presets.webPresetGroup()`
- `presets.unitsToPx()`
