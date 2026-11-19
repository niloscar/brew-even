import { useEffect, useState, type FormEvent } from 'react'
import api from '../lib/apiClient'
import { useTranslation } from 'react-i18next'
import * as format from '../utils/format'
import * as currencyUtils from '../utils/currency'
import { ArrowUpRightIcon, CoffeeIcon, GithubLogoIcon } from '@phosphor-icons/react'

import type { Currency } from 'shared'

import styles from './AppFooter.module.css'

interface AppFooterProps {
  currency: Currency
  rates: Record<Currency, number>
  locale: string
  nextCupCost: number
}

type PaymentStatus = 'checking' | 'paid' | 'pending' | 'expired' | 'error'

const CURRENT_YEAR = new Date().getFullYear()
const AMOUNT_LIMITS: Record<Currency, { min: number; max: number }> = {
  SEK: { min: 1000, max: 1000000 },
  USD: { min: 100, max: 100000 },
  EUR: { min: 100, max: 100000 },
  GBP: { min: 100, max: 100000 }
}

export default function AppFooter({ currency, rates, locale, nextCupCost}: AppFooterProps) {
  const { t } = useTranslation()

  const [amountOverride, setAmountOverride] = useState<{ currency: Currency; value: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState(false)

  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('support') === 'success' ? params.get('session_id') : null

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(sessionId ? 'checking' : null)

  const suggestedAmount = Math.round(currencyUtils.convert(nextCupCost, rates[currency]) * 100) / 100

  const amountValue = amountOverride?.currency === currency
    ? amountOverride.value
    : new Intl.NumberFormat(locale, {
        useGrouping: false,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(suggestedAmount)

  const amountInMinorUnits = Math.round(Number(amountValue.replace(',', '.')) * 100)
  const { min, max } = AMOUNT_LIMITS[currency]

  const validAmount =
    /^\d+(?:[.,]\d{1,2})?$/.test(amountValue) &&
    Number.isSafeInteger(amountInMinorUnits) &&
    amountInMinorUnits >= min &&
    amountInMinorUnits <= max

  const showAmountError = amountOverride?.currency === currency && !validAmount

  useEffect(() => {
    if (!sessionId) return

    const controller = new AbortController()

    api.get<{ status: 'paid' | 'pending' | 'expired' }>(`/support/checkout/${encodeURIComponent(sessionId)}`, {
      signal: controller.signal
    })
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setPaymentStatus(data.status)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPaymentStatus('error')
        }
      })

    return () => controller.abort()
  }, [sessionId])

  useEffect(() => {
    if (window.location.hash !== '#about') return

    const frame = requestAnimationFrame(() => {
      document.getElementById('about')?.scrollIntoView({
        behavior: 'auto',
        block: 'start'
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validAmount || isSubmitting) return

    setIsSubmitting(true)
    setCheckoutError(false)

    try {
      const { data } = await api.post<{ mode: 'hosted'; url: string }>('/support/checkout', {
        amount: amountInMinorUnits,
        currency,
        locale: locale.split('-')[0]
      })

      window.location.assign(data.url)
    } catch {
      setCheckoutError(true)
      setIsSubmitting(false)
    }
  }

  const nextCupPrice =
    nextCupCost === null
      ? null
      : format.price(
          currencyUtils.convert(nextCupCost, rates[currency]),
          locale,
          currency
        )

  return (
    <footer className={`view ${styles.footer}`} id="about">
      <div className={`cardGrid ${styles.footerGrid}`}>
        <section>
          <h2>{t('footer.title')}</h2>

          <p>{t('footer.description')}</p>

          <p>
            {t('footer.createdBy')}{' '}
            <a
              href="https://oscarnilsson.dev?ref=brew-even"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Oscar Nilsson</span>
              <ArrowUpRightIcon />
            </a>
            {t('footer.creatorDescription')}
          </p>

          <a
            href="https://github.com/niloscar/brew-even"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubLogoIcon />
            <span>{t('footer.viewOnGitHub')}</span>
            <ArrowUpRightIcon />
          </a>
        </section>

        <section className={`card ${styles.supportCard}`}>
          <h2 className={styles.supportHeader}>
            <CoffeeIcon />
            <span>{t('footer.buyMeACoffee')}</span>
          </h2>

          <p>{t('footer.supportDescription')}</p>

          <form className={styles.supportForm} onSubmit={handleCheckout}>
            <label htmlFor="support-amount">
              {t('footer.supportAmount', { currency })}
            </label>

            <input
              id="support-amount"
              type="text"
              inputMode="decimal"
              value={amountValue}
              onChange={(event) => {
                setAmountOverride({ currency, value: event.target.value })
                setCheckoutError(false)
              }}
              aria-invalid={showAmountError}
              aria-describedby={showAmountError ? 'support-amount-error' : undefined}
            />

            {showAmountError && (
              <p id="support-amount-error" role="alert" className={styles.supportFeedback}>
                {t('footer.invalidAmount', {
                  min: format.price(min / 100, locale, currency),
                  max: format.price(max / 100, locale, currency)
                })}
              </p>
            )}

            <button type="submit" className="buttonAccent" disabled={!validAmount || isSubmitting}>
              <span>{t(isSubmitting ? 'footer.openingCheckout' : 'footer.supportProject')}</span>
              <ArrowUpRightIcon aria-hidden="true" />
            </button>
          </form>

          {checkoutError && (
            <p role="alert" className={styles.supportFeedback}>
              {t('footer.checkoutError')}
            </p>
          )}

          {paymentStatus && (
            <p role={paymentStatus === 'error' ? 'alert' : 'status'} className={styles.supportFeedback}>
              {t(`footer.paymentStatus.${paymentStatus}`)}
            </p>
          )}

          {nextCupPrice !== null && (
            <i>{t('footer.nextCupCost', { price: nextCupPrice })}</i>
          )}
        </section>

        <section className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; {CURRENT_YEAR} Brew-even
          </p>
          <p>{t('footer.tagline')}</p>
        </section>
      </div>
    </footer>
  )
}
