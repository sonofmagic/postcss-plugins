import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)

const postcss = require('postcss')

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))

const cases = [
  {
    name: 'postcss-pxtrans',
    entry: 'packages/postcss-pxtrans/dist/index.require.cjs',
    create: plugin => plugin(),
    input: '.a{margin:1px}',
    output: '.a{margin:1rpx}',
  },
  {
    name: 'postcss-rem-to-responsive-pixel',
    entry: 'packages/postcss-rem-to-responsive-pixel/dist/index.require.cjs',
    create: plugin => plugin(),
    input: '.a{font-size:1rem}',
    output: '.a{font-size:16px}',
  },
  {
    name: 'postcss-rem-to-viewport',
    entry: 'packages/postcss-rem-to-viewport/dist/index.require.cjs',
    create: plugin => plugin(),
    input: '.a{font-size:1rem}',
    output: '.a{font-size:4.266666666666667vw}',
  },
  {
    name: 'postcss-rule-unit-converter',
    entry: 'packages/postcss-rule-unit-converter/dist/index.require.cjs',
    create: plugin => plugin({ rules: [{ from: 'rem', to: 'px', factor: 16 }] }),
    input: '.a{margin:1rem}',
    output: '.a{margin:16px}',
    verify(plugin) {
      assert.equal(typeof plugin.composeRules, 'function')
      assert.equal(typeof plugin.presets, 'object')
    },
  },
  {
    name: 'postcss-units-to-px',
    entry: 'packages/postcss-units-to-px/dist/index.require.cjs',
    create: plugin => plugin(),
    input: '.a{margin:1rem}',
    output: '.a{margin:16px}',
  },
]

for (const item of cases) {
  const plugin = require(resolve(root, item.entry))
  assert.equal(typeof plugin, 'function', `${item.name} CJS entry must be callable`)
  assert.equal(plugin.default, plugin, `${item.name} default must point to the callable entry`)
  item.verify?.(plugin)

  const result = await postcss([item.create(plugin)]).process(item.input, { from: undefined })
  assert.equal(result.css, item.output, `${item.name} CJS plugin output changed`)
  console.log(`${item.name}: ${result.css}`)
}
