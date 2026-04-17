# Benchmark Results

## postcss-rem-to-responsive-pixel 7.0.1 - 2026-04-17 09:26:37.349 UTC

- Label: `2026-04-17-optimized-pass-1`
- Command: `pnpm -C packages/postcss-rem-to-responsive-pixel exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-1.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/bench/rem-to-responsive-pixel.bench.ts > rem-to-responsive-pixel bench

Times are in milliseconds. `hz` is operations per second.

| name                            | hz       | min    | max    | mean   | p75    | p99    | p995   | p999   | rme      | samples |
| ------------------------------- | -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | -------- | ------- |
| default transform (propList=\*) | 3,761.95 | 0.2141 | 1.4941 | 0.2658 | 0.2665 | 0.4669 | 0.4902 | 1.0608 | +/-0.93% | 1881    |
| media queries enabled           | 3,551.58 | 0.2315 | 1.0194 | 0.2816 | 0.2825 | 0.4680 | 0.5222 | 0.9973 | +/-0.84% | 1776    |
| rpx transform large stylesheet  | 444.49   | 1.8730 | 4.1882 | 2.2498 | 2.3147 | 3.0370 | 3.1250 | 4.1882 | +/-1.42% | 223     |
