# Benchmark Results

## 2025-12-18 00:09:01 CST

- Command: `pnpm -C packages/postcss-rem-to-viewport exec vitest bench`
- Node: `v22.20.0`
- pnpm: `10.26.0`
- Vitest: `4.0.16`

### postcss-rem-to-viewport benchmark

Times are in milliseconds. `hz` is operations per second.

| name              | hz        | min    | max     | mean   | p75    | p99     | p995    | p999    | rme      | samples |
| ----------------- | --------- | ------ | ------- | ------ | ------ | ------- | ------- | ------- | -------- | ------- |
| small stylesheet  | 36,940.86 | 0.0232 | 0.8872  | 0.0271 | 0.0270 | 0.0816  | 0.0901  | 0.1394  | +/-0.62% | 18,471  |
| medium stylesheet | 1,950.29  | 0.4670 | 0.8429  | 0.5127 | 0.5129 | 0.7166  | 0.7303  | 0.8429  | +/-0.73% | 976     |
| large stylesheet  | 135.64    | 6.0115 | 11.5863 | 7.3722 | 7.8309 | 11.5863 | 11.5863 | 11.5863 | +/-3.83% | 68      |

Summary:

- small stylesheet: 18.94x faster than medium stylesheet
- small stylesheet: 272.34x faster than large stylesheet
