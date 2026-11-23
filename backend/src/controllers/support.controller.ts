import { z } from 'zod'
import { AMOUNT_LIMITS } from 'shared'
import { SUPPORTED_CURRENCIES } from 'shared'
import { createSupportCheckout, getSupportCheckoutStatus } from '../adapters/stripe.adapter.ts'

import type { Request, Response } from 'express'

const supportCheckoutSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.enum(SUPPORTED_CURRENCIES),
  locale: z.enum(['sv', 'en', 'de', 'fr'])
}).strict().refine(
  ({ amount, currency }) =>
    amount >= AMOUNT_LIMITS[currency].min &&
    amount <= AMOUNT_LIMITS[currency].max,
  { message: 'Amount is outside the allowed range', path: ['amount'] }
)

export async function handleCreateSupportCheckout(req: Request, res: Response): Promise<void> {
  const parsed = supportCheckoutSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid support checkout parameters' })
    return
  }

  try {
    const checkout = await createSupportCheckout(parsed.data)
    res.status(201).json(checkout)
  } catch (error) {
    console.error('Failed to create support checkout:', error)
    res.status(502).json({ error: 'Unable to create checkout session' })
  }
}

export async function handleGetSupportCheckoutStatus(req: Request, res: Response): Promise<void> {
  const sessionId = req.params.id

  if (typeof sessionId !== 'string' || !/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) {
    res.status(400).json({ error: 'Invalid checkout session ID' })
    return
  }

  try {
    const status = await getSupportCheckoutStatus(sessionId)

    if (!status) {
      res.status(404).json({ error: 'Checkout session not found' })
      return
    }

    res.json({ status })
  } catch (error) {
    console.error('Failed to retrieve checkout status:', error)
    res.status(502).json({ error: 'Unable to retrieve checkout status' })
  }
}
