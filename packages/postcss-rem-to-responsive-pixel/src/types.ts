import type { Input, PluginCreator } from 'postcss'

export interface UserDefinedOptions {
  /**
   * Base font size in pixels for 1rem.
   *
   * @default 16
   * @example
   * rootValue: (input) => input.file?.includes('tablet') ? 18 : 16
   */
  rootValue?: number | ((input: Input) => number)
  /**
   * Decimal precision for generated values.
   *
   * @default 5
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
   * Supports negated string entries like `!font-size`, `!padding*`,
   * or glob patterns such as `!--wot-*-font-size`.
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
   * @default 'px'
   */
  transformUnit?: 'px' | 'rpx'
  /**
   * Disable this plugin.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * PostCSS processor stage to run at.
   *
   * @default 'Once'
   */
  processorStage?: 'Once' | 'OnceExit'
}

/**
 * PostCSS plugin creator for postcss-rem-to-responsive-pixel.
 *
 * @example
 * import postcss from 'postcss'
 * import remToResponsivePixel from 'postcss-rem-to-responsive-pixel'
 *
 * const result = await postcss([remToResponsivePixel()]).process('.a{font-size:1rem}', { from: undefined })
 */
export type PostcssRemToResponsivePixel = PluginCreator<UserDefinedOptions>
