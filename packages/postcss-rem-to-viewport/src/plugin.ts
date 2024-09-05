import type { Rule } from 'postcss'
import { remRegex } from './regex'
import type { PostcssRemToViewport, UserDefinedOptions } from './types'
import {
  blacklistedSelector,
  createExcludeMatcher,
  createPropListMatcher,
  createRemReplace,
  declarationExists,
  getConfig,
  postcssPlugin,
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
  const satisfyPropList = createPropListMatcher(propList)
  const excludeFn = createExcludeMatcher(exclude)

  return {
    postcssPlugin,
    Once(css) {
      const source = css.source
      const input = source!.input
      const filePath = input.file as string
      const isExcludeFile = excludeFn(filePath)
      if (isExcludeFile) {
        return
      }
      const _rootValue
        = typeof rootValue === 'function' ? rootValue(input) : rootValue
      const pxReplace = createRemReplace(
        _rootValue,
        unitPrecision,
        minRemValue,
        transformUnit,
      )

      css.walkDecls((decl) => {
        const rule = decl.parent as Rule
        if (
          !decl.value.includes('rem')
          || !satisfyPropList(decl.prop)
          || blacklistedSelector(selectorBlackList, rule.selector)
        ) {
          return
        }

        const value = decl.value.replace(remRegex, pxReplace)

        if (declarationExists(rule, decl.prop, value)) {
          return
        }

        if (replace) {
          decl.value = value
        }
        else {
          decl.cloneAfter({ value })
        }
      })

      css.walkAtRules((atRule) => {
        if (mediaQuery && atRule.name === 'media') {
          if (!atRule.params.includes('rem')) {
            return
          }
          atRule.params = atRule.params.replace(remRegex, pxReplace)
        }
      })
    },
  }
}

plugin.postcss = true

export default plugin
