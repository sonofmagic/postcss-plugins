import { createDefu } from 'defu'

/**
 * Recursive partial type that keeps array types intact.
 *
 * @example
 * type Options = { list: string[]; nested: { flag: boolean } }
 * const value: DeepPartial<Options> = { nested: { flag: true } }
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends any[]
    ? T[K]
    : T[K] extends Record<string, any>
      ? DeepPartial<T[K]>
      : T[K]
}

const defu = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = value
    return true
  }
})

/**
 * Merge user options with defaults using `defu` semantics.
 *
 * Arrays are overridden instead of concatenated.
 *
 * @example
 * mergeOptions({ propList: ['*'] }, { propList: ['font'] })
 */
export function mergeOptions<T extends Record<string, any>>(
  options: DeepPartial<T> | undefined,
  defaults: T,
) {
  return defu(options ?? ({} as DeepPartial<T>), defaults) as T
}

/**
 * Create a config getter that merges options with defaults.
 *
 * @example
 * const getConfig = createConfigGetter({ replace: true })
 * const config = getConfig({ replace: false })
 */
export function createConfigGetter<T extends Record<string, any>>(defaults: T) {
  return function getConfig(options?: DeepPartial<T>) {
    return mergeOptions(options, defaults) as T
  }
}
