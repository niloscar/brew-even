export const SUPPORTED_CURRENCIES = ['SEK', 'USD', 'EUR', 'GBP'] as const

export type Currency = (typeof SUPPORTED_CURRENCIES)[number]
