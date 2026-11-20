
import { SUPPORTED_CURRENCIES } from 'shared'
import api from '../lib/apiClient'

import type { Currency } from 'shared'

type ExchangeRatesResponse = {
  rates: Record<Currency, number>
  dates: Record<Exclude<Currency, 'SEK'>, string>
}

export async function getExchangeRates(signal?: AbortSignal) {
  const { data } = await api.get<ExchangeRatesResponse>('/exchange-rates', { signal })

  if (!isValidRates(data.rates)) {
    throw new Error('Invalid exchange rates')
  }

  return data.rates
}

function isValidRates(value: unknown): value is Record<Currency, number> {
  if (typeof value !== 'object' || value === null) return false

  const rates = value as Record<string, unknown>

  return (
    rates.SEK === 1 &&
    SUPPORTED_CURRENCIES.every((currency) => {
      const rate = rates[currency]
      return typeof rate === 'number' && Number.isFinite(rate) && rate > 0
    })
  )
}