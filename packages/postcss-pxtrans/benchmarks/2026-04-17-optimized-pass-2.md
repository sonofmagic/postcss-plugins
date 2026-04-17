# Benchmark Results

## postcss-pxtrans 1.0.1 - 2026-04-17 09:35:46.529 UTC

- Label: `2026-04-17-optimized-pass-2`
- Command: `pnpm -C packages/postcss-pxtrans exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-2.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/pxtrans.bench.ts > postcss-pxtrans benchmarks

Times are in milliseconds. `hz` is operations per second.

| name                 | hz       | min    | max    | mean   | p75    | p99    | p995   | p999   | rme      | samples |
| -------------------- | -------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | -------- | ------- |
| pxtrans transform    | 949.30   | 0.8771 | 2.9585 | 1.0534 | 1.0833 | 1.4378 | 2.2812 | 2.9585 | +/-1.41% | 475     |
| pxtrans h5 transform | 869.76   | 0.9620 | 4.5240 | 1.1497 | 1.1746 | 2.6964 | 2.7738 | 4.5240 | +/-2.06% | 435     |
| pxtrans directives   | 1,660.28 | 0.4762 | 5.3075 | 0.6023 | 0.5873 | 1.4582 | 1.5628 | 5.3075 | +/-2.58% | 831     |
