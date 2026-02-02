import type {
  PostcssUnitsToPx,
  TransformContext,
  UnitMap,
  UnitTransform,
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

type UnitRule = number | UnitTransform | null | false

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

  const mergedUnitMap = {
    ...defaultUnitMap,
    ...(options.unitMap ?? {}),
  }

  if (disabled || transform === false) {
    return { postcssPlugin }
  }

  const normalizedUnitMap = normalizeUnitMap(mergedUnitMap)
  const units = getUnitsForRegex(normalizedUnitMap)
  if (units.length === 0) {
    return { postcssPlugin }
  }

  const unitRegex = createUnitRegex({ units })

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
            normalizedUnitMap,
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
