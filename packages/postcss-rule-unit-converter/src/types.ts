import type { Input, PluginCreator } from 'postcss'
import type { ReplaceContext } from 'postcss-plugin-shared'

export type UnitMatcher = string | RegExp | ((unit: string) => boolean)

export interface RuleContext extends ReplaceContext {
  fromUnit: string
}

export interface ConvertedValue {
  value: number
  unit?: string
}

export type RuleTransform = (
  value: number,
  context: RuleContext,
) => number | ConvertedValue | undefined

export interface ConversionRule {
  from: UnitMatcher
  to?: string
  factor?: number
  minValue?: number
  transform?: RuleTransform
}

export type RuleGroup = ConversionRule | readonly ConversionRule[]

export type NumericResolver = number | ((input: Input) => number)

export interface UserDefinedOptions {
  rules?: readonly ConversionRule[]
  unitPrecision?: number
  minValue?: number
  selectorBlackList?: (string | RegExp)[]
  propList?: (string | RegExp)[]
  replace?: boolean
  mediaQuery?: boolean
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  disabled?: boolean
}

export type PostcssUnitConverter = PluginCreator<UserDefinedOptions>
