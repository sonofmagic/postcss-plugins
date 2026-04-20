---
'postcss-pxtrans': patch
'postcss-rem-to-viewport': patch
'postcss-plugin-shared': patch
'postcss-rem-to-responsive-pixel': patch
'postcss-rule-unit-converter': patch
'postcss-units-to-px': patch
---

Improve `propList` exclusion matching so negated entries are easier to use in
real-world configs.

For `createPropListMatcher`-based packages and `postcss-rem-to-responsive-pixel`,
negated string entries now support:

- exact exclusions like `!font-size`
- glob exclusions like `!padding*`
- arbitrary-position glob exclusions like `!--wot-*-font-size`

Also align `createAdvancedPropListMatcher` with the same glob behavior for
strings containing `*`, which also affects `postcss-pxtrans`.
