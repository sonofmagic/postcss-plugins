---
'postcss-pxtrans': major
---

优化 pxtrans 性能：缓存默认 rootValue 计算、复用正则与选择器黑名单匹配结果，减少每次声明的重复开销，并记录新的基准数据。
