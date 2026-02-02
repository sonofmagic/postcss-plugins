import type { PostcssRemToViewport, UserDefinedOptions } from './types'
import { remRegex } from './regex'
import {
  createRemReplace,
  getConfig,
  postcssPlugin,
  walkAndReplaceValues,
} from './shared'

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
