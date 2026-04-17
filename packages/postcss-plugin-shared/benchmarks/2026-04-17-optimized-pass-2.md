# Benchmark Results

## postcss-plugin-shared 1.1.1 - 2026-04-17 09:35:46.529 UTC

- Label: `2026-04-17-optimized-pass-2`
- Command: `pnpm -C packages/postcss-plugin-shared exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-2.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/shared.bench.ts > postcss-plugin-shared benchmarks

Times are in milliseconds. `hz` is operations per second.

| name                  | hz            | min    | max     | mean   | p75    | p99    | p995   | p999   | rme      | samples  |
| --------------------- | ------------- | ------ | ------- | ------ | ------ | ------ | ------ | ------ | -------- | -------- |
| toFixed               | 35,170,513.33 | 0.0000 | 0.1809  | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0001 | +/-0.21% | 17585258 |
| mergeOptions          | 10,680,212.29 | 0.0000 | 5.8068  | 0.0001 | 0.0001 | 0.0001 | 0.0002 | 0.0004 | +/-2.30% | 5340107  |
| declarationExists     | 30,557,723.02 | 0.0000 | 11.1481 | 0.0000 | 0.0000 | 0.0000 | 0.0001 | 0.0001 | +/-4.43% | 15278862 |
| remRegex replace      | 5,035,537.24  | 0.0001 | 0.2516  | 0.0002 | 0.0002 | 0.0003 | 0.0003 | 0.0006 | +/-0.41% | 2517769  |
| pxRegex replace       | 5,477,392.24  | 0.0001 | 1.5731  | 0.0002 | 0.0002 | 0.0003 | 0.0003 | 0.0007 | +/-0.65% | 2738697  |
| blacklistedSelector   | 15,529,797.81 | 0.0000 | 0.3463  | 0.0001 | 0.0001 | 0.0001 | 0.0001 | 0.0003 | +/-0.46% | 7764899  |
| createPropListMatcher | 18,891,465.02 | 0.0000 | 0.2856  | 0.0001 | 0.0000 | 0.0001 | 0.0001 | 0.0003 | +/-0.60% | 9445733  |
| createExcludeMatcher  | 34,606,194.06 | 0.0000 | 9.3692  | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0002 | +/-3.68% | 17303098 |
