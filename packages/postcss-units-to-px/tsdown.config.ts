import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
      defaults: './src/defaults-entry.ts',
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
      defaults: './src/defaults-entry.ts',
    },
    format: ['cjs'],
    dts: true,
    clean: false,
    target: 'node18',
    failOnWarn: false,
  },
])
