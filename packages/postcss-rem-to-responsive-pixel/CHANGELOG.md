# postcss-rem-to-responsive-pixel

## 7.0.1

### Patch Changes

- 🐛 **Add shared walk/blacklist helpers, refactor unit conversion plugins to use them, and introduce the new postcss-units-to-px package.** [`01a19b2`](https://github.com/sonofmagic/postcss-plugins/commit/01a19b27a75ae4835ffc2eb533d381e72ac70655) by @sonofmagic

- 🐛 **chore: align type exports and improve public JSDoc** [`08dfed0`](https://github.com/sonofmagic/postcss-plugins/commit/08dfed04a234e4fe023f2ca2cf2390ce51cb4cfc) by @sonofmagic
- 📦 **Dependencies** [`01a19b2`](https://github.com/sonofmagic/postcss-plugins/commit/01a19b27a75ae4835ffc2eb533d381e72ac70655)
  → `postcss-plugin-shared@1.1.0`

## 7.0.0

### Major Changes

- [`1ed5950`](https://github.com/sonofmagic/postcss-plugins/commit/1ed59505576d33df798a0f3100e3d56c4cfb2cb2) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Improve rem-to-responsive-pixel performance by reducing unnecessary work during declaration and media query processing.

### Patch Changes

- [`a93567c`](https://github.com/sonofmagic/postcss-plugins/commit/a93567cbc9e1faeee15408a5c2c087d797bcfe61) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Extract common utilities into `postcss-plugin-shared` and refactor related plugins to reuse them.

- [`92f38a5`](https://github.com/sonofmagic/postcss-plugins/commit/92f38a57fe8a4026791772483618df15ce6de343) Thanks [@sonofmagic](https://github.com/sonofmagic)! - 提炼并统一多个插件的公共能力到 `postcss-plugin-shared`：

  - 新增 `createUnitRegex`（可配置单位/跳过规则）并用其生成默认的 `pxRegex`/`remRegex`
  - 新增 `createAdvancedPropListMatcher` 支持 pxtrans 的高级 `propList` 语法（包含/排除、前后缀、contains）
  - 新增 `maybeBlacklistedSelector`（非字符串 selector 返回 `undefined`）
  - 新增 `createConfigGetter` 用于构建 `getConfig`（基于 `mergeOptions`，数组覆盖而非合并）

- [`ad0db2b`](https://github.com/sonofmagic/postcss-plugins/commit/ad0db2bec1d5b0247288c692208ad230c2b81629) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Use strict half-up rounding for numeric conversions to avoid floating-point edge cases.

- Updated dependencies [[`a93567c`](https://github.com/sonofmagic/postcss-plugins/commit/a93567cbc9e1faeee15408a5c2c087d797bcfe61), [`92f38a5`](https://github.com/sonofmagic/postcss-plugins/commit/92f38a57fe8a4026791772483618df15ce6de343)]:
  - postcss-plugin-shared@1.0.0

## 6.1.0

### Minor Changes

- [`7928d17`](https://github.com/sonofmagic/postcss-plugins/commit/7928d17c40106556edb8bd8444dd65f7f65fd3f4) Thanks [@sonofmagic](https://github.com/sonofmagic)! - feat: add processorStage option
