# postcss-plugin-shared

## 1.0.0

### Major Changes

- [`92f38a5`](https://github.com/sonofmagic/postcss-plugins/commit/92f38a57fe8a4026791772483618df15ce6de343) Thanks [@sonofmagic](https://github.com/sonofmagic)! - 提炼并统一多个插件的公共能力到 `postcss-plugin-shared`：

  - 新增 `createUnitRegex`（可配置单位/跳过规则）并用其生成默认的 `pxRegex`/`remRegex`
  - 新增 `createAdvancedPropListMatcher` 支持 pxtrans 的高级 `propList` 语法（包含/排除、前后缀、contains）
  - 新增 `maybeBlacklistedSelector`（非字符串 selector 返回 `undefined`）
  - 新增 `createConfigGetter` 用于构建 `getConfig`（基于 `mergeOptions`，数组覆盖而非合并）

### Patch Changes

- [`a93567c`](https://github.com/sonofmagic/postcss-plugins/commit/a93567cbc9e1faeee15408a5c2c087d797bcfe61) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Extract common utilities into `postcss-plugin-shared` and refactor related plugins to reuse them.
