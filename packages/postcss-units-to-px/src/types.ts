import type { PluginCreator } from 'postcss'
import type { ReplaceContext } from 'postcss-plugin-shared'

export type TransformContext = ReplaceContext

export type UnitTransform = (value: number, context: TransformContext) => number
export type GlobalTransform = (
  value: number,
  unit: string,
  context: TransformContext,
) => number

export type UnitMap = Record<string, number | UnitTransform | null>

export interface UserDefinedOptions {
  unitMap?: UnitMap
  transform?: GlobalTransform
  unitPrecision?: number
  minValue?: number
  selectorBlackList?: (string | RegExp)[]
  propList?: (string | RegExp)[]
  replace?: boolean
  mediaQuery?: boolean
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  disabled?: boolean
}

export type PostcssUnitsToPx = PluginCreator<UserDefinedOptions>
