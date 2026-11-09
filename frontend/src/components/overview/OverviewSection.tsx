import { useTranslation } from 'react-i18next'
import Metrics from './Metrics'
import Graph from './Graph'

import type { Currency } from 'shared'

type OverviewSectionProps = {
  locale: string
  currency: Currency
  integratedCups?: number | null
  manualCups: string
  averageCostPerCup: number | null
  nextAverageCostPerCup: number
  onManualCupsChange: (value: string) => void
}

export default function OverviewSection({ locale, currency, integratedCups, manualCups, averageCostPerCup, nextAverageCostPerCup, onManualCupsChange }: OverviewSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="view" id="overview">
      <h2>{t('overview.title')}</h2>

      <Graph />

      <Metrics
        locale={locale}
        currency={currency}
        integratedCups={integratedCups}
        manualCups={manualCups}
        averageCostPerCup={averageCostPerCup}
        nextAverageCostPerCup={nextAverageCostPerCup}
        onManualCupsChange={onManualCupsChange}
      />
    </section>
  )
}
