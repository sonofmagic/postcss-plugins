# Benchmark Results

## postcss-rem-to-viewport 2.0.1 - 2026-04-17 09:35:46.529 UTC

- Label: `2026-04-17-optimized-pass-2`
- Command: `pnpm -C packages/postcss-rem-to-viewport exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-2.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/rem-to-viewport.bench.ts > postcss-rem-to-viewport benchmark

Times are in milliseconds. `hz` is operations per second.

| name                                 | hz        | min    | max     | mean   | p75    | p99     | p995    | p999    | rme      | samples |
| ------------------------------------ | --------- | ------ | ------- | ------ | ------ | ------- | ------- | ------- | -------- | ------- |
| small stylesheet                     | 33,235.12 | 0.0229 | 0.5663  | 0.0301 | 0.0293 | 0.0889  | 0.1100  | 0.1483  | +/-0.62% | 16618   |
| medium stylesheet                    | 1,825.99  | 0.4418 | 1.4997  | 0.5476 | 0.5560 | 0.8252  | 0.8782  | 1.4997  | +/-0.91% | 913     |
| large stylesheet                     | 143.87    | 5.6410 | 17.2667 | 6.9506 | 6.9675 | 17.2667 | 17.2667 | 17.2667 | +/-6.23% | 72      |
| medium stylesheet with media queries | 1,418.52  | 0.5849 | 2.1093  | 0.7050 | 0.7180 | 0.9727  | 1.0320  | 2.1093  | +/-0.90% | 710     |
