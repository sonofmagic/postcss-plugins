import postcss from 'postcss'
import remToPx from '../src/index'

describe('existing rpx declarations', () => {
  it.each([
    ['.x{--spacing:8rpx;--spacing:2rem;--spacing:.25rem}', '.x{--spacing:8rpx;--spacing:64rpx;--spacing:8rpx}'],
    ['.x{width:.25rem;width:8rpx}', '.x{width:8rpx;width:8rpx}'],
    ['.x{width:8rpx;width:.25rem!important}', '.x{width:8rpx;width:8rpx!important}'],
  ])('replaces all source units in %s', async (input, expected) => {
    const result = await postcss(remToPx({ rootValue: 32, transformUnit: 'rpx', propList: ['*'] }))
      .process(input, { from: undefined })
    expect(result.css).toBe(expected)
  })

  it('preserves source declarations without adding duplicate fallbacks when replace=false', async () => {
    const input = '.x{width:8rpx;width:.25rem}'
    const result = await postcss(remToPx({ rootValue: 32, transformUnit: 'rpx', propList: ['*'], replace: false }))
      .process(input, { from: undefined })
    expect(result.css).toBe(input)
  })
})
