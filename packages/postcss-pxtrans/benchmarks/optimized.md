# Benchmark Results (optimized)

- Command: `pnpm -C packages/postcss-pxtrans exec vitest bench --outputJson benchmarks/optimized.json`
- Node: `v22.21.1`
- pnpm: `10.26.0`
- Vitest: `~4.0.16`

## Comparison with benchmarks/0.0.0.md

Times are in milliseconds. `hz` is operations per second. Δ is relative improvement vs. the 0.0.0 report (positive means faster).

| name               | hz (0.0.0) | hz (optimized) | Δ hz    | mean (0.0.0) | mean (optimized) | Δ mean  |
| ------------------ | ---------- | -------------- | ------- | ------------ | ---------------- | ------- |
| pxtrans transform  | 191.03     | 333.24         | +74.44% | 5.2347       | 3.0008           | -42.67% |
| pxtrans directives | 619.94     | 1083.15        | +74.72% | 1.6131       | 0.9232           | -42.77% |
