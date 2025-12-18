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
