
import type { Currency } from 'shared'

export function number(
  value: number,
  locale: string,
  maximumFractionDigits = 2,
  maxLength?: number
): string {
  return createFormatter(value, locale, {
    maximumFractionDigits
  }, maxLength).format(value)
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
  currency: Currency,
  maxLength?: number
) {
  const fractionDigits = getPriceFractionDigits(amount)

  return createFormatter(amount, locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }, maxLength).formatToParts(amount)
}

export function grams(grams: number, locale: string): string {
  return `${number(grams, locale, 1)} g`
}


function createFormatter(
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions,
  maxLength?: number
): Intl.NumberFormat {
  const formatter = new Intl.NumberFormat(locale, options)

  if (maxLength === undefined || formatter.format(value).length <= maxLength) {
    return formatter
  }

  const roundedFormatter = new Intl.NumberFormat(locale, {
    ...options,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  if (roundedFormatter.format(value).length <= maxLength) {
    return roundedFormatter
  }

  const compactOptions: Intl.NumberFormatOptions = {
    ...options,
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }

  const compactFormatter = new Intl.NumberFormat(locale, compactOptions)

  if (compactFormatter.format(value).length <= maxLength) {
    return compactFormatter
  }

  return new Intl.NumberFormat(locale, {
    ...compactOptions,
    maximumFractionDigits: 0
  })
}
