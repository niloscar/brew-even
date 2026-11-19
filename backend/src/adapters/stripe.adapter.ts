import Stripe from 'stripe'
import type { Currency } from 'shared'

export type SupportLocale = 'sv' | 'en' | 'de' | 'fr'

interface SupportCheckoutOptions {
  amount: number
  currency: Currency
  locale: SupportLocale
}

const checkoutContent = {
  sv: {
    name: 'Stöd Brew-even',
    description: 'Frivilligt stöd till utvecklingen av Brew-even.'
  },
  en: {
    name: 'Support Brew-even',
    description: 'Voluntary support for the development of Brew-even.'
  },
  de: {
    name: 'Brew-even unterstützen',
    description: 'Freiwillige Unterstützung für die Weiterentwicklung von Brew-even.'
  },
  fr: {
    name: 'Soutenir Brew-even',
    description: 'Soutien volontaire au développement de Brew-even.'
  }
}

let stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) throw new Error('STRIPE_SECRET_KEY is missing')

    stripe = new Stripe(secretKey)
  }

  return stripe
}

export async function createSupportCheckout({ amount, currency, locale }: SupportCheckoutOptions) {
  const appUrl = process.env.APP_URL?.replace(/\/$/, '')

  if (!appUrl) throw new Error('APP_URL is missing')

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    ui_mode: 'hosted_page',
    locale,
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: amount,
          product_data: checkoutContent[locale]
        },
        quantity: 1
      }
    ],
    success_url: `${appUrl}/${locale}?support=success&session_id={CHECKOUT_SESSION_ID}#about`,
    cancel_url: `${appUrl}/${locale}#about`,
    metadata: {
      purpose: 'brew-even-support'
    }
  })

  if (!session.url) throw new Error('Stripe Checkout URL is missing')

  return { mode: 'hosted' as const, url: session.url }
}

export async function getSupportCheckoutStatus(sessionId: string) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    if (session.metadata?.purpose !== 'brew-even-support') return null

    if (session.payment_status === 'paid') return 'paid'
    if (session.status === 'expired') return 'expired'

    return 'pending'
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError && error.code === 'resource_missing') {
      return null
    }

    throw error
  }
}
