import type { AtRule, Rule } from 'postcss'
import type {
  PostcssUnitsToPx,
  TransformContext,
  UnitMap,
  UnitTransform,
  UserDefinedOptions,
} from './types'
import {
  blacklistedSelector,
  createExcludeMatcher,
  createPropListMatcher,
  createUnitRegex,
  declarationExists,
  getConfig,
  postcssPlugin,
  toFixed,
} from './shared'

type UnitRule = number | UnitTransform | null

function normalizeUnitMap(unitMap: UnitMap) {
  const normalized = new Map<string, UnitRule>()
  for (const [unit, rule] of Object.entries(unitMap)) {
    const key = unit.trim().toLowerCase()
    if (!key) {
      continue
    }
    normalized.set(key, rule ?? null)
  }
  return normalized
}

function getUnitsForRegex(unitMap: Map<string, UnitRule>) {
  return Array.from(unitMap.keys()).sort((a, b) => b.length - a.length)
}

function createReplace(
  unitMap: Map<string, UnitRule>,
  unitPrecision: number,
  minValue: number,
  transform: UserDefinedOptions['transform'],
  context: TransformContext,
) {
  const shouldRound = unitPrecision >= 0 && unitPrecision <= 100

  return function replace(m: string, $1?: string) {
    if (!$1) {
      return m
    }

    const value = Number($1)
    if (Number.isNaN(value)) {
      return m
    }

    if (value < minValue) {
      return m
    }

    const unit = m.slice($1.length).toLowerCase()
    const rule = unitMap.get(unit)
    let pxValue: number | undefined

    if (typeof rule === 'function') {
      pxValue = rule(value, context)
    }
    else if (typeof rule === 'number') {
      pxValue = value * rule
    }
    else if (transform) {
      pxValue = transform(value, unit, context)
    }
    else {
      return m
    }

    if (pxValue === undefined || Number.isNaN(pxValue)) {
      return m
    }

    const roundedValue = shouldRound ? toFixed(pxValue, unitPrecision) : pxValue
    if (roundedValue === 0) {
      return '0'
    }

    return `${roundedValue}px`
  }
}

const plugin: PostcssUnitsToPx = (options: UserDefinedOptions = {}) => {
  const {
    unitMap: mergedUnitMap,
    transform,
    unitPrecision,
    minValue,
    selectorBlackList,
    propList,
    replace,
    mediaQuery,
    exclude,
    disabled,
  } = getConfig(options)

  if (disabled) {
    return { postcssPlugin }
  }

  const normalizedUnitMap = normalizeUnitMap(mergedUnitMap)
  const units = getUnitsForRegex(normalizedUnitMap)
  if (units.length === 0) {
    return { postcssPlugin }
  }

  const unitRegex = createUnitRegex({ units })
  const unitTestRegex = new RegExp(unitRegex.source, unitRegex.flags.replace('g', ''))
  const satisfyPropList = createPropListMatcher(propList)
  const excludeFn = createExcludeMatcher(exclude)
  const hasSelectorBlacklist = selectorBlackList.length > 0

  return {
    postcssPlugin,
    Once(css) {
      const source = css.source
      const input = source!.input
      const filePath = input.file as string | undefined

      if (excludeFn(filePath)) {
        return
      }

      const selectorBlacklistCache: WeakMap<Rule, boolean> | undefined = hasSelectorBlacklist
        ? new WeakMap()
        : undefined

      css.walkDecls((decl) => {
        if (!satisfyPropList(decl.prop) || !unitTestRegex.test(decl.value)) {
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

        const context: TransformContext = {
          root: css,
          input,
          filePath,
          decl,
          rule,
          atRule: rule.parent?.type === 'atrule' ? (rule.parent as AtRule) : undefined,
          prop: decl.prop,
          selector: rule.selector,
        }
        const replacer = createReplace(
          normalizedUnitMap,
          unitPrecision,
          minValue,
          transform,
          context,
        )
        const value = decl.value.replace(unitRegex, replacer)

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
        if (!mediaQuery || atRule.name !== 'media') {
          return
        }
        if (!unitTestRegex.test(atRule.params)) {
          return
        }

        const context: TransformContext = {
          root: css,
          input,
          filePath,
          atRule,
        }
        const replacer = createReplace(
          normalizedUnitMap,
          unitPrecision,
          minValue,
          transform,
          context,
        )
        atRule.params = atRule.params.replace(unitRegex, replacer)
      })
    },
  }
}

plugin.postcss = true

export default plugin
