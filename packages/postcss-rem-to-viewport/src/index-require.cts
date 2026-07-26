type RemToViewportModule = typeof import('./index')

// eslint-disable-next-line import/newline-after-import, ts/no-require-imports
const remToViewportModule = require('./index') as RemToViewportModule
const requireEntry = Object.assign(remToViewportModule.default, remToViewportModule)

// eslint-disable-next-line no-restricted-syntax
export = requireEntry
