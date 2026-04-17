# Benchmark Results

## postcss-units-to-px 0.2.0 - 2026-04-17 09:26:37.349 UTC

- Label: `2026-04-17-optimized-pass-1`
- Command: `pnpm -C packages/postcss-units-to-px exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-1.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/units-to-px.bench.ts > postcss-units-to-px benchmark

Times are in milliseconds. `hz` is operations per second.

| name                            | hz       | min    | max     | mean   | p75    | p99     | p995    | p999    | rme      | samples |
| ------------------------------- | -------- | ------ | ------- | ------ | ------ | ------- | ------- | ------- | -------- | ------- |
| default rules medium stylesheet | 1,059.52 | 0.7016 | 6.0732  | 0.9438 | 0.8771 | 4.1849  | 4.7845  | 6.0732  | +/-4.86% | 530     |
| default rules large stylesheet  | 103.26   | 7.4460 | 20.4443 | 9.6846 | 9.5693 | 20.4443 | 20.4443 | 20.4443 | +/-8.19% | 52      |
| propList=\* with media queries  | 982.76   | 0.8069 | 7.6603  | 1.0175 | 0.9861 | 2.4143  | 2.8053  | 7.6603  | +/-3.63% | 492     |
