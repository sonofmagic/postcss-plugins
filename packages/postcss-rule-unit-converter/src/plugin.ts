import type {
  ConversionRule,
  PostcssUnitConverter,
  RuleContext,
  UnitMatcher,
  UserDefinedOptions,
} from './types'
import {
  createAnyUnitRegex,
  createUnitRegex,
  getConfig,
  postcssPlugin,
  toFixed,
  walkAndReplaceValues,
} from './shared'

interface StringMatcherEntry {
  matcher: string
  rule: ConversionRule
  type: 'string'
  unit: string
}

interface RegexMatcherEntry {
  matcher: RegExp
  rule: ConversionRule
  type: 'regex'
}

interface FunctionMatcherEntry {
  matcher: (unit: string) => boolean
  rule: ConversionRule
  type: 'function'
}

type NormalizedMatcher = StringMatcherEntry | RegexMatcherEntry | FunctionMatcherEntry

function normalizeMatcher(matcher: UnitMatcher, rule: ConversionRule) {
  if (typeof matcher === 'string') {
    const unit = matcher.trim().toLowerCase()
    if (!unit) {
      return null
    }
    return {
      matcher: unit,
      rule,
      type: 'string',
      unit,
    } satisfies StringMatcherEntry
  }

  if (matcher instanceof RegExp) {
    return {
      matcher,
      rule,
      type: 'regex',
    } satisfies RegexMatcherEntry
  }

  if (typeof matcher === 'function') {
    return {
      matcher,
      rule,
      type: 'function',
    } satisfies FunctionMatcherEntry
  }

  return null
}

function normalizeRules(rules: readonly ConversionRule[]) {
  const entries: NormalizedMatcher[] = []

  for (const rule of rules) {
    const entry = normalizeMatcher(rule.from, rule)
    if (entry) {
      entries.push(entry)
    }
  }

  const hasComplexMatcher = entries.some(entry => entry.type !== 'string')
  if (hasComplexMatcher) {
    return {
      entries,
      stringRules: undefined,
      hasComplexMatcher,
    }
  }

  const stringRules = new Map<string, ConversionRule>()
  for (const entry of entries) {
    if (entry.type === 'string' && !stringRules.has(entry.unit)) {
      stringRules.set(entry.unit, entry.rule)
    }
  }

  return {
    entries,
    stringRules,
    hasComplexMatcher,
  }
}

function getMatcherRule(entries: readonly NormalizedMatcher[], unit: string) {
  for (const entry of entries) {
    if (entry.type === 'string') {
      if (entry.unit === unit) {
        return entry.rule
      }
      continue
    }

    if (entry.type === 'regex') {
      if (entry.matcher.global || entry.matcher.sticky) {
        entry.matcher.lastIndex = 0
      }
      if (entry.matcher.test(unit)) {
        return entry.rule
      }
      continue
    }

    if (entry.matcher(unit)) {
      return entry.rule
    }
  }

  return undefined
}

function normalizeTransformResult(
  result: number | { value: number, unit?: string } | undefined,
  fallbackUnit: string,
) {
  if (result === undefined || Number.isNaN(result)) {
    return null
  }

  if (typeof result === 'number') {
    return {
      unit: fallbackUnit,
      value: result,
    }
  }

  if (Number.isNaN(result.value)) {
    return null
  }

  return {
    unit: result.unit ?? fallbackUnit,
    value: result.value,
  }
}

function createReplace(
  getRule: (unit: string) => ConversionRule | undefined,
  unitPrecision: number,
  minValue: number,
  context: Omit<RuleContext, 'fromUnit'>,
) {
  const shouldRound = unitPrecision >= 0 && unitPrecision <= 100

  return function replace(m: string, $1?: string, $2?: string) {
    if (!$1 || !$2) {
      return m
    }

    const value = Number($1)
    if (Number.isNaN(value)) {
      return m
    }

    const fromUnit = $2.toLowerCase()
    const rule = getRule(fromUnit)
    if (!rule) {
      return m
    }

    const effectiveMinValue = rule.minValue ?? minValue
    if (value < effectiveMinValue) {
      return m
    }

    const ruleContext: RuleContext = {
      ...context,
      fromUnit,
    }

    const fallbackUnit = rule.to ?? fromUnit
    const normalized = normalizeTransformResult(
      typeof rule.transform === 'function'
        ? rule.transform(value, ruleContext)
        : typeof rule.factor === 'number'
          ? value * rule.factor
          : undefined,
      fallbackUnit,
    )

    if (!normalized) {
      return m
    }

    const roundedValue = shouldRound ? toFixed(normalized.value, unitPrecision) : normalized.value
    if (roundedValue === 0) {
      return '0'
    }

    return `${roundedValue}${normalized.unit}`
  }
}

const plugin: PostcssUnitConverter = (options: UserDefinedOptions = {}) => {
  const resolved = getConfig(options)
  const {
    rules,
    unitPrecision,
    minValue,
    selectorBlackList,
    propList,
    replace,
    mediaQuery,
    exclude,
    disabled,
  } = resolved

  if (disabled || rules.length === 0) {
    return { postcssPlugin }
  }

  const { entries, stringRules, hasComplexMatcher } = normalizeRules(rules)
  if (entries.length === 0) {
    return { postcssPlugin }
  }

  let unitRegex: RegExp
  let getRule: (unit: string) => ConversionRule | undefined

  if (hasComplexMatcher) {
    unitRegex = createAnyUnitRegex()
    getRule = unit => getMatcherRule(entries, unit)
  }
  else {
    const units = Array.from(stringRules?.keys() ?? []).sort((a, b) => b.length - a.length)
    if (units.length === 0) {
      return { postcssPlugin }
    }
    unitRegex = createUnitRegex(units)
    getRule = unit => stringRules?.get(unit)
  }

  return {
    postcssPlugin,
    Once(css) {
      walkAndReplaceValues({
        root: css,
        unitRegex,
        propList,
        selectorBlackList,
        exclude,
        replace,
        mediaQuery,
        createReplacer: (context) => {
          return createReplace(
            getRule,
            unitPrecision,
            minValue,
            context,
          )
        },
        shouldProcessAtRule: atRule => atRule.name === 'media',
      })
    },
  }
}

plugin.postcss = true

export default plugin
