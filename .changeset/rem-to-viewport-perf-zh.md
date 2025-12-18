---
'postcss-rem-to-viewport': major
---

性能优化：预计算 rem->viewport 换算因子，减少每个声明的重复计算；缓存选择器黑名单匹配结果并增加早退逻辑。基准测试相对 1.0.3（small/medium/large）约提升 5.34x / 2.87x / 2.76x。
