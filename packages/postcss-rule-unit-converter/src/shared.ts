import type { ConversionRule, RuleContext, RuleGroup, UserDefinedOptions } from './types'
import {
  createConfigGetter,
  createExcludeMatcher,
  createPropListMatcher,
  createSelectorBlacklistMatcher,
  declarationExists,
  toFixed,
  walkAndReplaceValues,
} from 'postcss-plugin-shared'
import { name as packageName } from '../package.json'
import { defaultOptions } from './defaults'

const DEFAULT_NUMBER_PATTERN = String.raw`\d+(?:\.\d+)?|\.\d+`

export const postcssPlugin = packageName

export const getConfig = createConfigGetter(defaultOptions)

export function createUnitRegex(units: readonly string[]) {
  const unitPart = units.map(unit => unit.replace(/[\\^$.*+?()[\]{}|]/g, String.raw`\$&`)).join('|')
  const parts: string[] = [
    String.raw`"[^"]+"`,
    String.raw`'[^']+'`,
    String.raw`url\([^)]+\)`,
    String.raw`var\([^)]+\)`,
    String.raw`(${DEFAULT_NUMBER_PATTERN})(${unitPart})`,
  ]
  return new RegExp(parts.join('|'), 'g')
}

export function createAnyUnitRegex() {
  const parts: string[] = [
    String.raw`"[^"]+"`,
    String.raw`'[^']+'`,
    String.raw`url\([^)]+\)`,
    String.raw`var\([^)]+\)`,
    String.raw`(${DEFAULT_NUMBER_PATTERN})([a-zA-Z%]+)`,
  ]
  return new RegExp(parts.join('|'), 'g')
}

function isRuleGroupArray(group: RuleGroup): group is readonly ConversionRule[] {
  return Array.isArray(group)
}

export function composeRules(...groups: RuleGroup[]): ConversionRule[] {
  const rules: ConversionRule[] = []
  for (const group of groups) {
    if (isRuleGroupArray(group)) {
      rules.push(...group)
      continue
    }
    rules.push(group)
  }
  return rules
}

export function resolveNumericValue(
  value: number | ((input: import('postcss').Input) => number),
  input: import('postcss').Input,
) {
  return typeof value === 'function' ? value(input) : value
}

export {
  createExcludeMatcher,
  createPropListMatcher,
  createSelectorBlacklistMatcher,
  declarationExists,
  toFixed,
  walkAndReplaceValues,
}

export type { RuleContext, UserDefinedOptions }
