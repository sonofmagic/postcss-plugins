import postcss from 'postcss'

import remToVw from '@/index'

const basicCSS = '.rule { font-size: 0.9375rem }'

describe('remToVw', () => {
  it('should work on the readme example', () => {
    const input
      = 'h1 { margin: 0 0 20px; font-size: 2rem; line-height: 1.2; letter-spacing: 0.0625rem; }'
    const output
      = 'h1 { margin: 0 0 20px; font-size: 8.533333333333335vw; line-height: 1.2; letter-spacing: 0.2666666666666667vw; }'
    const processed = postcss(remToVw()).process(input).css

    expect(processed).toBe(output)
  })

  it('should not work when disabled', () => {
    const input
      = 'h1 { margin: 0 0 20px; font-size: 2rem; line-height: 1.2; letter-spacing: 0.0625rem; }'
    const output = input

    const processed = postcss(
      remToVw({
        disabled: true,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('should replace the rem unit with px', () => {
    const processed = postcss(remToVw()).process(basicCSS).css
    const expected = '.rule { font-size: 4vw }'

    expect(processed).toBe(expected)
  })

  it('should ignore non rem properties', () => {
    const expected = '.rule { font-size: 2em }'
    const processed = postcss(remToVw()).process(expected).css

    expect(processed).toBe(expected)
  })

  it('should handle < 1 values and values without a leading 0', () => {
    const rules = '.rule { margin: 0.5px .03125rem -0.0125rem -.2em }'
    const expected = '.rule { margin: 0.5px 0.1333333333333334vw -0.0533333333333333vw -.2em }'
    const options = {
      propList: ['margin'],
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('should not add properties that already exist', () => {
    const expected = '.rule { font-size: 0.234375vw; font-size: 16px; }'
    const processed = postcss(remToVw()).process(expected).css

    expect(processed).toBe(expected)
  })

  it('should remain unitless if 0', () => {
    const expected = '.rule { font-size: 0rem; font-size: 0; }'
    const processed = postcss(remToVw()).process(expected).css

    expect(processed).toBe(expected)
  })

  it('should unit be rpx', () => {
    const input
      = 'h1 { margin: 0 0 20px; font-size: 2rem; line-height: 1.2; letter-spacing: 0.0625rem; }'
    const output
      = 'h1 { margin: 0 0 20px; font-size: 8.533333333333335rpx; line-height: 1.2; letter-spacing: 0.2666666666666667rpx; }'
    const processed = postcss(
      remToVw({
        transformUnit: 'rpx',
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })
})

describe('value parsing', () => {
  it('should not replace values in double quotes or single quotes', () => {
    const options = {
      propList: ['*'],
    }
    const rules
      = '.rule { content: \'1rem\'; font-family: "1rem"; font-size: 1rem; }'
    const expected
      = '.rule { content: \'1rem\'; font-family: "1rem"; font-size: 4.2666666666666675vw; }'
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('should not replace values in `url()`', () => {
    const options = {
      propList: ['*'],
    }
    const rules = '.rule { background: url(1rem.jpg); font-size: 1rem; }'
    const expected = '.rule { background: url(1rem.jpg); font-size: 4.2666666666666675vw; }'
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('should not replace values with an uppercase R or REM', () => {
    const options = {
      propList: ['*'],
    }
    const rules
      = '.rule { margin: 0.75rem calc(100% - 14REM); height: calc(100% - 1.25rem); font-size: 12Rem; line-height: 1rem; }'
    const expected
      = '.rule { margin: 3.2vw calc(100% - 14REM); height: calc(100% - 5.333333333333332vw); font-size: 12Rem; line-height: 4.2666666666666675vw; }'
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('rootValue', () => {
  it('should replace using a root value of 10', () => {
    const expected = '.rule { font-size: 2vw }'
    const options = {
      rootValue: 750,
    }
    const processed = postcss(remToVw(options)).process(basicCSS).css

    expect(processed).toBe(expected)
  })
})

describe('unitPrecision', () => {
  it('should replace using a decimal of 2 places', () => {
    const rules = '.rule { font-size: 0.534375rem }'
    const expected = '.rule { font-size: 2.28vw }'
    const options = {
      unitPrecision: 2,
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('propList', () => {
  it('should only replace properties in the prop list', () => {
    const rules
      = '.rule { font-size: 1rem; margin: 1rem; margin-left: 0.5rem; padding: 0.5rem; padding-right: 1rem }'
    const expected
      = '.rule { font-size: 4.2666666666666675vw; margin: 4.2666666666666675vw; margin-left: 0.5rem; padding: 2.1333333333333337vw; padding-right: 4.2666666666666675vw }'
    const options = {
      propList: ['font', /^margin$/, 'pad'],
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('should only replace properties in the prop list with wildcard', () => {
    const rules
      = '.rule { font-size: 1rem; margin: 1rem; margin-left: 0.5rem; padding: 0.5rem; padding-right: 1rem }'
    const expected
      = '.rule { font-size: 1rem; margin: 4.2666666666666675vw; margin-left: 0.5rem; padding: 0.5rem; padding-right: 1rem }'
    const options = {
      propList: [/^margin$/],
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('should replace all properties when white list is wildcard', () => {
    const rules = '.rule { margin: 1rem; font-size: 0.9375rem }'
    const expected = '.rule { margin: 4.2666666666666675vw; font-size: 4vw }'
    const options = {
      propList: ['*'],
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('selectorBlackList', () => {
  it('should ignore selectors in the selector black list', () => {
    const rules = '.rule { font-size: 0.9375rem } .rule2 { font-size: 15rem }'
    const expected = '.rule { font-size: 4vw } .rule2 { font-size: 15rem }'
    const options = {
      selectorBlackList: ['.rule2'],
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('should ignore every selector with `body$`', () => {
    const rules
      = 'body { font-size: 1rem; } .class-body$ { font-size: 16rem; } .simple-class { font-size: 1rem; }'
    const expected
      = 'body { font-size: 4.2666666666666675vw; } .class-body$ { font-size: 16rem; } .simple-class { font-size: 4.2666666666666675vw; }'
    const options = {
      selectorBlackList: ['body$'],
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })

  it('should only ignore exactly `body`', () => {
    const rules
      = 'body { font-size: 16rem; } .class-body { font-size: 1rem; } .simple-class { font-size: 1rem; }'
    const expected
      = 'body { font-size: 16rem; } .class-body { font-size: 4.2666666666666675vw; } .simple-class { font-size: 4.2666666666666675vw; }'
    const options = {
      selectorBlackList: [/^body$/],
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('replace', () => {
  it('should leave fallback pixel unit with root em value', () => {
    const options = {
      replace: false,
    }
    const expected = '.rule { font-size: 0.9375rem; font-size: 4vw }'
    const processed = postcss(remToVw(options)).process(basicCSS).css

    expect(processed).toBe(expected)
  })
})

describe('mediaQuery', () => {
  it('should replace rem in media queries', () => {
    const rules = '@media (min-width: 31.25rem) { .rule { font-size: 1rem } }'
    const expected = '@media (min-width: 133.33333333333337vw) { .rule { font-size: 4.2666666666666675vw } }'
    const options = {
      mediaQuery: true,
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})

describe('minRemValue', () => {
  it('should not replace values below minRemValue', () => {
    const rules
      = '.rule { border: 0.0625rem solid #000; font-size: 1rem; margin: 0.0625rem 0.625rem; }'
    const expected
      = '.rule { border: 0.0625rem solid #000; font-size: 4.2666666666666675vw; margin: 0.0625rem 2.666666666666666vw; }'
    const options = {
      propList: ['*'],
      minRemValue: 0.5,
    }
    const processed = postcss(remToVw(options)).process(rules).css

    expect(processed).toBe(expected)
  })
})
