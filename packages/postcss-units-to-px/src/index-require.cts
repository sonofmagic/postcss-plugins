type UnitsToPxModule = typeof import('./index')

// eslint-disable-next-line import/newline-after-import, ts/no-require-imports
const unitsToPxModule = require('./index') as UnitsToPxModule
const requireEntry = Object.assign(unitsToPxModule.default, unitsToPxModule)

// eslint-disable-next-line no-restricted-syntax
export = requireEntry
