import postcss from 'postcss'
import { describe, expect, it } from 'vitest'

import unitsToPx from '../src/plugin'

describe('postcss-units-to-px internal branches', () => {
  it('keeps original value for invalid numeric tokens', () => {
    const input = '.rule { font-size: NaNrem; margin: 1rem; }'
    const output = '.rule { font-size: NaNrem; margin: 16px; }'
    const processed = postcss(unitsToPx()).process(input).css

    expect(processed).toBe(output)
  })
})
