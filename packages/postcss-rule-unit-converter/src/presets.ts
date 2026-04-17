import type { ConversionRule, NumericResolver } from './types'
import { resolveNumericValue } from './shared'

export interface LinearPresetOptions {
  minValue?: number
  to?: string
}

export interface RemBasedPresetOptions extends LinearPresetOptions {
  rootValue?: NumericResolver
}

export interface ViewportPresetOptions extends LinearPresetOptions {
  viewportWidth?: NumericResolver
}

export interface ViewportHeightPresetOptions extends LinearPresetOptions {
  viewportHeight?: NumericResolver
}

export interface RemToViewportPresetOptions extends LinearPresetOptions {
  rootValue?: NumericResolver
  viewportWidth?: NumericResolver
}

export interface RemToViewportHeightPresetOptions extends LinearPresetOptions {
  rootValue?: NumericResolver
  viewportHeight?: NumericResolver
}

export interface UnitMapPresetOptions {
  minValue?: number
  unitMap?: Record<string, number>
  to?: string
}

export function remToPx(options: RemBasedPresetOptions = {}): ConversionRule {
  const { minValue, rootValue = 16, to = 'px' } = options
  return {
    from: 'rem',
    to,
    minValue,
    transform: (value, context) => value * resolveNumericValue(rootValue, context.input),
  }
}

export function remToRpx(options: RemBasedPresetOptions = {}): ConversionRule {
  return remToPx({
    ...options,
    to: options.to ?? 'rpx',
  })
}

export function remToResponsivePixel(options: RemBasedPresetOptions = {}): ConversionRule {
  return remToPx(options)
}

export function remToViewport(options: RemToViewportPresetOptions = {}): ConversionRule {
  const { minValue, rootValue = 16, viewportWidth = 375, to = 'vw' } = options
  return {
    from: 'rem',
    to,
    minValue,
    transform: (value, context) => {
      const resolvedRootValue = resolveNumericValue(rootValue, context.input)
      const resolvedViewportWidth = resolveNumericValue(viewportWidth, context.input)
      return value * resolvedRootValue * 100 / resolvedViewportWidth
    },
  }
}

export function remToVw(options: RemToViewportPresetOptions = {}): ConversionRule {
  return remToViewport({
    ...options,
    to: options.to ?? 'vw',
  })
}

export function remToVh(options: RemToViewportHeightPresetOptions = {}): ConversionRule {
  const { minValue, rootValue = 16, viewportHeight = 667, to = 'vh' } = options
  return {
    from: 'rem',
    to,
    minValue,
    transform: (value, context) => {
      const resolvedRootValue = resolveNumericValue(rootValue, context.input)
      const resolvedViewportHeight = resolveNumericValue(viewportHeight, context.input)
      return value * resolvedRootValue * 100 / resolvedViewportHeight
    },
  }
}

export function pxToRem(options: RemBasedPresetOptions = {}): ConversionRule {
  const { minValue, rootValue = 16, to = 'rem' } = options
  return {
    from: 'px',
    to,
    minValue,
    transform: (value, context) => value / resolveNumericValue(rootValue, context.input),
  }
}

export function pxToViewport(options: ViewportPresetOptions = {}): ConversionRule {
  const { minValue, viewportWidth = 375, to = 'vw' } = options
  return {
    from: 'px',
    to,
    minValue,
    transform: (value, context) => value * 100 / resolveNumericValue(viewportWidth, context.input),
  }
}

export function pxToVw(options: ViewportPresetOptions = {}): ConversionRule {
  return pxToViewport({
    ...options,
    to: options.to ?? 'vw',
  })
}

export function pxToVh(options: ViewportHeightPresetOptions = {}): ConversionRule {
  const { minValue, viewportHeight = 667, to = 'vh' } = options
  return {
    from: 'px',
    to,
    minValue,
    transform: (value, context) => value * 100 / resolveNumericValue(viewportHeight, context.input),
  }
}

export function rpxToPx(options: LinearPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, ratio = 0.5, to = 'px' } = options
  return {
    from: 'rpx',
    to,
    minValue,
    factor: ratio,
  }
}

export function pxToRpx(options: LinearPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, ratio = 2, to = 'rpx' } = options
  return {
    from: 'px',
    to,
    minValue,
    factor: ratio,
  }
}

export function rpxToRem(options: RemBasedPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, rootValue = 16, ratio = 0.5, to = 'rem' } = options
  return {
    from: 'rpx',
    to,
    minValue,
    transform: (value, context) => value * ratio / resolveNumericValue(rootValue, context.input),
  }
}

export function remToRpxRatio(options: RemBasedPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, rootValue = 16, ratio = 2, to = 'rpx' } = options
  return {
    from: 'rem',
    to,
    minValue,
    transform: (value, context) => value * resolveNumericValue(rootValue, context.input) * ratio,
  }
}

export function remToRpxByRatio(options: RemBasedPresetOptions & { ratio?: number } = {}): ConversionRule {
  return remToRpxRatio(options)
}

export function rpxToVw(options: ViewportPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, viewportWidth = 375, ratio = 0.5, to = 'vw' } = options as ViewportPresetOptions & { ratio?: number }
  return {
    from: 'rpx',
    to,
    minValue,
    transform: (value, context) => value * ratio * 100 / resolveNumericValue(viewportWidth, context.input),
  }
}

export function rpxToVh(options: ViewportHeightPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, viewportHeight = 667, ratio = 0.5, to = 'vh' } = options
  return {
    from: 'rpx',
    to,
    minValue,
    transform: (value, context) => value * ratio * 100 / resolveNumericValue(viewportHeight, context.input),
  }
}

export function vwToPx(options: ViewportPresetOptions = {}): ConversionRule {
  const { minValue, viewportWidth = 375, to = 'px' } = options
  return {
    from: 'vw',
    to,
    minValue,
    transform: (value, context) => value * resolveNumericValue(viewportWidth, context.input) / 100,
  }
}

export function vhToPx(options: ViewportHeightPresetOptions = {}): ConversionRule {
  const { minValue, viewportHeight = 667, to = 'px' } = options
  return {
    from: 'vh',
    to,
    minValue,
    transform: (value, context) => value * resolveNumericValue(viewportHeight, context.input) / 100,
  }
}

export function vwToRem(options: RemToViewportPresetOptions = {}): ConversionRule {
  const { minValue, rootValue = 16, viewportWidth = 375, to = 'rem' } = options
  return {
    from: 'vw',
    to,
    minValue,
    transform: (value, context) => {
      const width = resolveNumericValue(viewportWidth, context.input)
      const root = resolveNumericValue(rootValue, context.input)
      return value * width / 100 / root
    },
  }
}

export function vhToRem(options: RemToViewportHeightPresetOptions = {}): ConversionRule {
  const { minValue, rootValue = 16, viewportHeight = 667, to = 'rem' } = options
  return {
    from: 'vh',
    to,
    minValue,
    transform: (value, context) => {
      const height = resolveNumericValue(viewportHeight, context.input)
      const root = resolveNumericValue(rootValue, context.input)
      return value * height / 100 / root
    },
  }
}

export function vwToRpx(options: ViewportPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, viewportWidth = 375, ratio = 2, to = 'rpx' } = options
  return {
    from: 'vw',
    to,
    minValue,
    transform: (value, context) => value * resolveNumericValue(viewportWidth, context.input) / 100 * ratio,
  }
}

export function vhToRpx(options: ViewportHeightPresetOptions & { ratio?: number } = {}): ConversionRule {
  const { minValue, viewportHeight = 667, ratio = 2, to = 'rpx' } = options
  return {
    from: 'vh',
    to,
    minValue,
    transform: (value, context) => value * resolveNumericValue(viewportHeight, context.input) / 100 * ratio,
  }
}

export function unitsToPx(options: UnitMapPresetOptions = {}): ConversionRule[] {
  const {
    minValue,
    to = 'px',
    unitMap = {
      rem: 16,
      em: 16,
      vw: 3.75,
      vh: 6.67,
      vmin: 3.75,
      vmax: 6.67,
      rpx: 0.5,
    },
  } = options

  return Object.entries(unitMap).map(([from, factor]) => ({
    from,
    to,
    factor,
    minValue,
  }))
}

export const presets = {
  remToPx,
  remToRpx,
  remToRpxByRatio,
  remToRpxRatio,
  remToResponsivePixel,
  remToViewport,
  remToVw,
  remToVh,
  pxToRem,
  pxToViewport,
  pxToVw,
  pxToVh,
  pxToRpx,
  rpxToPx,
  rpxToRem,
  rpxToVw,
  rpxToVh,
  vwToPx,
  vhToPx,
  vwToRem,
  vhToRem,
  vwToRpx,
  vhToRpx,
  unitsToPx,
}
