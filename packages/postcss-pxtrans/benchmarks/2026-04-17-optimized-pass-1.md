# Benchmark Results

## postcss-pxtrans 1.0.1 - 2026-04-17 09:26:37.349 UTC

- Label: `2026-04-17-optimized-pass-1`
- Command: `pnpm -C packages/postcss-pxtrans exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-1.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/pxtrans.bench.ts > postcss-pxtrans benchmarks

Times are in milliseconds. `hz` is operations per second.

| name                 | hz       | min    | max    | mean   | p75    | p99    | p995   | p999   | rme      | samples |
| -------------------- | -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | -------- | ------- |
| pxtrans transform    | 921.15   | 0.8794 | 3.6366 | 1.0856 | 1.1185 | 2.2345 | 2.4935 | 3.6366 | +/-1.94% | 461     |
| pxtrans h5 transform | 801.59   | 0.9608 | 7.9019 | 1.2475 | 1.2562 | 2.5476 | 2.9032 | 7.9019 | +/-3.45% | 401     |
| pxtrans directives   | 1,735.41 | 0.4653 | 2.0318 | 0.5762 | 0.5830 | 0.9661 | 1.0660 | 2.0318 | +/-1.23% | 868     |
