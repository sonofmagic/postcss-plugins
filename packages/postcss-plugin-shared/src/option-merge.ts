import { createDefu } from 'defu'

const defu = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = value
    return true
  }
})

export function mergeOptions<T extends Record<string, any>>(
  options: Partial<T> | undefined,
  defaults: T,
) {
  return defu(options ?? ({} as Partial<T>), defaults) as T
}

export function createConfigGetter<T extends Record<string, any>>(defaults: T) {
  return function getConfig(options?: Partial<T>) {
    return mergeOptions(options, defaults) as T
  }
}
