import type {
  PostcssUnitsToPx,
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
  context: Parameters<NonNullable<UserDefinedOptions['transform']>>[2],
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

  if (disabled) {
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
