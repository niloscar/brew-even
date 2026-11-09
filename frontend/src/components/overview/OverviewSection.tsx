import { useTranslation } from 'react-i18next'
import Metrics from './Metrics'
import Graph from './Graph'

import type { Currency } from 'shared'

type OverviewSectionProps = {
  locale: string
  currency: Currency
  integratedCups?: number | null
}

export default function OverviewSection({ locale, currency, integratedCups }: OverviewSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="view" id="overview">
      <h2>{t('overview.title')}</h2>

      <Graph />

      <Metrics 
        locale={locale} 
        currency={currency} 
        integratedCups={integratedCups} 
      />
    </section>
  )
}
