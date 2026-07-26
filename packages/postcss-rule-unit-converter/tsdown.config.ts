import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
      presets: './src/presets.ts',
    },
    format: ['esm'],
    dts: true,
    clean: true,
    target: 'node18',
    failOnWarn: false,
  },
  {
    entry: {
      'index.require': './src/index-require.cts',
    },
    format: ['cjs'],
    dts: true,
    clean: false,
    target: 'node18',
    failOnWarn: false,
  },
  {
    entry: {
      presets: './src/presets.ts',
    },
    format: ['cjs'],
    dts: true,
    clean: false,
    target: 'node18',
    failOnWarn: false,
  },
])
