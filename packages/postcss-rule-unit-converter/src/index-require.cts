type UnitConverterModule = typeof import('./index')

// eslint-disable-next-line import/newline-after-import, ts/no-require-imports
const unitConverterModule = require('./index') as UnitConverterModule
const requireEntry = Object.assign(unitConverterModule.default, unitConverterModule)

// eslint-disable-next-line no-restricted-syntax
export = requireEntry
