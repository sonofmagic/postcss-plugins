import type { Input } from 'postcss'

export type PxTransformMethod = 'platform' | 'size'
export type PxTransformPlatform = 'weapp' | 'h5' | 'rn' | 'quickapp' | 'harmony'
export type PxTransformTargetUnit = 'rpx' | 'rem' | 'px' | 'vw' | 'vmin'

export type DesignWidth
  = number
    | ((input: Input) => number)

export interface PxTransformDeviceRatio {
  [designWidth: number]: number
}

export interface PxTransformOptions {
  platform?: PxTransformPlatform
  designWidth?: DesignWidth
  targetUnit?: PxTransformTargetUnit
  deviceRatio?: PxTransformDeviceRatio

  rootValue?: number | ((input: Input, m: string, value: string) => number)
  baseFontSize?: number
  minRootSize?: number

  methods?: readonly PxTransformMethod[]
  unitPrecision?: number
  selectorBlackList?: readonly (string | RegExp)[]
  propList?: readonly string[]
  replace?: boolean
  mediaQuery?: boolean
  minPixelValue?: number
  onePxTransform?: boolean
  exclude?: (filePath?: string) => boolean

}
