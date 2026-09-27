import postcss from 'postcss'
import { remRegex, walkAndReplaceValues } from '../src/index'

describe('replacement with existing converted declarations', () => {
  for (const prop of ['width', '--spacing']) {
    for (const replace of [undefined, true]) {
      for (const skipDuplicate of [undefined, true, false]) {
        it.each([
          ['8rpx;.25rem', '8rpx;8rpx'],
          ['.25rem;8rpx', '8rpx;8rpx'],
          ['8rpx;2rem;.25rem', '8rpx;64rpx;8rpx'],
          ['.25rem;.25rem', '8rpx;8rpx'],
          ['8rpx;.25rem!important', '8rpx;8rpx!important'],
          ['8rpx!important;.25rem', '8rpx!important;8rpx'],
        ])(`${prop}, replace=${replace}, skipDuplicate=${skipDuplicate}: %s → %s`, (input, expected) => {
          const css = (values: string) => `.rule{${values.split(';').map(value => `${prop}:${value}`).join(';')}}`
          const root = postcss.parse(css(input))
          const rule = root.first as postcss.Rule
          const declarations = [...rule.nodes]
          walkAndReplaceValues({
            root,
            unitRegex: remRegex,
            propList: ['*'],
            ...(replace === undefined ? {} : { replace }),
            ...(skipDuplicate === undefined ? {} : { skipDuplicate }),
            createReplacer: () => (match, value) => value === undefined ? match : `${Number(value) * 32}rpx`,
          })

          expect(root.toString()).toBe(css(expected))
          expect(rule.nodes).toHaveLength(declarations.length)
          rule.nodes.forEach((node, index) => expect(node).toBe(declarations[index]))
        })
      }
    }
  }

  it.each([
    [true, '.rule{width:8rpx;width:.25rem}'],
    [false, '.rule{width:8rpx;width:.25rem;width:8rpx}'],
  ])('retains insertion semantics with replace=false and skipDuplicate=%s', (skipDuplicate, expected) => {
    const root = postcss.parse('.rule{width:8rpx;width:.25rem}')
    walkAndReplaceValues({
      root,
      unitRegex: remRegex,
      propList: ['*'],
      replace: false,
      skipDuplicate,
      createReplacer: () => (_match, value) => `${Number(value) * 32}rpx`,
    })
    expect(root.toString()).toBe(expected)
  })
})
