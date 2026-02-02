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
import { defaultOptions } from './defaults'

/**
 * PostCSS plugin name used by this package.
 *
 * @default 'postcss-rem-to-responsive-pixel'
 */
export const postcssPlugin = 'postcss-rem-to-responsive-pixel'

/**
 * Merge user options with defaults for postcss-rem-to-responsive-pixel.
 *
 * Defaults:
 * - rootValue: 16
 * - unitPrecision: 5
 * - propList: ['font', 'font-size', 'line-height', 'letter-spacing']
 * - replace: true
 * - mediaQuery: false
 * - minRemValue: 0
 * - exclude: [/node_modules/i]
 * - transformUnit: 'px'
 * - processorStage: 'Once'
 * - disabled: false
 *
 * @example
 * const config = getConfig({ transformUnit: 'rpx' })
 */
export const getConfig = createConfigGetter(defaultOptions)

/**
 * Create a replacer that converts rem to pixels.
 *
 * @default
 *
 * @example
 * const replace = createRemReplace(16, 5, 0, 'px')
 * '1rem'.replace(/(\\d+)(rem)/, (m, $1) => replace(m, $1))
 */
export function createRemReplace(
  rootValue: number,
  unitPrecision: number,
  minRemValue: number,
  transformUnit = 'px',
) {
  return function (m: string, $1?: string) {
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
