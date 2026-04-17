import postcss from 'postcss'
import { createDirectivePlugin } from '../src/directives'
import pxTransform from '../src/index'

export function transform(
  css: string,
  options: Parameters<typeof pxTransform>[0] = {},
  from = 'input.css',
) {
  return postcss([
    createDirectivePlugin(options),
    pxTransform(options),
  ])
    .process(css, { from })
    .css
}

export const basicCSS = '.rule { font-size: 15px }'
