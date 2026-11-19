import api from '../lib/apiClient'

import type { Currency } from 'shared'

type SupportPaymentStatus = 'paid' | 'pending' | 'expired'

interface CreateSupportCheckoutOptions {
  amount: number
  currency: Currency
  locale: string
}

export async function createSupportCheckout({ amount, currency, locale }: CreateSupportCheckoutOptions) {
  const { data } = await api.post<{ mode: 'hosted'; url: string }>('/support/checkout', {
    amount,
    currency,
    locale
  })

  return data
}

export async function getSupportCheckoutStatus(sessionId: string, signal?: AbortSignal) {
  const { data } = await api.get<{ status: SupportPaymentStatus }>(
    `/support/checkout/${encodeURIComponent(sessionId)}`,
    { signal }
  )

  return data.status
}