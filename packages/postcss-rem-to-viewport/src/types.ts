import type { Input, PluginCreator } from 'postcss'

export interface UserDefinedOptions {
  // 100vw = 375px = 23.4375rem
  rootValue?: number | ((input: Input) => number)
  unitPrecision?: number
  selectorBlackList?: (string | RegExp)[]
  propList?: (string | RegExp)[]
  replace?: boolean
  mediaQuery?: boolean
  minRemValue?: number
  exclude?: (string | RegExp)[] | ((filePath: string) => boolean)
  transformUnit?: string
  disabled?: boolean
}

export type PostcssRemToViewport = PluginCreator<UserDefinedOptions>
