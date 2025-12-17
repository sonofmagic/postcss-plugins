import type { Rule } from 'postcss'
import postcss from 'postcss'

import { defaultOptions } from '@/defaults'
import { pxRegex, remRegex } from '@/regex'
import {
  blacklistedSelector,
  createExcludeMatcher,
  createPropListMatcher,
  createRemReplace,
  declarationExists,
  getConfig,
  toFixed,
} from '@/shared'

describe('getConfig', () => {
  it('returns defaults for empty input', () => {
    const config = getConfig()

    expect(config).toMatchObject(defaultOptions)
  })

  it('overrides arrays instead of merging', () => {
    const config = getConfig({
      propList: ['*'],
      selectorBlackList: ['.foo'],
      exclude: ['foo.css'],
    })

    expect(config.propList).toEqual(['*'])
    expect(config.selectorBlackList).toEqual(['.foo'])
    expect(config.exclude).toEqual(['foo.css'])
  })
})

describe('toFixed', () => {
  it('rounds using strict half-up rounding', () => {
    expect(toFixed(1.005, 2)).toBe(1.01)
  })

  it('handles zero values', () => {
    expect(toFixed(0, 4)).toBe(0)
  })
})

describe('createRemReplace', () => {
  it('keeps matches without numeric captures', () => {
    const replace = createRemReplace(375, 2, 0)
    const input = 'url(1rem.png) "1rem" var(--size) 1rem'
    const output = input.replace(remRegex, replace)

    expect(output).toBe('url(1rem.png) "1rem" var(--size) 4.27vw')
  })

  it('respects minRemValue', () => {
    const replace = createRemReplace(375, 2, 0.5)
    const input = '0.2rem 1rem'
    const output = input.replace(remRegex, replace)

    expect(output).toBe('0.2rem 4.27vw')
  })

  it('returns unitless zero when result is zero', () => {
    const replace = createRemReplace(375, 2, 0)
    const output = '0rem'.replace(remRegex, replace)

    expect(output).toBe('0')
  })
})

describe('declarationExists', () => {
  it('detects existing declarations', () => {
    const root = postcss.parse('.rule { font-size: 4vw; }')
    const rule = root.first as Rule

    expect(declarationExists(rule, 'font-size', '4vw')).toBe(true)
    expect(declarationExists(rule, 'margin', '0')).toBe(false)
  })
})

describe('blacklistedSelector', () => {
  it('returns undefined for non-string selectors', () => {
    expect(blacklistedSelector(['.foo'], undefined)).toBeUndefined()
  })

  it('matches string and regex entries', () => {
    expect(blacklistedSelector(['.foo'], '.foo.bar')).toBe(true)
    expect(blacklistedSelector([/^\.bar$/], '.bar')).toBeTruthy()
    expect(blacklistedSelector(['.baz'], '.bar')).toBe(false)
  })
})

describe('createPropListMatcher', () => {
  it('matches any property with wildcard', () => {
    const match = createPropListMatcher(['*'])

    expect(match('anything')).toBe(true)
  })

  it('matches string includes and regex entries', () => {
    const match = createPropListMatcher(['font', /^margin$/])

    expect(match('font-size')).toBe(true)
    expect(match('margin')).toBe(true)
    expect(match('padding')).toBe(false)
  })
})

describe('createExcludeMatcher', () => {
  it('returns false for undefined file paths', () => {
    const match = createExcludeMatcher(['node_modules'])

    expect(match(undefined as unknown as string)).toBe(false)
  })

  it('matches string and regex entries', () => {
    const match = createExcludeMatcher(['node_modules', /\.ignore\.css$/])

    expect(match('/app/node_modules/a.css')).toBe(true)
    expect(match('/app/foo.ignore.css')).toBe(true)
    expect(match('/app/src/a.css')).toBe(false)
  })

  it('supports function exclude handlers', () => {
    const match = createExcludeMatcher(filepath => filepath.endsWith('.skip.css'))

    expect(match('/app/a.skip.css')).toBe(true)
    expect(match('/app/a.css')).toBe(false)
  })
})

describe('pxRegex', () => {
  it('captures px values and skips quoted values', () => {
    const input = '1px "2px" url(3px.png)'
    const output = input.replace(pxRegex, (match, value) => {
      return value ? `${value}PX` : match
    })

    expect(output).toBe('1PX "2px" url(3px.png)')
  })
})
