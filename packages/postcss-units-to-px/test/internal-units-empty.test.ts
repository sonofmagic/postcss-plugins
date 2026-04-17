import { describe, expect, it, vi } from 'vitest'

import unitsToPx from '../src/plugin'

vi.mock('../src/defaults', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/defaults')>()
  return {
    ...actual,
    defaultUnitMap: {},
    defaultOptions: {
      ...actual.defaultOptions,
      unitMap: {},
    },
  }
})

describe('postcss-units-to-px empty unit map', () => {
  it('returns a noop plugin when no units are configured', () => {
    const plugin = unitsToPx() as { postcssPlugin: string }

    expect(plugin.postcssPlugin).toBe('postcss-units-to-px')
    expect('Once' in plugin).toBe(false)
  })
})
