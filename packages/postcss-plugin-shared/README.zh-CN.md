# postcss-plugin-shared

[English](./README.md) | 简体中文

`postcss-plugin-shared` 是 `postcss-plugins` monorepo 内部多个 PostCSS 插件之间复用的公共工具包，主要用于消除重复实现（配置合并、选择器黑名单、声明去重、exclude 匹配、单位正则与数值处理等）。

> 设计目标：**小而稳定、无副作用、可在多个插件中复用**。该包不包含具体的单位换算逻辑（例如 rem→px 的公式），只提供通用能力。

## 安装 / 使用方式

### 在本仓库（pnpm workspace）中

本仓库内建议使用 workspace 依赖：

```jsonc
// packages/your-plugin/package.json
{
  "dependencies": {
    "postcss-plugin-shared": "workspace:^"
  }
}
```

然后在插件代码中直接引用：

```ts
import { createExcludeMatcher, remRegex } from 'postcss-plugin-shared'
```

### 在仓库外使用

如果你把该包发布到了 npm，则可以使用常规安装方式（示例）：

```bash
pnpm add postcss-plugin-shared
```

该包声明了 `postcss` 为 `peerDependencies`（`^8`）。

## 导出内容（Exports）

入口：`packages/postcss-plugin-shared/src/index.ts`

- `mergeOptions`：基于 `defu` 的 options 合并工具（数组采用“覆盖”策略）
- `toFixed`：稳定的小数处理（避免 `-0`/精度噪声）
- `remRegex` / `pxRegex`：用于替换 rem/px 的通用正则（排除字符串字面量、`url()`、`var()`）
- `blacklistedSelector`：选择器黑名单匹配（string 包含 / RegExp 匹配）
- `createPropListMatcher`：根据 propList 生成属性匹配函数（支持 `*` 通配）
- `createExcludeMatcher`：根据 exclude 生成文件路径排除函数（数组或函数）
- `declarationExists`：用于检测某 rule/decls 中是否已存在相同 `prop/value`，避免重复注入

## API 说明

### `mergeOptions(options, defaults)`

用于把用户配置与默认配置合并，行为特点：

- 对象字段按 `defu` 语义合并（仅在 `options` 未提供时回退到 `defaults`）
- **数组字段采用覆盖策略**：如果 `options.someArray` 与 `defaults.someArray` 都是数组，则使用 `options.someArray` 覆盖

```ts
import { mergeOptions } from 'postcss-plugin-shared'

interface Options {
  propList: string[]
  unitPrecision: number
}

const defaults: Options = { propList: ['*'], unitPrecision: 5 }
const resolved = mergeOptions<Options>({ propList: ['font-size'] }, defaults)
// resolved.propList === ['font-size']
```

### `toFixed(number, precision)`

对数值进行稳定四舍五入：

- `number === 0` 时直接返回 `0`
- 保留符号（支持负数）
- 使用 `Number.EPSILON` 降低浮点误差影响

```ts
import { toFixed } from 'postcss-plugin-shared'

toFixed(1.005, 2) // 1.01
toFixed(0, 5) // 0
```

### `remRegex` / `pxRegex`

用于 `String.prototype.replace` 的全局正则，匹配目标单位，并尽量避免误替换：

- 排除双引号字符串 `"..."`、单引号字符串 `'...'`
- 排除 `url(...)`
- 排除 `var(...)`
- 捕获组 1 为数值部分（例如 `1.25`）

### `blacklistedSelector(blacklist, selector?)`

判断当前 `selector` 是否命中黑名单：

- `blacklist` 支持 `string | RegExp`
- `selector` 非字符串时返回 `false`

### `createPropListMatcher(propList)`

生成一个 `(prop: string) => boolean` 的匹配器，用于快速判断某个 CSS 属性是否需要处理。

### `createExcludeMatcher(exclude)`

生成一个 `(filepath?: string) => boolean` 的排除函数。

### `declarationExists(decls, prop, value)`

用于避免在同一个规则中生成重复声明（常用于 `replace: false` 时 `cloneAfter` 的去重判断）。
