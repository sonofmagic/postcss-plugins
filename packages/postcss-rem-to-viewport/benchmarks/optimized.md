# Benchmark Results (optimized)

## postcss-rem-to-viewport 1.0.3 - 2025-12-18 07:56:53 UTC

- Command: `pnpm -C packages/postcss-rem-to-viewport exec vitest bench --outputJson benchmarks/refactor.json`
- Node: `v22.21.1`
- pnpm: `10.26.0`
- Vitest: `~4.0.16`

## Comparison with benchmarks/1.0.3.md

Times are in milliseconds. `hz` is operations per second. Δ is relative improvement vs. the 1.0.3 report (positive means faster).

| name              | hz (1.0.3) | hz (optimized) | Δ hz     | mean (1.0.3) | mean (optimized) | Δ mean  |
| ----------------- | ---------- | -------------- | -------- | ------------ | ---------------- | ------- |
| small stylesheet  | 2,175.98   | 11,611.89      | +433.64% | 0.4596       | 0.0861           | -81.26% |
| medium stylesheet | 315.94     | 906.81         | +187.02% | 3.1652       | 1.1028           | -65.16% |
| large stylesheet  | 22.0505    | 60.7724        | +175.61% | 45.3505      | 16.4548          | -63.72% |
