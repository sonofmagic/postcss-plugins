import {
  createConfigGetter,
  createExcludeMatcher,
  createPropListMatcher,
  createSelectorBlacklistMatcher,
  declarationExists,
  maybeBlacklistedSelector,
  pxRegex,
  remRegex,
  toFixed,
  walkAndReplaceValues,
} from 'postcss-plugin-shared'
import { name as packageName } from '../package.json'
import { defaultOptions } from './defaults'

/**
 * PostCSS plugin name used by this package.
 *
 * @default package.json name
 */
export const postcssPlugin = packageName

/**
 * Merge user options with defaults for postcss-rem-to-viewport.
 *
 * Defaults:
 * - rootValue: 375
 * - unitPrecision: 16
 * - propList: ['font', 'font-size', 'line-height', 'letter-spacing']
 * - replace: true
 * - mediaQuery: false
 * - minRemValue: 0
 * - exclude: [/node_modules/i]
 * - transformUnit: 'vw'
 * - disabled: false
 *
 * @example
 * const config = getConfig({ rootValue: 375 })
 */
export const getConfig = createConfigGetter(defaultOptions)

/**
 * Create a replacer that converts rem to viewport units.
 *
 * @default
 *
 * @example
 * const replace = createRemReplace(375, 16, 0, 'vw')
 * '1rem'.replace(/(\\d+)(rem)/, (m, $1) => replace(m, $1))
 */
export function createRemReplace(
  rootValue: number,
  unitPrecision: number,
  minRemValue: number,
  transformUnit = 'vw',
) {
  const factor = (100 * 16) / rootValue
  const multiplier = 10 ** unitPrecision

  return function (m: string, $1?: string) {
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

/**
 * Alias for selector blacklist matching, returning undefined for non-string selectors.
 *
 * @example
 * blacklistedSelector(['.ignore'], '.ignore .btn') // true
 */
export const blacklistedSelector = maybeBlacklistedSelector

export {
  createExcludeMatcher,
  createPropListMatcher,
  createSelectorBlacklistMatcher,
  declarationExists,
  pxRegex,
  remRegex,
  toFixed,
  walkAndReplaceValues,
}
