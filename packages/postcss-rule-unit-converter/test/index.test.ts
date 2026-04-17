import postcss from 'postcss'

import unitConverter, { composeRules, presets } from '../src/index'

describe('postcss-rule-unit-converter', () => {
  it('converts with custom rules', () => {
    const input = '.rule { font-size: 1rem; width: 100px; }'
    const output = '.rule { font-size: 16px; width: 26.66667vw; }'
    const processed = postcss(unitConverter({
      rules: [
        presets.remToPx(),
        presets.pxToViewport(),
      ],
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports rule groups from common presets', () => {
    const input = '.rule { margin: 1rem 1em 1vw 1rpx; }'
    const output = '.rule { margin: 16px 16px 3.75px 0.5px; }'
    const processed = postcss(unitConverter({
      rules: composeRules(presets.unitsToPx()),
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports dynamic preset values based on input file', () => {
    const input = 'h1 { font-size: 1rem; }'
    const output = 'h1 { font-size: 5vw; }'
    const processed = postcss(unitConverter({
      rules: [
        presets.remToViewport({
          viewportWidth: input => input.file?.endsWith('design.css') ? 320 : 375,
        }),
      ],
    })).process(input, { from: '/src/design.css' }).css

    expect(processed).toBe(output)
  })

  it('respects replace=false, propList, mediaQuery, and selector blacklist', () => {
    const input = '@media (min-width: 375px) { .rule { font-size: 16px; margin: 16px; } .skip { font-size: 16px; } }'
    const output = '@media (min-width: 100vw) { .rule { font-size: 16px; font-size: 4.26667vw; margin: 16px; } .skip { font-size: 16px; } }'
    const processed = postcss(unitConverter({
      rules: [presets.pxToViewport()],
      propList: ['font'],
      replace: false,
      mediaQuery: true,
      selectorBlackList: ['.skip'],
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('ignores quoted strings, url(), var(), and excluded files', () => {
    const input = '.rule { content: "1rem"; background: url(1rem.png); gap: var(--gap, 1rem); font-size: 1rem; }'
    const excluded = postcss(unitConverter({
      rules: [presets.remToPx()],
      exclude: ['skip.css'],
    })).process(input, { from: '/src/skip.css' }).css

    expect(excluded).toBe(input)

    const output = '.rule { content: "1rem"; background: url(1rem.png); gap: var(--gap, 1rem); font-size: 16px; }'
    const processed = postcss(unitConverter({
      rules: [presets.remToPx()],
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports regex matchers and full custom transforms', () => {
    const input = '.rule { inset: 1foo 2bar; }'
    const output = '.rule { inset: 10px 2bar; }'
    const processed = postcss(unitConverter({
      rules: [
        {
          from: /^foo$/,
          to: 'px',
          transform: value => value * 10,
        },
      ],
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('exposes raw match information to custom transforms', () => {
    const input = '.rule { width: 40PX; height: 40px; }'
    const output = '.rule { width: 40ch; height: 20px; }'
    const processed = postcss(unitConverter({
      rules: [
        {
          from: /^(px)$/i,
          to: 'px',
          transform(value, context) {
            if (context.rawUnit === 'PX') {
              return {
                value,
                unit: 'ch',
              }
            }

            return value / 2
          },
        },
      ],
      propList: ['width', 'height'],
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports rpx, px, rem, vw, and vh conversion presets', () => {
    const input = '.rule { a: 20rpx; b: 20px; c: 2vw; d: 3vh; e: 1rem; }'
    const output = '.rule { a: 10px; b: 40rpx; c: 7.5px; d: 20.01px; e: 6vh; }'
    const processed = postcss(unitConverter({
      rules: [
        presets.rpxToPx(),
        presets.pxToRpx(),
        presets.vwToPx(),
        presets.vhToPx(),
        presets.remToVh({
          rootValue: 20.01,
          viewportHeight: 333.5,
        }),
      ],
      propList: ['a', 'b', 'c', 'd', 'e'],
      unitPrecision: 2,
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports actual ratio-based rpx conversions to rem and viewport units', () => {
    const input = '.rule { font-size: 32rpx; width: 10vw; height: 10vh; }'
    const output = '.rule { font-size: 1rem; width: 75rpx; height: 133.4rpx; }'
    const processed = postcss(unitConverter({
      rules: [
        presets.rpxToRem(),
        presets.vwToRpx({
          viewportWidth: 375,
        }),
        presets.vhToRpx({
          viewportHeight: 667,
        }),
      ],
      propList: ['font', 'width', 'height'],
      unitPrecision: 2,
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports rpx to vw preset', () => {
    const input = '.rule { width: 32rpx; }'
    const output = '.rule { width: 4vw; }'
    const processed = postcss(unitConverter({
      rules: [
        presets.rpxToVw({
          viewportWidth: 400,
        }),
      ],
      propList: ['width'],
      unitPrecision: 2,
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports rpx to vh preset', () => {
    const input = '.rule { height: 32rpx; }'
    const output = '.rule { height: 2.4vh; }'
    const processed = postcss(unitConverter({
      rules: [
        presets.rpxToVh({
          viewportHeight: 666.67,
        }),
      ],
      propList: ['height'],
      unitPrecision: 2,
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports grouped presets for rpx-centric workflows', () => {
    const input = '.rule { width: 16px; left: 10vw; top: 10vh; font-size: 1rem; }'
    const output = '.rule { width: 32rpx; left: 75rpx; top: 133.4rpx; font-size: 32rpx; }'
    const processed = postcss(unitConverter({
      rules: presets.rpxPresetGroup({
        rootValue: 16,
        viewportWidth: 375,
        viewportHeight: 667,
      }),
      propList: ['font', 'width', 'left', 'top'],
      unitPrecision: 2,
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports grouped presets for px-centric workflows', () => {
    const input = '.rule { width: 1rem; height: 32rpx; margin-left: 10vw; margin-top: 10vh; }'
    const output = '.rule { width: 16px; height: 16px; margin-left: 37.5px; margin-top: 66.7px; }'
    const processed = postcss(unitConverter({
      rules: presets.pxPresetGroup({
        rootValue: 16,
        viewportWidth: 375,
        viewportHeight: 667,
      }),
      propList: ['width', 'height', 'margin-left', 'margin-top'],
      unitPrecision: 2,
    })).process(input).css

    expect(processed).toBe(output)
  })

  it('supports grouped presets for viewport-centric workflows', () => {
    const widthInput = '.rule { width: 16px; min-width: 32rpx; }'
    const widthOutput = '.rule { width: 4.26667vw; min-width: 4.26667vw; }'
    const widthProcessed = postcss(unitConverter({
      rules: presets.viewportPresetGroup({
        rootValue: 16,
        viewportWidth: 375,
      }),
      propList: ['width', 'min-width'],
      unitPrecision: 5,
    })).process(widthInput).css

    expect(widthProcessed).toBe(widthOutput)

    const heightInput = '.rule { height: 16px; min-height: 32rpx; }'
    const heightOutput = '.rule { height: 2.3988vh; min-height: 2.3988vh; }'
    const heightProcessed = postcss(unitConverter({
      rules: presets.viewportPresetGroup({
        rootValue: 16,
        viewportHeight: 667,
        viewportUnit: 'vh',
      }),
      propList: ['height', 'min-height'],
      unitPrecision: 5,
    })).process(heightInput).css

    expect(heightProcessed).toBe(heightOutput)
  })
})
