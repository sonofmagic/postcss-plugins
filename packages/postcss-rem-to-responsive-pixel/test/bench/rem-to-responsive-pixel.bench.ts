import postcss from 'postcss'
import { bench, describe } from 'vitest'
import remToPx from '@/index'

const sampleCss = `
.page { font-size: 1rem; margin: 0.5rem 1rem; line-height: 1.2; letter-spacing: 0.0625rem; }
.btn { padding: 0.75rem 1rem; border-radius: 0.25rem; }
.input { padding: 0.625rem; font-size: 0.875rem; }
@media (min-width: 31.25rem) {
  .card { padding: 1rem 1.5rem; margin: 2rem; }
  .modal { width: 20rem; height: 10rem; }
}
`.repeat(20)

const defaultProcessor = postcss(remToPx({ propList: ['*'] }))
const mediaProcessor = postcss(remToPx({ propList: ['*'], mediaQuery: true }))

describe('rem-to-responsive-pixel bench', () => {
  bench('default transform (propList=*)', () => {
    void defaultProcessor.process(sampleCss, { from: 'bench.css' }).css
  })

  bench('media queries enabled', () => {
    void mediaProcessor.process(sampleCss, { from: 'bench.css' }).css
  })
})
