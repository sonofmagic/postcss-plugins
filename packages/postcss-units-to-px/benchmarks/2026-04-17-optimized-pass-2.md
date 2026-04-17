# Benchmark Results

## postcss-units-to-px 0.2.0 - 2026-04-17 09:35:46.529 UTC

- Label: `2026-04-17-optimized-pass-2`
- Command: `pnpm -C packages/postcss-units-to-px exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-2.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/units-to-px.bench.ts > postcss-units-to-px benchmark

Times are in milliseconds. `hz` is operations per second.

| name                            | hz       | min    | max    | mean   | p75    | p99    | p995   | p999   | rme      | samples |
| ------------------------------- | -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | -------- | ------- |
| default rules medium stylesheet | 1,302.92 | 0.6104 | 4.5122 | 0.7675 | 0.7627 | 1.7479 | 1.7693 | 4.5122 | +/-2.11% | 652     |
| default rules large stylesheet  | 151.95   | 5.9438 | 8.6919 | 6.5810 | 6.6919 | 8.6919 | 8.6919 | 8.6919 | +/-1.51% | 76      |
| propList=\* with media queries  | 1,164.27 | 0.6920 | 4.7148 | 0.8589 | 0.8448 | 1.9159 | 2.0700 | 4.7148 | +/-2.25% | 583     |
