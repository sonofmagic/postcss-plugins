// excluding regex trick: http://www.rexegg.com/regex-best-trick.html
//
// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by units
export function pxRegex(units: string[] = ['px']) {
  return new RegExp(
    `"[^"]+"|'[^']+'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)(${units.join('|')})`,
    'g',
  )
}
