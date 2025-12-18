import {
  createConfigGetter,
  createExcludeMatcher,
  createPropListMatcher,
  declarationExists,
  maybeBlacklistedSelector,
  pxRegex,
  remRegex,
  toFixed,
} from 'postcss-plugin-shared'
import { name as packageName } from '../package.json'
import { defaultOptions } from './defaults'

export const postcssPlugin = packageName

export const getConfig = createConfigGetter(defaultOptions)

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

export const blacklistedSelector = maybeBlacklistedSelector

export {
  createExcludeMatcher,
  createPropListMatcher,
  declarationExists,
  pxRegex,
  remRegex,
  toFixed,
}
