import { createDefu } from 'defu'

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

export function mergeOptions<T extends Record<string, any>>(
  options: DeepPartial<T> | undefined,
  defaults: T,
) {
  return defu(options ?? ({} as DeepPartial<T>), defaults) as T
}

export function createConfigGetter<T extends Record<string, any>>(defaults: T) {
  return function getConfig(options?: DeepPartial<T>) {
    return mergeOptions(options, defaults) as T
  }
}
