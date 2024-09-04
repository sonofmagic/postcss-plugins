import type { UserDefinedOptions } from './types'

export const defaultOptions: Required<UserDefinedOptions> = {
  // 100vw = 375px = 23.4375rem
  // 1rem = 0.234375vw
  // 1px = 0.0146484375vw
  rootValue: 375, //  / 100 / 16,
  unitPrecision: 16,
  selectorBlackList: [],
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  replace: true,
  mediaQuery: false,
  minRemValue: 0,
  exclude: [/node_modules/i],
  transformUnit: 'vw',
  disabled: false,
}
