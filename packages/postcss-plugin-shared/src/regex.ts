// excluding regex trick: http://www.rexegg.com/regex-best-trick.html

export interface UnitRegexOptions {
  units: readonly string[]
  numberPattern?: string
  skipDoubleQuotes?: boolean
  skipSingleQuotes?: boolean
  skipUrl?: boolean
  skipVar?: boolean
  ignoreCase?: boolean
}

export function createUnitRegex(options: UnitRegexOptions) {
  const {
    units,
    numberPattern = String.raw`\d+(?:\.\d+)?|\.\d+`,
    skipDoubleQuotes = true,
    skipSingleQuotes = true,
    skipUrl = true,
    skipVar = true,
    ignoreCase = false,
  } = options

  const parts: string[] = []
  if (skipDoubleQuotes) {
    parts.push(String.raw`"[^"]+"`)
  }
  if (skipSingleQuotes) {
    parts.push(String.raw`'[^']+'`)
  }
  if (skipUrl) {
    parts.push(String.raw`url\([^)]+\)`)
  }
  if (skipVar) {
    parts.push(String.raw`var\([^)]+\)`)
  }

  const unitPart = units.map(u => u.replace(/[\\^$.*+?()[\]{}|]/g, String.raw`\$&`)).join('|')
  parts.push(String.raw`(${numberPattern})(?:${unitPart})`)

  return new RegExp(parts.join('|'), `g${ignoreCase ? 'i' : ''}`)
}

export const remRegex
  = createUnitRegex({ units: ['rem'] })

export const pxRegex
  = createUnitRegex({ units: ['px'] })
