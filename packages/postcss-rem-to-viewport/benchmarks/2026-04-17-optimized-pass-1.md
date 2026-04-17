# Benchmark Results

## postcss-rem-to-viewport 2.0.1 - 2026-04-17 09:26:37.349 UTC

- Label: `2026-04-17-optimized-pass-1`
- Command: `pnpm -C packages/postcss-rem-to-viewport exec vitest bench --outputJson benchmarks/2026-04-17-optimized-pass-1.json`
- Node: `v24.14.1`
- pnpm: `10.33.0`
- Vitest: `~4.1.4`
- CPU: `Apple M4 Max`

### test/rem-to-viewport.bench.ts > postcss-rem-to-viewport benchmark

Times are in milliseconds. `hz` is operations per second.

| name                                 | hz        | min    | max     | mean   | p75    | p99     | p995    | p999    | rme      | samples |
| ------------------------------------ | --------- | ------ | ------- | ------ | ------ | ------- | ------- | ------- | -------- | ------- |
| small stylesheet                     | 35,446.00 | 0.0226 | 0.5498  | 0.0282 | 0.0275 | 0.0750  | 0.0923  | 0.1494  | +/-0.55% | 17728   |
| medium stylesheet                    | 1,796.12  | 0.4521 | 1.7770  | 0.5568 | 0.5597 | 0.8787  | 1.0388  | 1.7770  | +/-1.07% | 899     |
| large stylesheet                     | 146.38    | 6.0305 | 13.9633 | 6.8316 | 6.9478 | 13.9633 | 13.9633 | 13.9633 | +/-3.51% | 74      |
| medium stylesheet with media queries | 1,399.52  | 0.5918 | 2.4205  | 0.7145 | 0.7194 | 1.0604  | 1.3980  | 2.4205  | +/-1.24% | 700     |
