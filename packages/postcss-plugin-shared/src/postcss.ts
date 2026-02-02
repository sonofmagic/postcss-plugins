import type {
  AtRule,
  ChildNode,
  Declaration,
  Input,
  Root,
  Rule,
} from 'postcss'
import {
  createExcludeMatcher,
  createPropListMatcher,
  createSelectorBlacklistMatcher,
} from './selectors'

export function declarationExists(
  decls: { some: (cb: (node: ChildNode) => boolean) => boolean },
  prop: string,
  value: string,
) {
  return decls.some((node) => {
    if (node.type !== 'decl') {
      return false
    }
    const decl = node as Declaration
    return decl.prop === prop && decl.value === value
  })
}

export interface ReplaceContext {
  root: Root
  input: Input
  filePath?: string
  decl?: Declaration
  rule?: Rule
  atRule?: AtRule
  prop?: string
  selector?: string
}

export interface WalkAndReplaceOptions {
  root: Root
  unitRegex: RegExp
  propList: readonly (string | RegExp)[]
  selectorBlackList?: readonly (string | RegExp)[]
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  replace?: boolean
  skipDuplicate?: boolean
  mediaQuery?: boolean
  createReplacer: (context: ReplaceContext) => (m: string, $1?: string) => string
  shouldProcessDecl?: (decl: Declaration) => boolean
  shouldProcessAtRule?: (atRule: AtRule) => boolean
}

export function walkAndReplaceValues(options: WalkAndReplaceOptions) {
  const {
    root,
    unitRegex,
    propList,
    selectorBlackList = [],
    exclude = [],
    replace = true,
    skipDuplicate = true,
    mediaQuery = false,
    createReplacer,
    shouldProcessDecl,
    shouldProcessAtRule,
  } = options

  const source = root.source
  const input = source?.input
  if (!input) {
    return
  }

  const filePath = input.file as string | undefined
  const excludeFn = createExcludeMatcher(exclude)
  if (filePath && excludeFn(filePath)) {
    return
  }

  const satisfyPropList = createPropListMatcher(propList)
  const unitTestRegex = new RegExp(unitRegex.source, unitRegex.flags.replace('g', ''))
  const isBlacklisted = createSelectorBlacklistMatcher(selectorBlackList, { cache: true })
  const baseContext: ReplaceContext = {
    root,
    input,
    ...(filePath === undefined ? {} : { filePath }),
  }

  root.walkDecls((decl) => {
    if (!satisfyPropList(decl.prop)) {
      return
    }
    if (shouldProcessDecl && !shouldProcessDecl(decl)) {
      return
    }
    if (!unitTestRegex.test(decl.value)) {
      return
    }
    const rule = decl.parent as Rule
    if (selectorBlackList.length > 0 && isBlacklisted(rule)) {
      return
    }

    const atRule = rule.parent?.type === 'atrule' ? (rule.parent as AtRule) : undefined
    const context: ReplaceContext = {
      ...baseContext,
      decl,
      rule,
      prop: decl.prop,
      selector: rule.selector,
      ...(atRule ? { atRule } : {}),
    }
    const replacer = createReplacer(context)
    const nextValue = decl.value.replace(unitRegex, replacer)
    if (nextValue === decl.value) {
      return
    }

    if (skipDuplicate && declarationExists(rule, decl.prop, nextValue)) {
      return
    }

    if (replace) {
      decl.value = nextValue
      return
    }

    decl.cloneAfter({ value: nextValue })
  })

  if (!mediaQuery) {
    return
  }

  const shouldProcess = shouldProcessAtRule ?? ((atRule: AtRule) => atRule.name === 'media')

  root.walkAtRules((atRule) => {
    if (!shouldProcess(atRule)) {
      return
    }
    if (!unitTestRegex.test(atRule.params)) {
      return
    }
    const context: ReplaceContext = {
      ...baseContext,
      atRule,
    }
    const replacer = createReplacer(context)
    const nextParams = atRule.params.replace(unitRegex, replacer)
    if (nextParams !== atRule.params) {
      atRule.params = nextParams
    }
  })
}
