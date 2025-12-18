// excluding regex trick: http://www.rexegg.com/regex-best-trick.html
//
// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by units
import { createUnitRegex } from 'postcss-plugin-shared'

export function pxRegex(units: string[] = ['px']) {
  return createUnitRegex({
    units,
    numberPattern: String.raw`\d*\.?\d+`,
    skipVar: false,
  })
}
