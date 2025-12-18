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
