import type { UserDefinedOptions } from './types'
import {
  createExcludeMatcher,
  createPropListMatcher,
  declarationExists,
  mergeOptions,
  pxRegex,
  remRegex,
  toFixed,
} from 'postcss-plugin-shared'
import { name as packageName } from '../package.json'
import { defaultOptions } from './defaults'

export const postcssPlugin = packageName

export function getConfig(options?: UserDefinedOptions) {
  return mergeOptions(options, defaultOptions) as Required<UserDefinedOptions>
}

export function createRemReplace(
  rootValue: number,
  unitPrecision: number,
  minRemValue: number,
  transformUnit = 'vw',
) {
  const factor = (100 * 16) / rootValue
  const multiplier = 10 ** unitPrecision

  return function (m: string, $1: string) {
    if (!$1) {
      return m
    }
    const rems = Number($1)
    if (rems < minRemValue) {
      return m
    }

    const value = rems * factor
    if (value === 0) {
      return '0'
    }

    const fixedVal = unitPrecision === 0
      ? Math.round(value)
      : Math.round((value + Number.EPSILON) * multiplier) / multiplier

    return fixedVal === 0 ? '0' : fixedVal + transformUnit
  }
}

export function blacklistedSelector(
  blacklist: readonly (string | RegExp)[],
  selector?: string,
): boolean | undefined {
  if (typeof selector !== 'string') {
    return undefined
  }
  return blacklist.some((rule) => {
    if (typeof rule === 'string') {
      return selector.includes(rule)
    }
    return Boolean(selector.match(rule))
  })
}

export {
  createExcludeMatcher,
  createPropListMatcher,
  declarationExists,
  pxRegex,
  remRegex,
  toFixed,
}
