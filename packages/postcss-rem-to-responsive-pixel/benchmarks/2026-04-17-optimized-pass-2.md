# Benchmark Results

## postcss-rem-to-responsive-pixel 7.0.1 - 2026-04-17 09:35:46.529 UTC

- Label: `2026-04-17-optimized-pass-2`
- Command: `pnpm -C packages/postcss-rem-to-responsive-pixel exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-2.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/bench/rem-to-responsive-pixel.bench.ts > rem-to-responsive-pixel bench

Times are in milliseconds. `hz` is operations per second.

| name                            | hz       | min    | max    | mean   | p75    | p99    | p995   | p999   | rme      | samples |
| ------------------------------- | -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | -------- | ------- |
| default transform (propList=\*) | 3,823.15 | 0.2083 | 3.9837 | 0.2616 | 0.2563 | 0.6214 | 0.6718 | 0.8592 | +/-1.82% | 1912    |
| media queries enabled           | 3,678.19 | 0.2255 | 0.8835 | 0.2719 | 0.2740 | 0.4468 | 0.4971 | 0.5823 | +/-0.68% | 1840    |
| rpx transform large stylesheet  | 455.55   | 1.9111 | 3.5003 | 2.1952 | 2.2481 | 2.6751 | 2.9510 | 3.5003 | +/-1.08% | 228     |
