import postcss from 'postcss'
import { bench, describe } from 'vitest'

import remToVw from '@/index'

const processor = postcss(remToVw())

function makeRules(count: number) {
  const rules: string[] = []
  for (let i = 0; i < count; i += 1) {
    rules.push(
      `.rule-${i} { font-size: 1rem; margin: ${i % 4}rem; padding: ${i % 3}rem; letter-spacing: 0.0625rem; }`,
    )
  }
  return rules.join('\n')
}

const smallCSS = makeRules(10)
const mediumCSS = makeRules(200)
const largeCSS = makeRules(2000)

describe('postcss-rem-to-viewport benchmark', () => {
  bench('small stylesheet', async () => {
    await processor.process(smallCSS, { from: 'small.css' })
  })

  bench('medium stylesheet', async () => {
    await processor.process(mediumCSS, { from: 'medium.css' })
  })

  bench('large stylesheet', async () => {
    await processor.process(largeCSS, { from: 'large.css' })
  })
})
