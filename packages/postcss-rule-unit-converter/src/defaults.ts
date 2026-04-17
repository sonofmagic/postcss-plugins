import type { UserDefinedOptions } from './types'

export type ResolvedOptions = Required<UserDefinedOptions>

export const defaultOptions: ResolvedOptions = {
  rules: [] as Array<never>,
  unitPrecision: 5,
  minValue: 0,
  selectorBlackList: [] as Array<string | RegExp>,
  propList: ['*'] as Array<string | RegExp>,
  replace: true,
  mediaQuery: false,
  exclude: [/node_modules/i],
  disabled: false,
}
