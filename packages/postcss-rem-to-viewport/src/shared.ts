import type { UserDefinedOptions } from './types'
import {
  blacklistedSelector,
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
  return function (m: string, $1: string) {
    if (!$1) {
      return m
    }
    const rems = Number.parseFloat($1)
    if (rems < minRemValue) {
      return m
    }
    const fixedVal = toFixed(rems * 100 * 16 / rootValue, unitPrecision)
    return fixedVal === 0 ? '0' : fixedVal + transformUnit
  }
}

export {
  blacklistedSelector,
  createExcludeMatcher,
  createPropListMatcher,
  declarationExists,
  pxRegex,
  remRegex,
  toFixed,
}
