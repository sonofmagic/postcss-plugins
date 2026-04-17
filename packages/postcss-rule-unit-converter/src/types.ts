import type { Input, PluginCreator } from 'postcss'
import type { ReplaceContext } from 'postcss-plugin-shared'

/**
 * Matcher used to decide whether a conversion rule applies to a unit.
 */
export type UnitMatcher = string | RegExp | ((unit: string) => boolean)

/**
 * Extra context passed to conversion callbacks.
 */
export interface RuleContext extends ReplaceContext {
  fromUnit: string
  rawUnit: string
  rawValue: string
  match: string
}

/**
 * Explicit conversion result returned from a transform callback.
 */
export interface ConvertedValue {
  value: number
  unit?: string
}

/**
 * Callback-based conversion rule.
 */
export type RuleTransform = (
  value: number,
  context: RuleContext,
) => number | ConvertedValue | undefined

/**
 * Single conversion rule.
 *
 * Rules are matched in order. If multiple rules can match the same source
 * unit, the first one wins.
 */
export interface ConversionRule {
  from: UnitMatcher
  to?: string
  factor?: number
  minValue?: number
  transform?: RuleTransform
}

export type RuleGroup = ConversionRule | readonly ConversionRule[]
export type PresetOptions = Record<string, unknown> | undefined
export type PresetFactory<TOptions extends PresetOptions = undefined> = (
  options?: TOptions,
) => ConversionRule
export type PresetGroupFactory<TOptions extends PresetOptions = undefined> = (
  options?: TOptions,
) => ConversionRule[]

/**
 * Numeric option that can be resolved dynamically from the current PostCSS input.
 */
export type NumericResolver = number | ((input: Input) => number)

/**
 * Plugin options.
 */
export interface UserDefinedOptions {
  rules?: readonly ConversionRule[]
  unitRegex?: RegExp | undefined
  unitPrecision?: number
  minValue?: number
  keepZeroUnit?: boolean
  selectorBlackList?: (string | RegExp)[]
  propList?: (string | RegExp)[]
  replace?: boolean
  mediaQuery?: boolean
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  disabled?: boolean
}

export type PostcssUnitConverter = PluginCreator<UserDefinedOptions>
