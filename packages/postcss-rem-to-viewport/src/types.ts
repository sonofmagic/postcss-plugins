import type { Input, PluginCreator } from 'postcss'

export interface UserDefinedOptions {
  // 100vw = 375px = 23.4375rem
  /**
   * Base width used to compute vw from rem.
   *
   * @default 375
   * @example
   * rootValue: (input) => input.file?.includes('mobile') ? 375 : 768
   */
  rootValue?: number | ((input: Input) => number)
  /**
   * Decimal precision for generated vw values.
   *
   * @default 16
   */
  unitPrecision?: number
  /**
   * Selectors to ignore.
   *
   * @default []
   */
  selectorBlackList?: (string | RegExp)[]
  /**
   * Only declarations with matching properties are processed.
   *
   * @default ['font', 'font-size', 'line-height', 'letter-spacing']
   */
  propList?: (string | RegExp)[]
  /**
   * Replace the original declaration value.
   *
   * @default true
   */
  replace?: boolean
  /**
   * Enable rem conversion inside @media params.
   *
   * @default false
   */
  mediaQuery?: boolean
  /**
   * Minimum rem value to convert.
   *
   * @default 0
   */
  minRemValue?: number
  /**
   * Exclude files by path.
   *
   * @default [/node_modules/i]
   */
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  /**
   * Target unit for conversion.
   *
   * @default 'vw'
   */
  transformUnit?: string
  /**
   * Disable this plugin.
   *
   * @default false
   */
  disabled?: boolean
}

/**
 * PostCSS plugin creator for postcss-rem-to-viewport.
 *
 * @example
 * import postcss from 'postcss'
 * import remToViewport from 'postcss-rem-to-viewport'
 *
 * const result = await postcss([remToViewport()]).process('.a{font-size:1rem}', { from: undefined })
 */
export type PostcssRemToViewport = PluginCreator<UserDefinedOptions>
