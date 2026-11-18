
import { z } from 'zod'
import { SUPPORTED_CURRENCIES } from 'shared'
import type { Currency } from 'shared'

const BASE_CURRENCY = 'SEK'
const QUOTES = SUPPORTED_CURRENCIES.filter((currency) => currency !== BASE_CURRENCY)
const FRANKFURTER_URL = `https://api.frankfurter.dev/v2/rates?base=${BASE_CURRENCY}&quotes=${QUOTES.join(',')}`

type Quote = (typeof QUOTES)[number]

const frankfurterRateSchema = z.object({
  base: z.literal(BASE_CURRENCY),
  quote: z.enum(QUOTES),
  rate: z.number().positive(),
  date: z.iso.date()
})

const frankfurterResponseSchema = z.array(frankfurterRateSchema)

export async function getExchangeRates(): Promise<{rates: Record<Currency, number>, dates: Record<Quote, string>}> {
  const response = await fetch(FRANKFURTER_URL, { signal: AbortSignal.timeout(5000) })

  if (!response.ok) throw new Error(`Frankfurter returned ${response.status}`)

  const data = frankfurterResponseSchema.parse(await response.json())

  const rates = { [BASE_CURRENCY]: 1 } as Record<Currency, number>
  const dates = {} as Record<Quote, string>

  for (const quote of QUOTES) {
    const row = data.find((item) => item.quote === quote)

    if (!row) throw new Error(`Missing rate for ${quote}`)

    rates[quote] = row.rate
    dates[quote] = row.date
  }

  return { rates, dates }
}
