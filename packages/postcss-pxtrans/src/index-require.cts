import pxTransform, { createDirectivePlugin } from './index'

const requireEntry = Object.assign(pxTransform, {
  default: pxTransform,
  createDirectivePlugin,
})

// eslint-disable-next-line no-restricted-syntax
export = requireEntry
