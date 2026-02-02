import type {
  PostcssUnitsToPx,
  TransformContext,
  UnitMap,
  UnitMatcher,
  UnitRule,
  UserDefinedOptions,
} from './types'
import { defaultUnitMap } from './defaults'
import {
  createUnitRegex,
  getConfig,
  postcssPlugin,
  toFixed,
  walkAndReplaceValues,
} from './shared'

interface StringMatcherEntry {
  matcher: string
  rule: UnitRule
  type: 'string'
  unit: string
}

interface RegexMatcherEntry {
  matcher: RegExp
  rule: UnitRule
  type: 'regex'
}

interface FunctionMatcherEntry {
  matcher: (unit: string) => boolean
  rule: UnitRule
  type: 'function'
}

type NormalizedMatcher = StringMatcherEntry | RegexMatcherEntry | FunctionMatcherEntry

const DEFAULT_NUMBER_PATTERN = String.raw`\d+(?:\.\d+)?|\.\d+`

function createAnyUnitRegex() {
  const parts: string[] = [
    String.raw`"[^"]+"`,
    String.raw`'[^']+'`,
    String.raw`url\([^)]+\)`,
    String.raw`var\([^)]+\)`,
    String.raw`(${DEFAULT_NUMBER_PATTERN})([a-zA-Z%]+)`,
  ]
  return new RegExp(parts.join('|'), 'g')
}

function normalizeRule(rule: UnitRule | undefined) {
  return rule === undefined ? null : rule
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function normalizeMatchers(unitMap: UnitMap) {
  const entries: NormalizedMatcher[] = []
  const addEntry = (matcher: UnitMatcher, rule: UnitRule | undefined) => {
    const normalizedRule = normalizeRule(rule)
    if (typeof matcher === 'string') {
      const unit = matcher.trim().toLowerCase()
      if (!unit) {
        return
      }
      entries.push({
        matcher: unit,
        rule: normalizedRule,
        type: 'string',
        unit,
      })
      return
    }
    if (matcher instanceof RegExp) {
      entries.push({
        matcher,
        rule: normalizedRule,
        type: 'regex',
      })
      return
    }
    if (typeof matcher === 'function') {
      entries.push({
        matcher,
        rule: normalizedRule,
        type: 'function',
      })
    }
  }

  if (Array.isArray(unitMap)) {
    for (const entry of unitMap) {
      if (!entry) {
        continue
      }
      const [matcher, rule] = entry
      addEntry(matcher, rule)
    }
  }
  else if (unitMap instanceof Map) {
    for (const [matcher, rule] of unitMap.entries()) {
      addEntry(matcher, rule)
    }
  }
  else {
    for (const [unit, rule] of Object.entries(unitMap)) {
      addEntry(unit, rule as UnitRule | undefined)
    }
  }

  const hasComplexMatcher = entries.some(entry => entry.type !== 'string')

  if (hasComplexMatcher) {
    return {
      entries,
      unitMap: undefined,
      hasComplexMatcher,
    }
  }

  const normalized = new Map<string, UnitRule>()
  for (const entry of entries) {
    if (entry.type !== 'string') {
      continue
    }
    if (!normalized.has(entry.unit)) {
      normalized.set(entry.unit, entry.rule)
    }
  }

  return {
    entries,
    unitMap: normalized,
    hasComplexMatcher,
  }
}

function getUnitsForRegex(unitMap: Map<string, UnitRule>) {
  return Array.from(unitMap.keys()).sort((a, b) => b.length - a.length)
}

function createReplace(
  getRule: (unit: string) => UnitRule | undefined,
  unitPrecision: number,
  minValue: number,
  transform: UserDefinedOptions['transform'],
  context: TransformContext,
) {
  const shouldRound = unitPrecision >= 0 && unitPrecision <= 100

  return function replace(m: string, $1?: string, $2?: string) {
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

    const unit = (typeof $2 === 'string' ? $2 : m.slice($1.length)).toLowerCase()
    const rule = getRule(unit)
    let pxValue: number | undefined

    if (rule === undefined) {
      return m
    }

    if (rule === false) {
      return m
    }

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

/**
 * Convert multiple CSS units to px based on a unit map and optional transform.
 *
 * Defaults:
 * - unitMap: { rem: 16, em: 16, vw: 3.75, vh: 6.67, vmin: 3.75, vmax: 6.67, rpx: 0.5 }
 * - unitPrecision: 5
 * - propList: ['*']
 * - replace: true
 * - mediaQuery: false
 * - minValue: 0
 * - exclude: [/node_modules/i]
 * - disabled: false
 *
 * @example
 * import postcss from 'postcss'
 * import unitsToPx from 'postcss-units-to-px'
 *
 * const result = await postcss([unitsToPx({
 *   unitMap: { rem: 16, vw: 3.75 },
 *   transform: (value, unit) => (unit === 'em' ? value * 12 : value * 16),
 * })]).process('.a{margin:1rem 1vw}', { from: undefined })
 */
const plugin: PostcssUnitsToPx = (options: UserDefinedOptions = {}) => {
  const resolved = getConfig(options)
  const {
    transform,
    unitPrecision,
    minValue,
    selectorBlackList,
    propList,
    replace,
    mediaQuery,
    exclude,
    disabled,
  } = resolved

  const userUnitMap = options.unitMap
  const mergedUnitMap: UnitMap = userUnitMap === undefined
    ? defaultUnitMap
    : isPlainObject(userUnitMap)
      ? {
          ...defaultUnitMap,
          ...userUnitMap,
        }
      : userUnitMap

  if (disabled || transform === false) {
    return { postcssPlugin }
  }

  const { entries, unitMap: normalizedUnitMap, hasComplexMatcher } = normalizeMatchers(mergedUnitMap)
  if (entries.length === 0) {
    return { postcssPlugin }
  }

  let unitRegex: RegExp
  let getRule: (unit: string) => UnitRule | undefined

  if (hasComplexMatcher) {
    unitRegex = createAnyUnitRegex()
    getRule = (unit) => {
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
        if (entry.type === 'function') {
          if (entry.matcher(unit)) {
            return entry.rule
          }
        }
      }
      return undefined
    }
  }
  else {
    const units = getUnitsForRegex(normalizedUnitMap ?? new Map())
    if (units.length === 0) {
      return { postcssPlugin }
    }
    unitRegex = createUnitRegex({ units })
    getRule = unit => normalizedUnitMap?.get(unit)
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
            transform,
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
