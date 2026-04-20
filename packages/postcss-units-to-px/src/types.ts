import type { PluginCreator } from 'postcss'
import type { ReplaceContext } from 'postcss-plugin-shared'

/**
 * Context provided to conversion callbacks.
 *
 * @example
 * const transform = (value, unit, context) => {
 *   if (context.prop === 'letter-spacing') return value * 12
 *   return value * 16
 * }
 */
export type TransformContext = ReplaceContext

/**
 * Per-unit conversion callback.
 *
 * @example
 * const unitMap = {
 *   rem: (value, context) => value * 16,
 * }
 */
export type UnitTransform = (value: number, context: TransformContext) => number

/**
 * Global conversion callback when no per-unit rule is available.
 *
 * @example
 * const transform = (value, unit, context) => {
 *   return unit === 'vw' ? value * 3.75 : value * 16
 * }
 */
export type GlobalTransform = (
  value: number,
  unit: string,
  context: TransformContext,
) => number

/**
 * Per-unit conversion rules.
 *
 * @default
 * {
 *   rem: 16,
 *   em: 16,
 *   vw: 3.75,
 *   vh: 6.67,
 *   vmin: 3.75,
 *   vmax: 6.67,
 *   rpx: 0.5
 * }
 *
 * @example
 * const unitMap = {
 *   rem: 16,
 *   px: null,
 *   vw: false,
 *   vh: (value) => value * 6.67,
 * }
 */
export type UnitRule = number | UnitTransform | null | false

export type UnitMatcher = string | RegExp | ((unit: string) => boolean)

export type UnitMap
  = Record<string, UnitRule>
    | Map<UnitMatcher, UnitRule>
    | Array<[UnitMatcher, UnitRule]>

export interface UserDefinedOptions {
  /**
   * Per-unit conversion rules. Numeric values are multipliers.
   * Supports object, Map, or Array matcher forms. Map/Array are matched
   * in order and do not merge with defaults.
   *
   * @default
   * {
   *   rem: 16,
   *   em: 16,
   *   vw: 3.75,
   *   vh: 6.67,
   *   vmin: 3.75,
   *   vmax: 6.67,
   *   rpx: 0.5
   * }
   *
   * @example
   * unitMap: { rem: 10, vw: 3.2, px: null, vmin: false }
   */
  unitMap?: UnitMap
  /**
   * Global conversion callback when a unit has no rule or is set to null.
   * Set to false to skip all conversions.
   *
   * @example
   * transform: (value, unit) => (unit === 'em' ? value * 12 : value * 16)
   */
  transform?: GlobalTransform | false
  /**
   * Decimal precision for generated px values.
   *
   * @default 5
   */
  unitPrecision?: number
  /**
   * Minimum source value to convert.
   *
   * @default 0
   */
  minValue?: number
  /**
   * Selectors to ignore.
   *
   * @default []
   */
  selectorBlackList?: (string | RegExp)[]
  /**
   * Only declarations with matching properties are processed.
   * Supports negated string entries like `!font-size`, `!padding*`,
   * or glob patterns such as `!--wot-*-font-size`.
   *
   * @default ['*']
   */
  propList?: (string | RegExp)[]
  /**
   * Replace the original declaration value.
   *
   * @default true
   */
  replace?: boolean
  /**
   * Enable unit conversion inside @media params.
   *
   * @default false
   */
  mediaQuery?: boolean
  /**
   * Exclude files by path.
   *
   * @default [/node_modules/i]
   */
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  /**
   * Disable this plugin.
   *
   * @default false
   */
  disabled?: boolean
}

/**
 * PostCSS plugin creator for postcss-units-to-px.
 *
 * @example
 * import postcss from 'postcss'
 * import unitsToPx from 'postcss-units-to-px'
 *
 * const result = await postcss([unitsToPx()]).process('.a{margin:1rem}', { from: undefined })
 */
export type PostcssUnitsToPx = PluginCreator<UserDefinedOptions>
