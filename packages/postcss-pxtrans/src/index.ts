import type {
  AtRule,
  Comment,
  Declaration,
  Input,
  Result,
  Rule,
} from 'postcss'
import type { PxTransformOptions, PxTransformTargetUnit } from './types'
import { blacklistedSelector, declarationExists } from 'postcss-plugin-shared'
import { filterPropList } from './filter-prop-list'
import { pxRegex } from './pixel-unit-regex'

export { createDirectivePlugin } from './directives'
export * from './types'

const defaults = {
  methods: ['platform', 'size'] as const,
  rootValue: 16,
  unitPrecision: 5,
  selectorBlackList: [] as Array<string | RegExp>,
  propList: ['*'] as string[],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
}

const deviceRatio = {
  375: 2,
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2,
} as const

const DEFAULT_WEAPP_OPTIONS = {
  platform: 'weapp',
  designWidth: 750,
  deviceRatio,
} as const

const processed = Symbol('processed')
const SPECIAL_PIXEL = ['Px', 'PX', 'pX'] as const
const SPECIAL_PIXEL_SET = new Set<string>(SPECIAL_PIXEL)
const pxTestRE = /px/i

type RootValueFn = (input: Input, m: string, value: string) => number

function normalizeRootValue(value: unknown): RootValueFn {
  if (typeof value === 'function') {
    return value as RootValueFn
  }
  if (typeof value === 'number') {
    return () => value
  }
  /* c8 ignore next */
  return () => defaults.rootValue
}

function createRoundWithPrecision(precision: number) {
  if (precision < 0 || precision > 100) {
    return (value: number) => value
  }
  const multiplier = 10 ** (precision + 1)
  const divider = multiplier * 0.1
  return (value: number) => {
    const wholeNumber = Math.floor(value * multiplier)
    return Math.round(wholeNumber / 10) / divider
  }
}

function createPropListMatcher(propList: readonly string[]) {
  const hasWild = propList.includes('*')
  const matchAll = hasWild && propList.length === 1
  const lists = {
    exact: filterPropList.exact(propList),
    contain: filterPropList.contain(propList),
    startWith: filterPropList.startWith(propList),
    endWith: filterPropList.endWith(propList),
    notExact: filterPropList.notExact(propList),
    notContain: filterPropList.notContain(propList),
    notStartWith: filterPropList.notStartWith(propList),
    notEndWith: filterPropList.notEndWith(propList),
  }

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

function createPxReplace(
  rootValue: RootValueFn,
  unitPrecision: number,
  minPixelValue: number,
  onePxTransform: boolean,
  platform: string,
  targetUnit: PxTransformTargetUnit,
  unConvertTargetUnit: string | undefined,
) {
  const specialUnits = SPECIAL_PIXEL_SET
  const isHarmony = platform === 'harmony'
  const preserveUnit = unConvertTargetUnit ?? targetUnit
  const roundWithPrecision = createRoundWithPrecision(unitPrecision)

  return function createFileReplace(input: Input) {
    return function replace(m: string, $1?: string) {
      if (!$1) {
        return m
      }

      if (isHarmony && specialUnits.has(m.slice(-2))) {
        return `${$1}${preserveUnit}`
      }

      const pixels = Number.parseFloat($1)
      if (!onePxTransform && pixels === 1) {
        return isHarmony ? `${$1}${preserveUnit}` : m
      }

      if (pixels < minPixelValue) {
        return isHarmony ? `${$1}${preserveUnit}` : m
      }

      let val = pixels / rootValue(input, m, $1)
      /* c8 ignore next */
      if (unitPrecision >= 0 && unitPrecision <= 100) {
        val = roundWithPrecision(val)
      }
      // 不带单位不支持在calc表达式中参与计算(https://github.com/NervJS/taro/issues/12607)
      return `${val}${targetUnit}`
    }
  }
}

const postcssPlugin = 'postcss-pxtrans'

function plugin(userOptions: PxTransformOptions = {}) {
  const options: Record<string, any> = Object.assign({}, DEFAULT_WEAPP_OPTIONS, userOptions)

  const exclude: PxTransformOptions['exclude'] = options.exclude
  const transUnits: string[] = ['px']
  const baseFontSize
    = options.baseFontSize
      || (options.minRootSize >= 1 ? options.minRootSize : 20)

  const designWidth = (input: Input) =>
    typeof options.designWidth === 'function'
      ? options.designWidth(input)
      : options.designWidth

  let targetUnit: PxTransformTargetUnit
  let unConvertTargetUnit: string | undefined
  let computedRootValue: RootValueFn | number | undefined

  /* c8 ignore start */
  const platform = options.platform
  switch (platform) {
    case 'h5': {
      targetUnit = (options.targetUnit ?? 'rem') as PxTransformTargetUnit

      switch (targetUnit) {
        case 'vw':
        case 'vmin':
          computedRootValue = (input: Input) => designWidth(input) / 100
          break
        case 'px':
          computedRootValue = (input: Input) =>
            (1 / options.deviceRatio[designWidth(input)]) * 2
          break
        default:
          computedRootValue = (input: Input) =>
            (baseFontSize / options.deviceRatio[designWidth(input)]) * 2
          break
      }

      transUnits.push('rpx')
      break
    }
    case 'rn': {
      computedRootValue = (input: Input) =>
        (1 / options.deviceRatio[designWidth(input)]) * 2
      targetUnit = 'px'
      break
    }
    case 'quickapp': {
      computedRootValue = () => 1
      targetUnit = 'px'
      break
    }
    case 'harmony': {
      /* c8 ignore start */
      computedRootValue = (input: Input) =>
        1 / options.deviceRatio[designWidth(input)]
      targetUnit = 'px'
      unConvertTargetUnit = 'ch'
      transUnits.push(...SPECIAL_PIXEL)
      break
      /* c8 ignore end */
    }
    default: {
      targetUnit = (options.targetUnit ?? 'rpx') as PxTransformTargetUnit
      if (targetUnit === 'rem') {
        computedRootValue = (input: Input) =>
          (baseFontSize / options.deviceRatio[designWidth(input)]) * 2
      }
      else if (targetUnit === 'px') {
        computedRootValue = (input: Input) =>
          (1 / options.deviceRatio[designWidth(input)]) * 2
      }
      else {
        computedRootValue = (input: Input) =>
          1 / options.deviceRatio[designWidth(input)]
      }
    }
  }
  /* c8 ignore end */

  /* c8 ignore start */
  const resolvedRootValue = typeof userOptions.rootValue !== 'undefined'
    ? userOptions.rootValue
    : computedRootValue ?? defaults.rootValue
  const cacheComputedRootValue
    = typeof userOptions.rootValue === 'undefined'
      && typeof resolvedRootValue === 'function'
      && (resolvedRootValue as RootValueFn).length <= 1

  const opts = {
    ...defaults,
    ...options,
    rootValue: resolvedRootValue as number | RootValueFn,
  } as PxTransformOptions & {
    rootValue: number | RootValueFn
    methods: typeof defaults.methods
  }
  const onePxTransform
    = typeof options.onePxTransform === 'undefined'
      ? true
      : options.onePxTransform

  const pxRgx = pxRegex(transUnits)
  const satisfyPropList = createPropListMatcher(opts.propList ?? defaults.propList)
  const unitPrecision = opts.unitPrecision ?? defaults.unitPrecision
  const minPixelValue = opts.minPixelValue ?? defaults.minPixelValue
  const shouldHandleSize = opts.methods.includes('size')
  const shouldHandleMedia = shouldHandleSize && Boolean(opts.mediaQuery)
  const hasSelectorBlackList = Boolean(opts.selectorBlackList?.length)
  /* c8 ignore end */

  return {
    postcssPlugin,
    prepare(result: Result) {
      const root = result.root
      const input = root?.source?.input
      if (!input) {
        return {}
      }

      root.walkComments((comment: Comment) => {
        if (comment.text === 'postcss-pxtrans disable') {
          root.raws.__pxtransSkip = true
          return false
        }
        return undefined
      })

      const rootValue = cacheComputedRootValue
        ? (() => {
            const cached = (opts.rootValue as RootValueFn)(input, '', '')
            return () => cached
          })()
        : normalizeRootValue(opts.rootValue)
      const pxReplace = createPxReplace(
        rootValue,
        unitPrecision,
        minPixelValue,
        onePxTransform,
        platform,
        targetUnit,
        unConvertTargetUnit,
      )(input)

      const shouldSkip = () => Boolean(result.root?.raws?.__pxtransSkip)
      const blacklistedCache = hasSelectorBlackList ? new WeakMap<Rule, boolean>() : null
      const isExcluded = exclude && exclude(result.opts.from)

      if (shouldSkip()) {
        return {}
      }

      if (isExcluded) {
        return {}
      }

      return {
        Declaration(decl: Declaration) {
          if (shouldSkip()) {
            return
          }
          if (!shouldHandleSize) {
            return
          }

          if ((decl as any)[processed]) {
            return
          }
          ;(decl as any)[processed] = true

          if (!pxTestRE.test(decl.value)) {
            return
          }

          if (!satisfyPropList(decl.prop)) {
            return
          }

          const parent = decl.parent as Rule | undefined
          let isBlacklisted = false
          if (hasSelectorBlackList && parent) {
            const cached = blacklistedCache?.get(parent)
            if (cached !== undefined) {
              isBlacklisted = cached
            }
            else {
              isBlacklisted = blacklistedSelector(
                opts.selectorBlackList as readonly (string | RegExp)[],
                parent.selector,
              )
              blacklistedCache?.set(parent, isBlacklisted)
            }
          }
          if (isBlacklisted && platform !== 'harmony') {
            return
          }

          /* c8 ignore start */
          let value: string | undefined
          if (isBlacklisted) {
            pxRgx.lastIndex = 0
            value = decl.value.replace(pxRgx, (m, $1) => {
              return $1 ? `${$1}${unConvertTargetUnit}` : m
            })
          }
          else {
            pxRgx.lastIndex = 0
            value = decl.value.replace(pxRgx, pxReplace)
          }
          /* c8 ignore end */

          if (parent && declarationExists(parent, decl.prop, value)) {
            return
          }

          if (opts.replace) {
            decl.value = value
          }
          else {
            decl.cloneAfter({ value })
          }
        },
        AtRule: {
          media(rule: AtRule) {
            if (!shouldHandleMedia) {
              return
            }
            if (shouldSkip()) {
              return
            }
            if (!pxTestRE.test(rule.params)) {
              return
            }
            pxRgx.lastIndex = 0
            rule.params = rule.params.replace(pxRgx, pxReplace)
          },
        },
      }
    },
  }
}

plugin.postcss = true

export default plugin
