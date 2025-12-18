# postcss-plugins

A PostCSS plugin monorepo focused on unit conversion and responsive styling utilities. This repo hosts multiple plugins plus shared utilities used across them.

## Packages

- [postcss-plugin-shared](packages/postcss-plugin-shared) - Shared utilities for option merging, prop matching, regex helpers, and more.
- [postcss-rem-to-responsive-pixel](packages/postcss-rem-to-responsive-pixel) - Convert `rem` to `px` or `rpx`.
- [postcss-rem-to-viewport](packages/postcss-rem-to-viewport) - Convert `rem` to viewport units (`vw` and others).
- [postcss-pxtrans](packages/postcss-pxtrans) - Convert `px` to `rpx/rem/vw/px` with platform presets and directive comments.

Each package has its own README with usage and configuration details.

## Requirements

- Node.js >= 20
- pnpm (workspace managed)

## Development

```bash
pnpm install
pnpm dev
```

Useful scripts:

- `pnpm build` - build all packages
- `pnpm lint` - lint all packages
- `pnpm test` - run tests with coverage

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Contributors

Thanks to [all contributors](https://github.com/sonofmagic/postcss-plugins/graphs/contributors)!

## Authors

ice breaker <1324318532@qq.com>

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
