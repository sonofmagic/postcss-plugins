// excluding regex trick: http://www.rexegg.com/regex-best-trick.html
//
// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by units
import { createUnitRegex } from 'postcss-plugin-shared'

/**
 * Build a px-matching regex with optional unit list.
 *
 * Defaults:
 * - units: ['px']
 * - numberPattern: `\\d*\\.?\\d+`
 * - skipVar: false
 *
 * @example
 * const regex = pxRegex(['px', 'rpx'])
 * '1px 2rpx'.replace(regex, (m) => m)
 */
export function pxRegex(units: string[] = ['px']) {
  return createUnitRegex({
    units,
    numberPattern: String.raw`\d*\.?\d+`,
    skipVar: false,
  })
}
