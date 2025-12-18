import { transform } from './utils'

describe('options & rootValue', () => {
  it('should honor minRootSize when baseFontSize is missing', () => {
    const processed = transform('.rule{width:56px}', {
      platform: 'weapp',
      designWidth: 750,
      targetUnit: 'rem',
      minRootSize: 28,
    })
    expect(processed).toBe('.rule{width:1rem}')
  })

  it('should support custom rootValue as function', () => {
    const processed = transform('.rule{width:10px}', {
      platform: 'h5',
      designWidth: 750,
      rootValue() {
        return 2
      },
    })
    expect(processed).toBe('.rule{width:5rem}')
  })

  it('should support custom rootValue as number', () => {
    const processed = transform('.rule{width:20px}', {
      platform: 'h5',
      designWidth: 750,
      rootValue: 10,
    })
    expect(processed).toBe('.rule{width:2rem}')
  })

  it('should fall back to default rootValue when invalid type provided', () => {
    const processed = transform('.rule{width:16px}', {
      platform: 'h5',
      designWidth: 750,
      rootValue: null as any,
    })
    expect(processed).toBe('.rule{width:1rem}')
  })

  it('should support designWidth as function', () => {
    const processed = transform('.rule{width:20px}', {
      platform: 'h5',
      designWidth(input) {
        return input.file?.includes('nutui') ? 375 : 750
      },
    }, 'node_modules/@nutui/test.css')
    expect(processed).toBe('.rule{width:1rem}')
  })
})

describe('exclude & misc', () => {
  it('should skip file when exclude returns true', () => {
    const css = '.rule{width:10px}'
    const processed = transform(css, {
      platform: 'h5',
      designWidth: 750,
      exclude(filePath) {
        return filePath === 'skip.css'
      },
    }, 'skip.css')
    expect(processed).toBe(css)
  })

  it('should not transform 1px when onePxTransform disabled (non-harmony)', () => {
    const processed = transform('.rule{border:1px solid #000}', {
      platform: 'h5',
      designWidth: 750,
      onePxTransform: false,
    })
    expect(processed).toBe('.rule{border:1px solid #000}')
  })
})
