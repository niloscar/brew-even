
import type { Currency } from 'shared'

export function number(
  value: number,
  locale: string,
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits
  }).format(value)
}

function getPriceFractionDigits(value: number): number {
  const rounded = Number(value.toFixed(2))
  return Number.isInteger(rounded) ? 0 : 2
}

export function price(amount: number, locale: string, currency = 'SEK'): string {
  const fractionDigits = getPriceFractionDigits(amount)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(amount)
}

export function priceParts(
  amount: number,
  locale: string,
  currency: Currency
) {
  const fractionDigits = getPriceFractionDigits(amount)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).formatToParts(amount)
}

export function grams(grams: number, locale: string): string {
  return `${number(grams, locale, 1)} g`
}
