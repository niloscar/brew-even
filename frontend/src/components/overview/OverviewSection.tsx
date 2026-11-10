
import { useTranslation } from 'react-i18next'

import Metrics from './Metrics'
import Chart from './Chart'

import type { Currency } from 'shared'
import type { EquipmentPurchase } from '../../lib/cost'

type OverviewSectionProps = {
  locale: string
  currency: Currency
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
      <h2>{t('overview.title')}</h2>

      <div className="cardGrid contained col1">
        <Metrics
          locale={locale}
          currency={currency}
          integratedCups={integratedCups}
          manualCups={manualCups}
          averageCostPerCup={averageCostPerCup}
          nextAverageCostPerCup={nextAverageCostPerCup}
          onManualCupsChange={onManualCupsChange}
        />

        <Chart
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
