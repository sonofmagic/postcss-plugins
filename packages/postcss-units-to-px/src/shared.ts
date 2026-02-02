import {
  createConfigGetter,
  createExcludeMatcher,
  createPropListMatcher,
  createSelectorBlacklistMatcher,
  createUnitRegex,
  declarationExists,
  maybeBlacklistedSelector,
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
 * Merge user options with defaults for postcss-units-to-px.
 *
 * Defaults:
 * - unitMap: { rem: 16, em: 16, vw: 3.75, vh: 6.67, vmin: 3.75, vmax: 6.67, rpx: 0.5 }
 * - unitPrecision: 5
 * - propList: ['*']
 * - replace: true
 * - mediaQuery: false
 * - minValue: 0
 * - exclude: [/node_modules/i]
 * - disabled: false
 *
 * @example
 * const config = getConfig({ unitPrecision: 4 })
 */
export const getConfig = createConfigGetter(defaultOptions)

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
  createUnitRegex,
  declarationExists,
  toFixed,
  walkAndReplaceValues,
}
