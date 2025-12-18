import postcss from 'postcss'
import pxTransform from '@/index'
import { transform } from './utils'

describe('harmony branch coverage', () => {
  const deviceRatio = { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 }

  it('should convert 1PX to ch when onePxTransform disabled', () => {
    const processed = transform('.rule{border:1px solid #000}', {
      platform: 'harmony',
      designWidth: 640,
      onePxTransform: false,
      deviceRatio,
    })
    expect(processed).toBe('.rule{border:1ch solid #000}')
  })

  it('harmony selector blacklist should still convert using special unit', () => {
    const processed = transform('view{width:100PX}', {
      platform: 'harmony',
      designWidth: 640,
      selectorBlackList: ['view'],
      deviceRatio,
    })
    expect(processed).toBe('view{width:100ch}')
  })

  it('harmony minPixelValue should still emit special unit', () => {
    const processed = transform('view{width:1px}', {
      platform: 'harmony',
      designWidth: 640,
      minPixelValue: 2,
      deviceRatio,
    })
    expect(processed).toBe('view{width:1ch}')
  })

  it('harmony selector blacklist should convert lowercase px using blacklist path', () => {
    const result = postcss().process('view{width:10px}', { from: 'harmony.css' }).sync()
    const prepared = pxTransform({
      platform: 'harmony',
      designWidth: 640,
      selectorBlackList: ['view'],
      deviceRatio,
    }).prepare(result)!

    const decl = result.root!.first!.first as any
    prepared.Declaration(decl)
    expect(decl.value).toBe('10ch')
  })
})
