
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createSupportCheckout,
  getSupportCheckoutStatus
} from '../../api/supportApi'
import * as format from '../../utils/format'
import * as currencyUtils from '../../utils/currency'
import {
  ArrowRightIcon,
  CoffeeIcon,
  CoinsIcon,
  HeartIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  WarningIcon
} from '@phosphor-icons/react'

import type { SubmitEvent } from 'react'
import type { Currency } from 'shared'

import styles from './SupportSection.module.css'

interface SupportSectionProps {
  currency: Currency
  rates: Record<Currency, number>
  locale: string
  nextCupCost: number
}

type PaymentStatus = 'checking' | 'paid' | 'pending' | 'expired' | 'error'

export default function SupportSection({
  currency,
  rates,
  locale,
  nextCupCost
}: SupportSectionProps) {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [cups, setCups] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState(false)

  const { t } = useTranslation()

  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('support') === 'success' 
    ? params.get('session_id') 
    : null

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    sessionId ? 'checking' : null
  )

  const cupPriceInMinorUnits = Math.round(currencyUtils.convert(nextCupCost, rates[currency]) * 100)
  const amountInMinorUnits = cupPriceInMinorUnits * cups

  const cupPrice = format.price(cupPriceInMinorUnits / 100, locale, currency)
  const totalPrice = format.price(amountInMinorUnits / 100, locale, currency)

  useEffect(() => {
    if (!sessionId) return

    const controller = new AbortController()

    async function checkPaymentStatus(id: string) {
      try {
        const status = await getSupportCheckoutStatus(id, controller.signal)

        if (!controller.signal.aborted) setPaymentStatus(status)
      } catch {
        if (!controller.signal.aborted) setPaymentStatus('error')
      }
    }

    void checkPaymentStatus(sessionId)

    return () => controller.abort()
  }, [sessionId])

  function handleCupsChange(direction: -1 | 1) {
    setCups((prev) => Math.min(99, Math.max(1, prev + direction)))
    setCheckoutError(false)
  }

  async function handleCheckout(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    setCheckoutError(false)

    try {
      const { url } = await createSupportCheckout({
        amount: amountInMinorUnits,
        currency,
        locale: locale.split('-')[0]
      })

      window.location.assign(url)
    } catch {
      setCheckoutError(true)
      setIsSubmitting(false)
    }
  }

  const showPaymentNotice =
    paymentStatus === 'checking' ||
    paymentStatus === 'pending' ||
    paymentStatus === 'error'

  const showCheckout = paymentStatus === null || paymentStatus === 'expired'

  return (
    <section
      className={`card ${styles.supportCard}`}
      style={paymentStatus === 'checking' ? { visibility: 'hidden' } : undefined}
    >
      {paymentStatus === 'paid' ? (
        <div className={styles.success} role="status">
          <h2>
            <HeartIcon aria-hidden="true" />
            <span>{t('footer.paymentStatus.paid')}</span>
          </h2>
          <p>{t('footer.thanksDescription')}</p>
        </div>
      ) : (
        <>
          <h2 className={styles.supportHeader}>
            <CoffeeIcon aria-hidden="true" />
            <span>{t('footer.buyMeACoffee')}</span>
          </h2>

          <p>{t('footer.supportDescription')}</p>

          <div className={styles.checkout}>
            {showPaymentNotice && (
              <div
                className={styles.notice}
                data-status={paymentStatus}
                role={paymentStatus === 'error' ? 'alert' : 'status'}
              >
                {paymentStatus === 'checking' ? (
                  <span className={styles.spinner} aria-hidden="true" />
                ) : (
                  <InfoIcon aria-hidden="true" />
                )}

                <p>{t(`footer.paymentStatus.${paymentStatus}`)}</p>
              </div>
            )}

            {showCheckout && (
              <>
                {paymentStatus === 'expired' && (
                  <div className={styles.notice} data-status="expired" role="status">
                    <InfoIcon aria-hidden="true" />
                    <p>{t('footer.paymentStatus.expired')}</p>
                  </div>
                )}

                {!isFormVisible && (
                  <div className={styles.intro}>
                    <button
                      type="button"
                      className={`buttonAccent ${styles.startButton}`}
                      onClick={() => setIsFormVisible(true)}
                    >
                      <CoinsIcon aria-hidden="true" />
                      <span>{t('footer.supportProject')}</span>
                    </button>

                    {paymentStatus === null && (
                      <i className={styles.hint}>
                        {t('footer.nextCupCost', { price: cupPrice })}
                      </i>
                    )}
                  </div>
                )}

                {isFormVisible && (
                  <form className={styles.form} onSubmit={handleCheckout}>
                    <div
                      className={styles.stepper}
                      role="group"
                      aria-label={t('footer.supportCups')}
                    >
                      <button
                        type="button"
                        className={styles.stepperButton}
                        aria-label={t('common.decrease', {
                          label: t('footer.supportCups')
                        })}
                        disabled={cups <= 1 || isSubmitting}
                        onClick={() => handleCupsChange(-1)}
                      >
                        <MinusIcon aria-hidden="true" />
                      </button>

                      <div className={styles.cupCount} aria-live="polite">
                        <strong>{cups}</strong>
                        <span>{t('footer.cup', { count: cups })}</span>
                      </div>

                      <button
                        type="button"
                        className={styles.stepperButton}
                        aria-label={t('common.increase', {
                          label: t('footer.supportCups')
                        })}
                        disabled={cups >= 99 || isSubmitting}
                        onClick={() => handleCupsChange(1)}
                      >
                        <PlusIcon aria-hidden="true" />
                      </button>
                    </div>

                    <div className={styles.total}>
                      <strong>{totalPrice}</strong>
                      <span>{t('footer.pricePerCup', { price: cupPrice })}</span>
                    </div>

                    <div className={styles.actions}>
                      <button
                        type="submit"
                        className={`buttonAccent ${styles.submitButton}`}
                        disabled={isSubmitting}
                      >
                        <span>
                          {t(
                            isSubmitting
                              ? 'footer.openingCheckout'
                              : 'footer.continueCheckout'
                          )}
                        </span>
                        <ArrowRightIcon aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                        onClick={() => {
                          setIsFormVisible(false)
                          setCups(1)
                          setCheckoutError(false)
                        }}
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                )}

                {checkoutError && (
                  <div className={styles.notice} data-status="error" role="alert">
                    <WarningIcon aria-hidden="true" />
                    <span>{t('footer.checkoutError')}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </section>
  )
}
