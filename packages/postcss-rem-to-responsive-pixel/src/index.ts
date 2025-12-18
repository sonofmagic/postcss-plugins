import type { Input, Root, Rule } from 'postcss'
import type { PostcssRemToResponsivePixel, UserDefinedOptions } from './types'
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
  const satisfyPropList = createPropListMatcher(propList)
  const excludeFn = createExcludeMatcher(exclude)
  const hasSelectorBlacklist = selectorBlackList.length > 0
  const shouldClone = !replace
  const shouldProcessMedia = mediaQuery
  const isRootValueFn = typeof rootValue === 'function'
  const staticReplace = isRootValueFn
    ? undefined
    : createRemReplace(rootValue, unitPrecision, minRemValue, transformUnit)

  return {
    postcssPlugin,
    [processorStage]: (css: Root) => {
      const source = css.source
      const input = source?.input
      const filePath = input?.file as string | undefined
      if (filePath && excludeFn(filePath)) {
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

      css.walkDecls((decl) => {
        const value = decl.value
        if (
          !value.includes('rem')
          || !satisfyPropList(decl.prop)
        ) {
          return
        }
        const rule = decl.parent as Rule
        if (hasSelectorBlacklist && blacklistedSelector(selectorBlackList, rule.selector)) {
          return
        }

        const nextValue = value.replace(remRegex, pxReplace)
        if (nextValue === value) {
          return
        }

        if (declarationExists(rule, decl.prop, nextValue)) {
          return
        }

        if (shouldClone) {
          decl.cloneAfter({ value: nextValue })
        }
        else {
          decl.value = nextValue
        }
      })

      if (shouldProcessMedia) {
        css.walkAtRules('media', (atRule) => {
          if (!atRule.params.includes('rem')) {
            return
          }
          const nextParams = atRule.params.replace(remRegex, pxReplace)
          if (nextParams !== atRule.params) {
            atRule.params = nextParams
          }
        })
      }
    },
  }
}

plugin.postcss = true

export default plugin
