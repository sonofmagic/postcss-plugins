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
import { defaultOptions } from './defaults'

export const postcssPlugin = 'postcss-rem-to-responsive-pixel'

export const getConfig = createConfigGetter(defaultOptions)

export function createRemReplace(
  rootValue: number,
  unitPrecision: number,
  minRemValue: number,
  transformUnit = 'px',
) {
  return function (m: string, $1: string) {
    if (!$1) {
      return m
    }
    const rems = Number.parseFloat($1)
    if (rems < minRemValue) {
      return m
    }
    const fixedVal = toFixed(rems * rootValue, unitPrecision)
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
