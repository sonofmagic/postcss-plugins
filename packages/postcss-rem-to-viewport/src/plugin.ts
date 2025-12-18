import type { Rule } from 'postcss'
import type { PostcssRemToViewport, UserDefinedOptions } from './types'
import { remRegex } from './regex'
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
  const hasSelectorBlacklist = selectorBlackList.length > 0

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

      const selectorBlacklistCache: WeakMap<Rule, boolean> | undefined = hasSelectorBlacklist
        ? new WeakMap()
        : undefined

      css.walkDecls((decl) => {
        if (
          !decl.value.includes('rem')
          || !satisfyPropList(decl.prop)
        ) {
          return
        }

        const rule = decl.parent as Rule
        if (selectorBlacklistCache) {
          const cached = selectorBlacklistCache.get(rule)
          const isBlacklisted = cached ?? Boolean(blacklistedSelector(selectorBlackList, rule.selector))
          if (cached === undefined) {
            selectorBlacklistCache.set(rule, isBlacklisted)
          }
          if (isBlacklisted) {
            return
          }
        }

        const value = decl.value.replace(remRegex, pxReplace)

        if (value === decl.value) {
          return
        }

        if ((rule.nodes?.length ?? 0) > 1 && declarationExists(rule, decl.prop, value)) {
          return
        }

        if (replace) {
          decl.value = value
          return
        }

        decl.cloneAfter({ value })
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
