type PxTransformModule = typeof import('./index')

// eslint-disable-next-line import/newline-after-import, ts/no-require-imports
const pxTransformModule = require('./index') as PxTransformModule
const pxTransform = pxTransformModule.default
const { createDirectivePlugin } = pxTransformModule

const requireEntry = Object.assign(pxTransform, {
  default: pxTransform,
  createDirectivePlugin,
})

// eslint-disable-next-line no-restricted-syntax
export = requireEntry
