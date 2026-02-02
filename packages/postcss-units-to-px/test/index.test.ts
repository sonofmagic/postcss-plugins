import postcss from 'postcss'

import unitsToPx from '@/index'

describe('postcss-units-to-px', () => {
  it('converts default units to px', () => {
    const input = '.rule { margin: 1rem 1em 1vw 1vh 1vmin 1vmax 1rpx; }'
    const output = '.rule { margin: 16px 16px 3.75px 6.67px 3.75px 6.67px 0.5px; }'
    const processed = postcss(unitsToPx()).process(input).css

    expect(processed).toBe(output)
  })

  it('respects unitPrecision', () => {
    const input = '.rule { font-size: 0.333333rem; }'
    const output = '.rule { font-size: 5.33px; }'
    const processed = postcss(
      unitsToPx({
        unitPrecision: 2,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('uses per-unit transform function', () => {
    const input = '.rule { font-size: 2rem; }'
    const output = '.rule { font-size: 20px; }'
    const processed = postcss(
      unitsToPx({
        unitMap: {
          rem: value => value * 10,
        },
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('uses global transform when unit rule is null', () => {
    const input = '.rule { font-size: 1rem; }'
    const output = '.rule { font-size: 20px; }'
    const processed = postcss(
      unitsToPx({
        unitMap: {
          rem: null,
        },
        transform: value => value * 20,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('leaves values unchanged when unit rule is null without transform', () => {
    const input = '.rule { font-size: 1rem; }'
    const processed = postcss(
      unitsToPx({
        unitMap: {
          rem: null,
        },
      }),
    ).process(input).css

    expect(processed).toBe(input)
  })

  it('leaves values unchanged when unit rule is false even with transform', () => {
    const input = '.rule { font-size: 1rem; }'
    const processed = postcss(
      unitsToPx({
        unitMap: {
          rem: false,
        },
        transform: value => value * 20,
      }),
    ).process(input).css

    expect(processed).toBe(input)
  })

  it('skips all conversions when transform is false', () => {
    const input = '.rule { font-size: 1rem; margin: 1vw; }'
    const processed = postcss(
      unitsToPx({
        transform: false,
      }),
    ).process(input).css

    expect(processed).toBe(input)
  })

  it('does not merge defaults when unitMap is a Map', () => {
    const input = '.rule { font-size: 1rem; letter-spacing: 1em; }'
    const output = '.rule { font-size: 10px; letter-spacing: 1em; }'
    const unitMap = new Map([['rem', 10]])
    const processed = postcss(
      unitsToPx({
        unitMap,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('supports matcher rules in array form with order precedence', () => {
    const input = '.rule { font-size: 1rem; margin: 1vw; }'
    const output = '.rule { font-size: 20px; margin: 3px; }'
    const unitMap: Array<[string | RegExp | ((unit: string) => boolean), number]> = [
      [/^r/, 20],
      ['rem', 10],
      [(unit: string) => unit.startsWith('v'), 3],
    ]
    const processed = postcss(
      unitsToPx({
        unitMap,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('respects propList and replace=false behavior', () => {
    const input = '.rule { font-size: 1rem; margin: 1rem; }'
    const output = '.rule { font-size: 1rem; font-size: 16px; margin: 1rem; }'
    const processed = postcss(
      unitsToPx({
        propList: ['font'],
        replace: false,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('does not duplicate existing declarations when replace=false', () => {
    const input = '.rule { font-size: 1rem; font-size: 16px; }'
    const processed = postcss(
      unitsToPx({
        replace: false,
      }),
    ).process(input).css

    expect(processed).toBe(input)
  })

  it('skips selector blacklist and excluded files', () => {
    const input = '.rule { font-size: 1rem; } .skip { font-size: 1rem; }'
    const output = '.rule { font-size: 16px; } .skip { font-size: 1rem; }'
    const processed = postcss(
      unitsToPx({
        selectorBlackList: ['.skip'],
        exclude: ['skip.css'],
      }),
    ).process(input, { from: '/src/skip.css' }).css

    expect(processed).toBe(input)

    const processedNonExcluded = postcss(
      unitsToPx({
        selectorBlackList: ['.skip'],
      }),
    ).process(input).css

    expect(processedNonExcluded).toBe(output)
  })

  it('converts media query params when enabled', () => {
    const input = '@media (min-width: 10rem) { .rule { font-size: 1rem; } }'
    const output = '@media (min-width: 160px) { .rule { font-size: 16px; } }'
    const processed = postcss(
      unitsToPx({
        mediaQuery: true,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('ignores quoted/url/var values', () => {
    const input = '.rule { content: "1rem"; background: url(1rem.png); margin: var(--gap, 1rem); font-size: 1rem; }'
    const output = '.rule { content: "1rem"; background: url(1rem.png); margin: var(--gap, 1rem); font-size: 16px; }'
    const processed = postcss(unitsToPx()).process(input).css

    expect(processed).toBe(output)
  })

  it('respects minValue and returns unitless zero', () => {
    const input = '.rule { font-size: 0.01rem; margin: 1rem; }'
    const output = '.rule { font-size: 0; margin: 16px; }'
    const processed = postcss(
      unitsToPx({
        unitPrecision: 0,
        minValue: 0,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('skips values below minValue', () => {
    const input = '.rule { font-size: 0.1rem; margin: 1rem; }'
    const output = '.rule { font-size: 0.1rem; margin: 16px; }'
    const processed = postcss(
      unitsToPx({
        minValue: 0.5,
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('bypasses rounding when unitPrecision is out of range', () => {
    const input = '.rule { font-size: 1rem; }'
    const output = '.rule { font-size: 0.3333333333333333px; }'
    const processed = postcss(
      unitsToPx({
        unitPrecision: 101,
        unitMap: {
          rem: value => value / 3,
        },
      }),
    ).process(input).css

    expect(processed).toBe(output)
  })

  it('skips invalid unit mappings while keeping defaults', () => {
    const input = '.rule { font-size: 1rem; }'
    const processed = postcss(
      unitsToPx({
        unitMap: {
          '   ': 10,
        },
      }),
    ).process(input).css

    expect(processed).toBe('.rule { font-size: 16px; }')
  })

  it('keeps original when transform returns undefined or NaN', () => {
    const input = '.rule { font-size: 1rem; }'
    const processedUndefined = postcss(
      unitsToPx({
        unitMap: {
          rem: () => undefined as unknown as number,
        },
      }),
    ).process(input).css

    expect(processedUndefined).toBe(input)

    const processedNaN = postcss(
      unitsToPx({
        unitMap: {
          rem: () => Number.NaN,
        },
      }),
    ).process(input).css

    expect(processedNaN).toBe(input)
  })

  it('does nothing when disabled', () => {
    const input = '.rule { font-size: 1rem; }'
    const processed = postcss(
      unitsToPx({
        disabled: true,
      }),
    ).process(input).css

    expect(processed).toBe(input)
  })
})
