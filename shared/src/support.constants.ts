import type { Currency } from './currency.types'

export const AMOUNT_LIMITS: Record<Currency, { min: number; max: number }> = {
  SEK: { min: 300, max: 1000000 },
  USD: { min: 50, max: 100000 },
  EUR: { min: 50, max: 100000 },
  GBP: { min: 30, max: 100000 }
}