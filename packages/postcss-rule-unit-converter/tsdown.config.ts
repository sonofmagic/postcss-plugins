import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    presets: './src/presets.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  target: 'node18',
  failOnWarn: false,
})
