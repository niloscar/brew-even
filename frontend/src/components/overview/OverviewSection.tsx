import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as currencyUtils from '../../utils/currency'
import * as format from '../../utils/format'
import { MOCK_RATES } from '../../data/mockData'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CoffeeIcon,
  PencilSimpleIcon
} from '@phosphor-icons/react'

import type { Currency } from 'shared'

import styles from './OverviewSection.module.css'

type OverviewSectionProps = {
  locale: string
  currency: Currency
  integratedCups?: number | null
}

export default function OverviewSection({ locale, currency, integratedCups }: OverviewSectionProps) {
  const [manualCups, setManualCups] = useState('0')
  const [isEditingCups, setIsEditingCups] = useState(false)

  const { t } = useTranslation()

  const cupUnit = t('overview.cup', {
    count: integratedCups ?? Number(manualCups || 0)
  })

  const displayedCups = isEditingCups
    ? manualCups
    : format.number(Number(manualCups || 0), locale)

  const lastCupCost = currencyUtils.convert(51.31, MOCK_RATES[currency])
  const nextCupCost = currencyUtils.convert(51.21, MOCK_RATES[currency])

  const renderPrice = (amount: number) =>
    format
      .priceParts(amount, locale, currency)
      .filter((part) => part.type !== 'literal' || part.value.trim() !== '')
      .map((part, index) => (
        <span key={index} className={styles[part.type]}>
          {part.value}
        </span>
      ))

  return (
    <section className="view" id="overview">
      <h2>{t('overview.title')}</h2>

      <div className={styles.graphContainer}>
        <div className={styles.graph}>
          <div className={styles.graphBar} style={{ height: '80%' }}></div>
          <div className={styles.graphBar} style={{ height: '60%' }}></div>
          <div className={styles.graphBar} style={{ height: '90%' }}></div>
          <div className={styles.graphBar} style={{ height: '70%' }}></div>
          <div className={styles.graphBar} style={{ height: '50%' }}></div>
          <div className={styles.graphBar} style={{ height: '85%' }}></div>
          <div className={styles.graphBar} style={{ height: '75%' }}></div>
        </div>

        <i className={styles.graphLabel}>{t('overview.comingSoon')}</i>
      </div>

      <div className={`cardGrid contained ${styles.metricsGrid}`}>
        <div className={`card ${styles.metricsCard}`}>
          <h3>
            <ArrowLeftIcon />
            <span>{t('overview.lastCup')}</span>
          </h3>
          <p className={styles.metricValue}>{renderPrice(lastCupCost)}</p>
        </div>

        <div className={`card ${styles.metricsCard}`}>
          <h3>
            <ArrowRightIcon />
            <span>{t('overview.nextCup')}</span>
          </h3>
          <p className={styles.metricValue}>{renderPrice(nextCupCost)}</p>
        </div>

        <div className={`card ${styles.metricsCard}`}>
          <h3>
            <CoffeeIcon />
            <span>{t('overview.brewed')}</span>
          </h3>

          <p className={styles.metricValue}>
            {integratedCups != null ? (
              <>
                {format.number(integratedCups, locale)}
                <span className={styles.metricUnit}>{cupUnit}</span>
              </>
            ) : (
              <label className={styles.cupsInputWrapper}>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label={t('overview.cupsBrewed')}
                  value={displayedCups}
                  onFocus={() => setIsEditingCups(true)}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setManualCups(e.target.value)
                    }
                  }}
                  onBlur={() => {
                    setManualCups(String(Number(manualCups || 0)))
                    setIsEditingCups(false)
                  }}
                  style={{ width: `${Math.max(1, displayedCups.length)}ch` }}
                  className={styles.cupsInput}
                  maxLength={8}
                />
                <span className={styles.metricUnit}>{cupUnit}</span>
                <PencilSimpleIcon
                  className={`${styles.editIcon} ${styles.editIconRegular}`}
                  weight="regular"
                  aria-hidden="true"
                />
                <PencilSimpleIcon
                  className={`${styles.editIcon} ${styles.editIconBold}`}
                  weight="bold"
                  aria-hidden="true"
                />
              </label>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
