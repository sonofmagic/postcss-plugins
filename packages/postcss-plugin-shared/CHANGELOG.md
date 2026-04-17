# postcss-plugin-shared

## 1.1.2

### Patch Changes

- 🐛 **Migrate package TypeScript config for TypeScript 6 compatibility and remove legacy type resolution config.** [`beca84b`](https://github.com/sonofmagic/postcss-plugins/commit/beca84b55e2bacffb2b6f1ee675354a7bf0791a5) by @sonofmagic

## 1.1.1

### Patch Changes

- 🐛 **Remove the postcss-plugin keyword from the shared utilities package metadata.** [`d756dd5`](https://github.com/sonofmagic/postcss-plugins/commit/d756dd504a87136d706bd43cbff7a5f21b5a86bc) by @sonofmagic
  - [#38](https://github.com/sonofmagic/postcss-plugins/issues/38)

## 1.1.0

### Minor Changes

- ✨ **Add shared walk/blacklist helpers, refactor unit conversion plugins to use them, and introduce the new postcss-units-to-px package.** [`01a19b2`](https://github.com/sonofmagic/postcss-plugins/commit/01a19b27a75ae4835ffc2eb533d381e72ac70655) by @sonofmagic

### Patch Changes

- 🐛 **chore: align type exports and improve public JSDoc** [`08dfed0`](https://github.com/sonofmagic/postcss-plugins/commit/08dfed04a234e4fe023f2ca2cf2390ce51cb4cfc) by @sonofmagic

## 1.0.0

### Major Changes

- [`92f38a5`](https://github.com/sonofmagic/postcss-plugins/commit/92f38a57fe8a4026791772483618df15ce6de343) Thanks [@sonofmagic](https://github.com/sonofmagic)! - 提炼并统一多个插件的公共能力到 `postcss-plugin-shared`：

  - 新增 `createUnitRegex`（可配置单位/跳过规则）并用其生成默认的 `pxRegex`/`remRegex`
  - 新增 `createAdvancedPropListMatcher` 支持 pxtrans 的高级 `propList` 语法（包含/排除、前后缀、contains）
  - 新增 `maybeBlacklistedSelector`（非字符串 selector 返回 `undefined`）
  - 新增 `createConfigGetter` 用于构建 `getConfig`（基于 `mergeOptions`，数组覆盖而非合并）

### Patch Changes

- [`a93567c`](https://github.com/sonofmagic/postcss-plugins/commit/a93567cbc9e1faeee15408a5c2c087d797bcfe61) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Extract common utilities into `postcss-plugin-shared` and refactor related plugins to reuse them.
