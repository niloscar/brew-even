import type { Currency } from 'shared'

export const FALLBACK_RATES: Record<Currency, number> = {
  SEK: 1,
  USD: 0.10,
  EUR: 0.09,
  GBP: 0.08
}
