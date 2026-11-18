import { getExchangeRates } from '../adapters/frankfurter.adapter.ts'

import type { Request, Response } from 'express'

export async function handleGetExchangeRates(_req: Request, res: Response): Promise<void> {
  try {
    const data = await getExchangeRates()

    res.set('Cache-Control', 'public, s-maxage=3600')
    res.json(data)
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    res.status(502).json({ error: 'Exchange rates are temporarily unavailable' })
  }
}
