/**
 * Round a number with fixed precision while preserving the sign.
 *
 * @example
 * toFixed(1.005, 2) // 1.01
 */
export function toFixed(number: number, precision: number) {
  if (number === 0) {
    return 0
  }
  const multiplier = 10 ** precision
  const sign = Math.sign(number)
  const absNumber = Math.abs(number)
  const rounded = Math.round((absNumber + Number.EPSILON) * multiplier) / multiplier
  return sign * rounded
}
