import type { PostcssRemToViewport, UserDefinedOptions } from './types'
import { remRegex } from './regex'
import {
  createRemReplace,
  getConfig,
  postcssPlugin,
  walkAndReplaceValues,
} from './shared'

/**
 * Convert rem to viewport units (vw by default).
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
 * import postcss from 'postcss'
 * import remToViewport from 'postcss-rem-to-viewport'
 *
 * const result = await postcss([remToViewport({
 *   rootValue: 375,
 *   transformUnit: 'vw',
 * })]).process('.a{font-size:1rem}', { from: undefined })
 */
const plugin: PostcssRemToViewport = (
  options: UserDefinedOptions = {},
) => {
  const {
    exclude,
    mediaQuery,
    minRemValue,
    propList,
    replace,
    rootValue,
    selectorBlackList,
    transformUnit,
    unitPrecision,
    disabled,
  } = getConfig(options)
  if (disabled) {
    return {
      postcssPlugin,
    }
  }

  return {
    postcssPlugin,
    Once(css) {
      const source = css.source
      const input = source!.input
      const _rootValue
        = typeof rootValue === 'function' ? rootValue(input) : rootValue
      const pxReplace = createRemReplace(
        _rootValue,
        unitPrecision,
        minRemValue,
        transformUnit,
      )

      walkAndReplaceValues({
        root: css,
        unitRegex: remRegex,
        propList,
        selectorBlackList,
        exclude,
        replace,
        mediaQuery,
        createReplacer: () => pxReplace,
        shouldProcessDecl: decl => decl.value.includes('rem'),
        shouldProcessAtRule: atRule => atRule.name === 'media' && atRule.params.includes('rem'),
      })
    },
  }
}

plugin.postcss = true

export default plugin
