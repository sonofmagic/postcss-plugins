import { createDefu } from 'defu'

const defu = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = value
    return true
  }
})

export function mergeOptions<T extends Record<string, any>>(
  options: T | undefined,
  defaults: T,
) {
  return defu<T, T[]>(options ?? ({} as T), defaults) as T
}
