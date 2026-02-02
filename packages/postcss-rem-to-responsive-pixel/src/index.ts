import type { Input, Root } from 'postcss'
import type { PostcssRemToResponsivePixel, UserDefinedOptions } from './types'
import { remRegex } from './regex'
import {
  createRemReplace,
  getConfig,
  postcssPlugin,
  walkAndReplaceValues,
} from './shared'

export * from './types'
const plugin: PostcssRemToResponsivePixel = (
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
    processorStage,
  } = getConfig(options)
  if (disabled) {
    return {
      postcssPlugin,
    }
  }
  const isRootValueFn = typeof rootValue === 'function'
  const staticReplace = isRootValueFn
    ? undefined
    : createRemReplace(rootValue, unitPrecision, minRemValue, transformUnit)

  return {
    postcssPlugin,
    [processorStage]: (css: Root) => {
      const source = css.source
      const input = source?.input
      if (!input) {
        return
      }
      const pxReplace = isRootValueFn
        ? createRemReplace(
            (rootValue as (input: Input) => number)(input!),
            unitPrecision,
            minRemValue,
            transformUnit,
          )
        : staticReplace!
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
