import type { Currency } from '../../../shared/src/currency.types'

export function convert(amount: number, rate: number): number {
  return amount * rate
}

export function convertToSek( amount: number, currency: Currency, rates: Record<Currency, number>): number {
  return amount / rates[currency]
}