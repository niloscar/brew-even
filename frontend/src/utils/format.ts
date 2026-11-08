export function number(
  value: number,
  locale: string,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits
  }).format(value)
}

export function price(price: number, locale: string, currency = 'SEK'): string {
  const fractionDigits = Number.isInteger(price) ? 0 : 2

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(price)
}

export function grams(grams: number, locale: string): string {
  return `${number(grams, locale, 1)} g`
}
