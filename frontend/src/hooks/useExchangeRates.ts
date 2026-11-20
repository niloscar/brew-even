
import { useEffect, useState } from 'react'
import { getExchangeRates } from '../api/exchangeRatesApi'
import { FALLBACK_RATES } from '../data/fallbackRates'

import type { Currency } from 'shared'

export type ExchangeRateStatus = 'loading' | 'live' | 'fallback'

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES)
  const [status, setStatus] = useState<ExchangeRateStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function loadExchangeRates() {
      try {
        const liveRates = await getExchangeRates(controller.signal)

        if (controller.signal.aborted) return

        setRates(liveRates)
        setStatus('live')
      } catch {
        if (!controller.signal.aborted) {
          setStatus('fallback')
        }
      }
    }

    void loadExchangeRates()

    return () => controller.abort()
  }, [])

  return { rates, status }
}
