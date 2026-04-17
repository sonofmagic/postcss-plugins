# Benchmark Results

## postcss-rule-unit-converter 0.1.0 - 2026-04-17 09:35:46.529 UTC

- Label: `2026-04-17-optimized-pass-2`
- Command: `pnpm -C packages/postcss-rule-unit-converter exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-2.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/index.bench.ts > postcss-rule-unit-converter benchmark

Times are in milliseconds. `hz` is operations per second.

| name                           | hz       | min    | max    | mean   | p75    | p99    | p995   | p999   | rme      | samples |
| ------------------------------ | -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | -------- | ------- |
| mixed rules medium stylesheet  | 1,262.47 | 0.6566 | 2.7306 | 0.7921 | 0.7906 | 1.6183 | 2.0804 | 2.7306 | +/-1.67% | 632     |
| mixed rules large stylesheet   | 140.46   | 6.4503 | 9.8096 | 7.1193 | 7.2377 | 9.8096 | 9.8096 | 9.8096 | +/-1.72% | 71      |
| preset group medium stylesheet | 1,429.72 | 0.5977 | 1.3882 | 0.6994 | 0.7065 | 0.9651 | 1.0270 | 1.3882 | +/-0.71% | 715     |
