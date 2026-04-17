import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    presets: './src/presets.ts',
  },
  format: ['esm', 'cjs'],
  cjsDefault: false,
  dts: true,
  clean: true,
  target: 'node18',
  failOnWarn: false,
})
