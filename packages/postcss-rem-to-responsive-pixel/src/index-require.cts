type RemToResponsivePixelModule = typeof import('./index')

// eslint-disable-next-line import/newline-after-import, ts/no-require-imports
const remToResponsivePixelModule = require('./index') as RemToResponsivePixelModule
const requireEntry = Object.assign(remToResponsivePixelModule.default, remToResponsivePixelModule)

// eslint-disable-next-line no-restricted-syntax
export = requireEntry
