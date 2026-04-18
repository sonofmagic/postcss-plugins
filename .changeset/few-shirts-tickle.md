---
'postcss-plugin-shared': patch
'postcss-pxtrans': patch
'postcss-rem-to-responsive-pixel': patch
'postcss-rem-to-viewport': patch
---

Migrate package builds from `tsup` to `tsdown` and align generated ESM/CJS declaration outputs.

For `postcss-pxtrans`, add a dedicated CommonJS compatibility entry so existing `require('postcss-pxtrans')` usage keeps working alongside the new `tsdown` pipeline.
