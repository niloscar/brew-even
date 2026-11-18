
import { useEffect, useState } from 'react'
import { SUPPORTED_CURRENCIES } from 'shared'
import api from '../lib/apiClient'
import { FALLBACK_RATES } from '../data/fallbackRates'

import type { Currency } from 'shared'

export type ExchangeRateStatus = 'loading' | 'live' | 'fallback'

type ExchangeRatesResponse = {
  rates: Record<Currency, number>
  dates: Record<Exclude<Currency, 'SEK'>, string>
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

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES)
  const [status, setStatus] = useState<ExchangeRateStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()

    api.get<ExchangeRatesResponse>('/exchange-rates', {
      signal: controller.signal
    })
      .then(({ data }) => {
        if (!isValidRates(data.rates)) {
          throw new Error('Invalid exchange rates')
        }

        setRates(data.rates)
        setStatus('live')
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStatus('fallback')
        }
      })

    return () => controller.abort()
  }, [])

  return { rates, status }
}
