# postcss-rem-to-viewport

## 2.0.0

### Major Changes

- [`26db775`](https://github.com/sonofmagic/postcss-plugins/commit/26db775b55182c26b1432ac2ccc66fcbc4e2d37f) Thanks [@sonofmagic](https://github.com/sonofmagic)! - 性能优化：预计算 rem->viewport 换算因子，减少每个声明的重复计算；缓存选择器黑名单匹配结果并增加早退逻辑。基准测试相对 1.0.3（small/medium/large）约提升 5.34x / 2.87x / 2.76x。

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
