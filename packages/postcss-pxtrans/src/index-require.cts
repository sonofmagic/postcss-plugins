import pxTransform, { createDirectivePlugin } from './index'

const requireEntry = Object.assign(pxTransform, {
  default: pxTransform,
  createDirectivePlugin,
})

export = requireEntry
