import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // , 'src/cli.ts'],
  shims: true,
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
  outExtension(ctx) {
    return {
      js: `.${ctx.format === 'cjs' ? 'cjs' : 'mjs'}`,
    }
  },
  // https://github.com/egoist/tsup/pull/1056
  // https://github.com/egoist/tsup/issues?q=cjsInterop
  cjsInterop: true,
  splitting: true,
})
