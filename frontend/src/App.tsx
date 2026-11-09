import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AppHeader from './components/AppHeader'
import OverviewSection from './components/overview/OverviewSection'
import SetupSection from './components/setup/SetupSection'
import SettingsSection from './components/settings/SettingsSection'
import AppFooter from './components/AppFooter'

import type { Currency } from 'shared'

const OSCARS_NEXT_CUP_COST = 51.21
const OSCARS_CUPS_BREWED = null //1274

export default function App() {
  const [currency, setCurrency] = useState<Currency>(import.meta.env.VITE_DEFAULT_CURRENCY as Currency)
  
  const { i18n } = useTranslation()
  const locale = i18n.language

  return (
    <>
      <AppHeader
        currency={currency}
        setCurrency={setCurrency}
      />

      <main>
        <OverviewSection
          locale={locale}
          currency={currency}
          integratedCups={OSCARS_CUPS_BREWED}
        />

        <SetupSection
          locale={locale}
          currency={currency}
        />

        <SettingsSection />
      </main>

      <AppFooter 
        currency={currency}
        locale={locale}
        nextCupCost={OSCARS_NEXT_CUP_COST}
      />
    </>
  )
}
