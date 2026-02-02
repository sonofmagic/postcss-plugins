import postcss from 'postcss'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import unitsToPx from '../src/plugin'

let replaceResult: string | undefined

vi.mock('../src/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/shared')>()
  return {
    ...actual,
    walkAndReplaceValues: (options: any) => {
      const input = options.root?.source?.input
      if (!input) {
        return
      }
      const replacer = options.createReplacer({ root: options.root, input })
      replaceResult = replacer('NaNrem', 'NaN')
    },
  }
})

describe('postcss-units-to-px internal branches', () => {
  beforeEach(() => {
    replaceResult = undefined
  })

  it('keeps original value when number parsing yields NaN', () => {
    const input = '.rule { font-size: 1rem; }'
    void postcss(unitsToPx()).process(input).css

    expect(replaceResult).toBe('NaNrem')
  })
})
