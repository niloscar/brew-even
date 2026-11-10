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

import styles from './Metrics.module.css'

type MetricsProps = {
  locale: string
  currency: Currency
  integratedCups?: number | null
  manualCups: string
  averageCostPerCup: number | null
  nextAverageCostPerCup: number
  onManualCupsChange: (value: string) => void
}

export default function Metrics({
  locale,
  currency,
  integratedCups,
  manualCups,
  averageCostPerCup,
  nextAverageCostPerCup,
  onManualCupsChange
}: MetricsProps) {
  const [isEditingCups, setIsEditingCups] = useState(false)

  const { t } = useTranslation()

  const cupUnit = t('overview.cup', { count: integratedCups ?? Number(manualCups || 0) })

  const displayedCups = isEditingCups
    ? manualCups
    : format.number(Number(manualCups || 0), locale)

  const currentAverageCost = averageCostPerCup === null
      ? null
      : currencyUtils.convert(averageCostPerCup, MOCK_RATES[currency])

  const nextAverageCost = currencyUtils.convert(nextAverageCostPerCup, MOCK_RATES[currency])

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
    <div className={`cardGrid contained ${styles.metricsGrid}`}>
      <div className={`card ${styles.metricsCard}`}>
        <h3>
          <ArrowLeftIcon />
          <span>{t('overview.lastCup')}</span>
        </h3>
        <p className={styles.metricValue}>{currentAverageCost === null ? '—' : renderPrice(currentAverageCost)}</p>
      </div>

      <div className={`card ${styles.metricsCard}`}>
        <h3>
          <ArrowRightIcon />
          <span>{t('overview.nextCup')}</span>
        </h3>
        <p className={styles.metricValue}>{renderPrice(nextAverageCost)}</p>
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
                name="manualCups"
                type="text"
                inputMode="numeric"
                aria-label={t('overview.cupsBrewed')}
                value={displayedCups}
                onFocus={() => setIsEditingCups(true)}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    onManualCupsChange(e.target.value)
                  }
                }}
                onBlur={() => {
                  onManualCupsChange(String(Number(manualCups || 0)))
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
  )
}
