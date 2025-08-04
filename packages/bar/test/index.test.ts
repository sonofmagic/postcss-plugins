import postcss from 'postcss'
import myPlugin from '@/index'

describe('index', () => {
  it('foo bar', () => {
    const { css } = postcss([
      myPlugin(),
    ]).process(`page,:host {}`)
    expect(css).toMatchSnapshot()
  })
})
