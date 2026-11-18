
import { useTranslation } from 'react-i18next'

import Metrics from './Metrics'
import Chart from './Chart'
import StatusMessage from '../ui/StatusMessage'

import type { Currency } from 'shared'
import type { EquipmentPurchase } from '../../lib/cost'

import styles from './OverviewSection.module.css'

type OverviewSectionProps = {
  locale: string
  currency: Currency
  rates: Record<Currency, number>
  exchangeRatesUnavailable: boolean
  equipment: EquipmentPurchase[]
  cupsBrewed: number
  consumablesPerCup: number
  integratedCups?: number | null
  manualCups: string
  averageCostPerCup: number | null
  nextAverageCostPerCup: number
  onManualCupsChange: (value: string) => void 
}

export default function OverviewSection({
  locale,
  currency,
  rates,
  exchangeRatesUnavailable,
  equipment,
  cupsBrewed,
  consumablesPerCup,
  integratedCups,
  manualCups,
  averageCostPerCup,
  nextAverageCostPerCup,
  onManualCupsChange
}: OverviewSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="view" id="overview">
      <div className={styles.heading}>
        <h2>{t('overview.title')}</h2>

        {exchangeRatesUnavailable && (
          <StatusMessage>
            {t('overview.exchangeRates.fallback')}
          </StatusMessage>
        )}
      </div>

      <div className="cardGrid contained col1">
        <Metrics
          locale={locale}
          currency={currency}
          rates={rates}
          integratedCups={integratedCups}
          manualCups={manualCups}
          averageCostPerCup={averageCostPerCup}
          nextAverageCostPerCup={nextAverageCostPerCup}
          onManualCupsChange={onManualCupsChange}
        />

        <Chart
          rates={rates}
          equipment={equipment}
          cupsBrewed={cupsBrewed}
          consumablesPerCup={consumablesPerCup}
          locale={locale}
          currency={currency}
        />
      </div>
    </section>
  )
}
