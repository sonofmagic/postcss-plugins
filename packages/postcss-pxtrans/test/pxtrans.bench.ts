import postcss from 'postcss'
import { bench, describe } from 'vitest'

import pxtrans, { createDirectivePlugin } from '@/index'

function makeRules(count: number) {
  const rules: string[] = []
  for (let i = 0; i < count; i += 1) {
    rules.push(
      `.rule-${i} { font-size: ${12 + (i % 6)}px; margin: ${i % 8}px; padding: ${i % 5}px; }`,
    )
  }
  return rules.join('\n')
}

const baseCss = makeRules(400)
const directiveCss = `
/* #ifdef weapp */
${makeRules(200)}
/* #endif */
/* #ifndef weapp */
${makeRules(50)}
/* #endif */
`

const pxtransProcessor = postcss(pxtrans({ propList: ['*'] }))
const directiveProcessor = postcss(createDirectivePlugin({ platform: 'weapp' }))

describe('postcss-pxtrans benchmarks', () => {
  bench('pxtrans transform', () => {
    void pxtransProcessor.process(baseCss, { from: 'bench.css' }).css
  })

  bench('pxtrans directives', () => {
    void directiveProcessor.process(directiveCss, { from: 'bench.css' }).css
  })
})
