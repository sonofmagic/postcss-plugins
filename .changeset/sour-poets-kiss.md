---
"postcss-plugin-shared": patch
---

修复替换模式因已有目标值而跳过单位转换的问题，保留声明顺序与优先级；重复检测仅阻止 replace:false 时插入已有结果。
