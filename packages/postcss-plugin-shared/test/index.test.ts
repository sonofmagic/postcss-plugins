import postcss from 'postcss'
import {
  blacklistedSelector,
  createAdvancedPropListMatcher,
  createConfigGetter,
  createExcludeMatcher,
  createPropListMatcher,
  createUnitRegex,
  declarationExists,
  maybeBlacklistedSelector,
  mergeOptions,
  pxRegex,
  remRegex,
  toFixed,
} from '@/index'

describe('postcss-plugin-shared', () => {
  describe('toFixed', () => {
    it('returns 0 early for 0 input', () => {
      expect(toFixed(0, 2)).toBe(0)
      expect(toFixed(-0, 5)).toBe(0)
    })

    it('rounds positive and negative numbers with precision', () => {
      expect(toFixed(0.12345, 2)).toBe(0.12)
      expect(toFixed(0.1299, 2)).toBe(0.13)
      expect(toFixed(-0.1299, 2)).toBe(-0.13)
    })
  })

  describe('mergeOptions', () => {
    it('fills missing values from defaults', () => {
      const merged = mergeOptions(undefined, { rootValue: 16, propList: ['*'] })
      expect(merged).toEqual({ rootValue: 16, propList: ['*'] })
    })

    it('does not merge arrays; options arrays win', () => {
      const merged = mergeOptions(
        {
          propList: ['color'],
          nested: {
            list: ['a'],
          },
        },
        {
          rootValue: 16,
          propList: ['*'],
          nested: {
            list: ['b', 'c'],
            enabled: true,
          },
        },
      )

      expect(merged.rootValue).toBe(16)
      expect(merged.propList).toEqual(['color'])
      expect(merged.nested).toEqual({ enabled: true, list: ['a'] })
    })

    it('keeps primitive option values when defaults have arrays', () => {
      const merged = mergeOptions(
        { propList: '*' as unknown as string[] },
        { propList: ['a', 'b'] },
      )
      expect(merged.propList).toBe('*')
    })
  })

  describe('createConfigGetter', () => {
    it('creates a getConfig helper that merges with defaults', () => {
      const defaults = { rootValue: 16, propList: ['*'] as string[] }
      const getConfig = createConfigGetter(defaults)

      expect(getConfig()).toEqual(defaults)
      expect(getConfig({ rootValue: 10 })).toEqual({ rootValue: 10, propList: ['*'] })
      expect(getConfig({ propList: ['color'] })).toEqual({ rootValue: 16, propList: ['color'] })
    })
  })

  describe('declarationExists', () => {
    it('returns true only for matching decl nodes', () => {
      const root = postcss.parse('.rule { /* non-decl */ font-size: 16px; line-height: 24px; }')
      const rule = root.first!

      expect(declarationExists(rule as any, 'font-size', '16px')).toBe(true)
      expect(declarationExists(rule as any, 'font-size', '1rem')).toBe(false)
    })

    it('returns false when there are no decl nodes', () => {
      const root = postcss.parse('.rule { /* only comment */ }')
      const rule = root.first!
      expect(declarationExists(rule as any, 'font-size', '16px')).toBe(false)
    })
  })

  describe('regex', () => {
    it('remRegex ignores quoted strings, url() and var()', () => {
      const input = `a:"1rem";b:'2rem';c:url(/3rem.png);d:var(--x,4rem);e:5rem;`
      const output = input.replace(remRegex, (match, value?: string) => {
        return value ? `${value}REM` : match
      })

      expect(output).toContain(`a:"1rem"`)
      expect(output).toContain(`b:'2rem'`)
      expect(output).toContain('c:url(/3rem.png)')
      expect(output).toContain('d:var(--x,4rem)')
      expect(output).toContain('e:5REM')
    })

    it('pxRegex ignores quoted strings, url() and var()', () => {
      const input = `a:"1px";b:'2px';c:url(/3px.png);d:var(--x,4px);e:5px;`
      const output = input.replace(pxRegex, (match, value?: string) => {
        return value ? `${value}PX` : match
      })

      expect(output).toContain(`a:"1px"`)
      expect(output).toContain(`b:'2px'`)
      expect(output).toContain('c:url(/3px.png)')
      expect(output).toContain('d:var(--x,4px)')
      expect(output).toContain('e:5PX')
    })

    it('createUnitRegex can be configured to not skip var()', () => {
      const re = createUnitRegex({ units: ['px'], skipVar: false })
      const input = 'a:var(--x,4px);b:5px;'
      const output = input.replace(re, (match, value?: string) => {
        return value ? `${value}PX` : match
      })

      expect(output).toBe('a:var(--x,4PX);b:5PX;')
    })
  })

  describe('selectors', () => {
    it('blacklistedSelector supports missing selectors, string rules and regex rules', () => {
      expect(blacklistedSelector(['.forbidden'], undefined)).toBe(false)
      expect(blacklistedSelector(['.forbidden'], '.forbidden button')).toBe(true)
      expect(blacklistedSelector(['.forbidden'], '.allowed button')).toBe(false)
      expect(blacklistedSelector([/body$/], '.page-body')).toBe(true)
      expect(blacklistedSelector([/body$/], '.page-body .content')).toBe(false)
    })

    it('maybeBlacklistedSelector returns undefined for non-string selectors', () => {
      expect(maybeBlacklistedSelector(['.forbidden'], undefined)).toBeUndefined()
      expect(maybeBlacklistedSelector(['.forbidden'], '.forbidden button')).toBe(true)
      expect(maybeBlacklistedSelector(['.forbidden'], '.allowed button')).toBe(false)
    })

    it('createPropListMatcher respects wildcards', () => {
      const anyProp = createPropListMatcher(['*'])
      expect(anyProp('border-left')).toBe(true)
      expect(anyProp('anything')).toBe(true)
    })

    it('createPropListMatcher matches string and regex entries', () => {
      const matcher = createPropListMatcher(['font', /^margin$/])
      expect(matcher('margin')).toBe(true)
      expect(matcher('font-size')).toBe(true)
      expect(matcher('padding')).toBe(false)
    })

    it('createExcludeMatcher handles undefined file paths', () => {
      const matcher = createExcludeMatcher(['node_modules'])
      expect(matcher(undefined)).toBe(false)
    })

    it('createExcludeMatcher supports arrays', () => {
      const matcher = createExcludeMatcher(['node_modules', /\.stories\.tsx$/])
      expect(matcher('/project/node_modules/foo.css')).toBe(true)
      expect(matcher('/project/Button.stories.tsx')).toBe(true)
      expect(matcher('/project/Button.tsx')).toBe(false)
    })

    it('createExcludeMatcher supports functions', () => {
      const matcher = createExcludeMatcher(filepath => filepath.includes('skip-me'))
      expect(matcher('/project/skip-me.css')).toBe(true)
      expect(matcher('/project/keep-me.css')).toBe(false)
    })

    it('createAdvancedPropListMatcher supports include/exclude patterns', () => {
      const matcher = createAdvancedPropListMatcher([
        '*',
        '!border',
        'font*',
        '*height',
        '*margin*',
        '!*padding*',
      ])

      expect(matcher('font-size')).toBe(true)
      expect(matcher('line-height')).toBe(true)
      expect(matcher('margin-left')).toBe(true)
      expect(matcher('padding-left')).toBe(false)
      expect(matcher('border')).toBe(false)
    })
  })
})
