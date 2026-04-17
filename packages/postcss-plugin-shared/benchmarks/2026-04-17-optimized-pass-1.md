# Benchmark Results

## postcss-plugin-shared 1.1.1 - 2026-04-17 09:26:37.349 UTC

- Label: `2026-04-17-optimized-pass-1`
- Command: `pnpm -C packages/postcss-plugin-shared exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-1.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/shared.bench.ts > postcss-plugin-shared benchmarks

Times are in milliseconds. `hz` is operations per second.

| name                  | hz            | min    | max    | mean   | p75    | p99    | p995   | p999   | rme      | samples  |
| --------------------- | ------------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | -------- | -------- |
| toFixed               | 35,915,443.77 | 0.0000 | 0.1978 | 0.0000 | 0.0000 | 0.0000 | 0.0001 | 0.0001 | +/-0.19% | 17957723 |
| mergeOptions          | 10,509,720.74 | 0.0000 | 7.0334 | 0.0001 | 0.0001 | 0.0002 | 0.0002 | 0.0004 | +/-2.78% | 5254861  |
| declarationExists     | 30,421,318.36 | 0.0000 | 0.2599 | 0.0000 | 0.0000 | 0.0000 | 0.0001 | 0.0001 | +/-0.21% | 15210660 |
| remRegex replace      | 4,854,677.31  | 0.0001 | 0.7433 | 0.0002 | 0.0002 | 0.0003 | 0.0003 | 0.0007 | +/-0.68% | 2427339  |
| pxRegex replace       | 5,334,682.67  | 0.0001 | 5.7943 | 0.0002 | 0.0002 | 0.0003 | 0.0003 | 0.0006 | +/-2.31% | 2667342  |
| blacklistedSelector   | 15,277,902.96 | 0.0000 | 1.9314 | 0.0001 | 0.0001 | 0.0001 | 0.0002 | 0.0004 | +/-0.91% | 7638952  |
| createPropListMatcher | 18,773,170.57 | 0.0000 | 0.3478 | 0.0001 | 0.0000 | 0.0001 | 0.0001 | 0.0003 | +/-0.66% | 9386586  |
| createExcludeMatcher  | 34,603,015.03 | 0.0000 | 9.6071 | 0.0000 | 0.0000 | 0.0000 | 0.0001 | 0.0002 | +/-3.78% | 17301508 |
