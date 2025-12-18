---
"postcss-plugin-shared": major
"postcss-pxtrans": patch
"postcss-rem-to-viewport": patch
"postcss-rem-to-responsive-pixel": patch
---

提炼并统一多个插件的公共能力到 `postcss-plugin-shared`：

- 新增 `createUnitRegex`（可配置单位/跳过规则）并用其生成默认的 `pxRegex`/`remRegex`
- 新增 `createAdvancedPropListMatcher` 支持 pxtrans 的高级 `propList` 语法（包含/排除、前后缀、contains）
- 新增 `maybeBlacklistedSelector`（非字符串 selector 返回 `undefined`）
- 新增 `createConfigGetter` 用于构建 `getConfig`（基于 `mergeOptions`，数组覆盖而非合并）

