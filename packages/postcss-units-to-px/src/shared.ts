import {
  createConfigGetter,
  createExcludeMatcher,
  createPropListMatcher,
  createUnitRegex,
  declarationExists,
  maybeBlacklistedSelector,
  toFixed,
} from 'postcss-plugin-shared'
import { name as packageName } from '../package.json'
import { defaultOptions } from './defaults'

export const postcssPlugin = packageName

export const getConfig = createConfigGetter(defaultOptions)

export const blacklistedSelector = maybeBlacklistedSelector

export {
  createExcludeMatcher,
  createPropListMatcher,
  createUnitRegex,
  declarationExists,
  toFixed,
}
