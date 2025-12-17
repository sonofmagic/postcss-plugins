import postcss from 'postcss'
import { remRegex } from '@/regex'
import {
  blacklistedSelector,
  createExcludeMatcher,
  createPropListMatcher,
  createRemReplace,
  declarationExists,
  getConfig,
  toFixed,
} from '@/shared'

describe('shared helpers', () => {
  it('getConfig replaces array options instead of merging', () => {
    const config = getConfig({
      propList: ['color'],
      exclude: [/custom/],
    })

    expect(config.propList).toEqual(['color'])
    expect(config.exclude).toEqual([/custom/])
    expect(config.rootValue).toBe(16)
  })

  it('toFixed rounds values with provided precision', () => {
    expect(toFixed(0.12345, 2)).toBe(0.12)
    expect(toFixed(0.1299, 2)).toBe(0.13)
  })

  it('createRemReplace respects minRemValue, zero and custom units', () => {
    const skipSmall = createRemReplace(16, 2, 0.2, 'rpx')
    expect('margin: 0.1rem'.replace(remRegex, skipSmall)).toBe('margin: 0.1rem')
    expect('padding: 0rem'.replace(remRegex, skipSmall)).toBe('padding: 0rem')

    const convert = createRemReplace(16, 3, 0)
    expect('padding: 1rem'.replace(remRegex, convert)).toBe('padding: 16px')
    expect('padding: 0rem'.replace(remRegex, convert)).toBe('padding: 0')
  })

  it('declarationExists detects duplicate declarations inside the same rule', () => {
    const root = postcss.parse('.rule { font-size: 16px; line-height: 24px; }')
    const rule = root.first!

    expect(declarationExists(rule, 'font-size', '16px')).toBe(true)
    expect(declarationExists(rule, 'font-size', '1rem')).toBe(false)
  })

  it('blacklistedSelector handles strings, regex and missing selectors', () => {
    expect(blacklistedSelector(['.forbidden'], '.forbidden button')).toBe(true)
    expect(blacklistedSelector([/body$/], '.page-body')).toBe(true)
    expect(blacklistedSelector([], undefined as unknown as string)).toBeUndefined()
  })

  it('createPropListMatcher respects wildcards, regex and strings', () => {
    const anyProp = createPropListMatcher(['*'])
    const limited = createPropListMatcher(['font', /^margin$/])

    expect(anyProp('border-left')).toBe(true)
    expect(limited('margin')).toBe(true)
    expect(limited('padding')).toBe(false)
  })

  it('createExcludeMatcher supports arrays, functions and undefined file paths', () => {
    const fromArray = createExcludeMatcher(['node_modules', /\.stories\.tsx$/])
    const fromFn = createExcludeMatcher(filepath => filepath.includes('skip-me'))

    expect(fromArray('/project/node_modules/foo.css')).toBe(true)
    expect(fromArray('/project/Button.stories.tsx')).toBe(true)
    expect(fromArray('/project/Button.tsx')).toBe(false)
    expect(fromFn('/project/skip-me.css')).toBe(true)
    expect(fromFn(undefined as unknown as string)).toBe(false)
  })
})
