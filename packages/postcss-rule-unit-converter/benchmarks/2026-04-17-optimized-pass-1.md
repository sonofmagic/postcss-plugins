# Benchmark Results

## postcss-rule-unit-converter 0.1.0 - 2026-04-17 09:26:37.349 UTC

- Label: `2026-04-17-optimized-pass-1`
- Command: `pnpm -C packages/postcss-rule-unit-converter exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-1.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/index.bench.ts > postcss-rule-unit-converter benchmark

Times are in milliseconds. `hz` is operations per second.

| name                           | hz       | min    | max     | mean   | p75    | p99     | p995    | p999    | rme      | samples |
| ------------------------------ | -------- | ------ | ------- | ------ | ------ | ------- | ------- | ------- | -------- | ------- |
| mixed rules medium stylesheet  | 1,241.18 | 0.6802 | 1.9565  | 0.8057 | 0.8271 | 1.1242  | 1.1720  | 1.9565  | +/-1.01% | 621     |
| mixed rules large stylesheet   | 126.69   | 6.7980 | 14.5344 | 7.8935 | 8.0598 | 14.5344 | 14.5344 | 14.5344 | +/-4.08% | 64      |
| preset group medium stylesheet | 1,342.76 | 0.6072 | 1.2306  | 0.7447 | 0.7626 | 1.0535  | 1.0853  | 1.2306  | +/-0.82% | 672     |
