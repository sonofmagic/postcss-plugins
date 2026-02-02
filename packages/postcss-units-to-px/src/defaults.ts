import type { UnitMap, UserDefinedOptions } from './types'

export type ResolvedOptions = Required<Omit<UserDefinedOptions, 'transform'>>
  & { transform?: UserDefinedOptions['transform'] }

export const defaultUnitMap: UnitMap = {
  rem: 16,
  em: 16,
  vw: 3.75,
  vh: 6.67,
  vmin: 3.75,
  vmax: 6.67,
  rpx: 0.5,
}

export const defaultOptions: ResolvedOptions = {
  unitMap: defaultUnitMap,
  unitPrecision: 5,
  selectorBlackList: [] as Array<string | RegExp>,
  propList: ['*'] as Array<string | RegExp>,
  replace: true,
  mediaQuery: false,
  minValue: 0,
  exclude: [/node_modules/i],
  disabled: false,
}
