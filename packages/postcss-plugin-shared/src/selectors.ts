import type { Rule } from 'postcss'

/**
 * Check whether a selector matches any blacklist rule.
 *
 * @example
 * blacklistedSelector(['.ignore', /\\.skip-/], '.ignore .btn') // true
 */
export function blacklistedSelector(
  blacklist: readonly (string | RegExp)[],
  selector?: string,
) {
  if (typeof selector !== 'string') {
    return false
  }
  return blacklist.some((rule) => {
    if (typeof rule === 'string') {
      return selector.includes(rule)
    }
    return Boolean(selector.match(rule))
  })
}

/**
 * Check whether a selector is blacklisted; returns undefined for non-string selectors.
 *
 * @example
 * maybeBlacklistedSelector(['.ignore'], '.ignore .btn') // true
 */
export function maybeBlacklistedSelector(
  blacklist: readonly (string | RegExp)[],
  selector?: string,
): boolean | undefined {
  if (typeof selector !== 'string') {
    return undefined
  }
  return blacklistedSelector(blacklist, selector)
}

/**
 * Options for selector blacklist matcher creation.
 *
 * @default { cache: true }
 */
export interface SelectorBlacklistMatcherOptions {
  cache?: boolean
}

/**
 * Create a matcher that checks whether a Rule selector is blacklisted.
 *
 * @example
 * const isBlacklisted = createSelectorBlacklistMatcher(['.ignore'])
 * isBlacklisted(rule)
 */
export function createSelectorBlacklistMatcher(
  blacklist: readonly (string | RegExp)[],
  options: SelectorBlacklistMatcherOptions = {},
) {
  const useCache = options.cache ?? true
  const cache = useCache ? new WeakMap<Rule, boolean>() : undefined

  return function isBlacklisted(rule: Rule) {
    if (blacklist.length === 0) {
      return false
    }
    if (cache) {
      const cached = cache.get(rule)
      if (cached !== undefined) {
        return cached
      }
      const value = Boolean(maybeBlacklistedSelector(blacklist, rule.selector))
      cache.set(rule, value)
      return value
    }
    return Boolean(maybeBlacklistedSelector(blacklist, rule.selector))
  }
}

/**
 * Create a matcher that checks whether a declaration property is included.
 *
 * @example
 * const matchProp = createPropListMatcher(['font', /size/])
 * matchProp('font-size') // true
 */
export function createPropListMatcher(propList: readonly (string | RegExp)[]) {
  const hasWild = propList.includes('*')
  return function satisfyPropList(prop: string) {
    if (hasWild) {
      return true
    }
    return propList.some((rule) => {
      if (typeof rule === 'string') {
        return prop.includes(rule)
      }
      return Boolean(prop.match(rule))
    })
  }
}

function filterPropList(list: readonly string[]) {
  return {
    exact: list.filter(m => /^[^*!]+$/.test(m)),
    contain: list
      .filter(m => /^\*.+\*$/.test(m))
      .map(m => m.substring(1, m.length - 1)),
    endWith: list
      .filter(m => /^\*[^*]+$/.test(m))
      .map(m => m.substring(1)),
    startWith: list
      .filter(m => /^[^*!]+\*$/.test(m))
      .map(m => m.substring(0, m.length - 1)),
    notExact: list
      .filter(m => /^![^*].*$/.test(m))
      .map(m => m.substring(1)),
    notContain: list
      .filter(m => /^!\*.+\*$/.test(m))
      .map(m => m.substring(2, m.length - 1)),
    notEndWith: list
      .filter(m => /^!\*[^*]+$/.test(m))
      .map(m => m.substring(2)),
    notStartWith: list
      .filter(m => /^![^*]+\*$/.test(m))
      .map(m => m.substring(1, m.length - 1)),
  }
}

/**
 * Create a matcher that supports advanced prop list patterns.
 *
 * @example
 * const matchProp = createAdvancedPropListMatcher(['*', '!border*'])
 * matchProp('padding') // true
 * matchProp('border-color') // false
 */
export function createAdvancedPropListMatcher(propList: readonly string[]) {
  const hasWild = propList.includes('*')
  const matchAll = hasWild && propList.length === 1
  const lists = filterPropList(propList)

  return function satisfyPropList(prop: string) {
    if (matchAll) {
      return true
    }

    const shouldInclude = (
      hasWild
      || lists.exact.includes(prop)
      || lists.contain.some(m => prop.includes(m))
      || lists.startWith.some(m => prop.startsWith(m))
      || lists.endWith.some(m => prop.endsWith(m))
    )

    const shouldExclude = (
      lists.notExact.includes(prop)
      || lists.notContain.some(m => prop.includes(m))
      || lists.notStartWith.some(m => prop.startsWith(m))
      || lists.notEndWith.some(m => prop.endsWith(m))
    )

    return shouldInclude && !shouldExclude
  }
}

/**
 * Create a matcher that checks whether a file path is excluded.
 *
 * @example
 * const isExcluded = createExcludeMatcher([/node_modules/])
 * isExcluded('/project/node_modules/foo.css') // true
 */
export function createExcludeMatcher(
  exclude: (string | RegExp)[] | ((filePath: string) => boolean),
) {
  return function isExcluded(filepath: string | undefined) {
    if (filepath === undefined) {
      return false
    }
    return Array.isArray(exclude)
      ? exclude.some((rule) => {
          if (typeof rule === 'string') {
            return filepath.includes(rule)
          }
          return Boolean(filepath.match(rule))
        })
      : exclude(filepath)
  }
}
