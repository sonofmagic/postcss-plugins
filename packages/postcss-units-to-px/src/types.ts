import type {
  AtRule,
  Declaration,
  Input,
  PluginCreator,
  Root,
  Rule,
} from 'postcss'

export interface TransformContext {
  root: Root
  input: Input
  filePath?: string
  decl?: Declaration
  rule?: Rule
  atRule?: AtRule
  prop?: string
  selector?: string
}

export type UnitTransform = (value: number, context: TransformContext) => number
export type GlobalTransform = (
  value: number,
  unit: string,
  context: TransformContext,
) => number

export type UnitMap = Record<string, number | UnitTransform | null>

export interface UserDefinedOptions {
  unitMap?: UnitMap
  transform?: GlobalTransform
  unitPrecision?: number
  minValue?: number
  selectorBlackList?: (string | RegExp)[]
  propList?: (string | RegExp)[]
  replace?: boolean
  mediaQuery?: boolean
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  disabled?: boolean
}

export type PostcssUnitsToPx = PluginCreator<UserDefinedOptions>
