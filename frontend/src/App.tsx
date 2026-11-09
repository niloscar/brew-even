import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AppHeader from './components/AppHeader'
import OverviewSection from './components/overview/OverviewSection'
import SetupSection from './components/setup/SetupSection'
import SettingsSection from './components/settings/SettingsSection'
import AppFooter from './components/AppFooter'

import { calculateCosts, calculateConsumablesPerCup } from './lib/cost'
import {
  MOCK_SETUP_PARTS,
  MOCK_SETTINGS,
  MOCK_CONSUMABLES
} from './data/mockData'

import type { Currency } from 'shared'

const DEFAULT_CUPS_BREWED = 1289

export default function App() {
  const [currency, setCurrency] = useState<Currency>(import.meta.env.VITE_DEFAULT_CURRENCY as Currency)
  const [manualCups, setManualCups] = useState(String(DEFAULT_CUPS_BREWED))
  const [brewSettings, setBrewSettings] = useState(MOCK_SETTINGS)
  const [consumables, setConsumables] = useState(MOCK_CONSUMABLES)

  const { i18n } = useTranslation()
  const locale = i18n.language

  const cupsBrewed = Number(manualCups || 0)

  const coffeeBeans = MOCK_CONSUMABLES.find((item) => item.type === 'coffeeBeans')
  if (!coffeeBeans) throw new Error('Coffee beans not found')

  const consumablesPerCup = calculateConsumablesPerCup(brewSettings, consumables)

  const costs = calculateCosts({
    equipment: MOCK_SETUP_PARTS,
    cupsBrewed,
    consumablesPerCup
  })

  return (
    <>
      <AppHeader currency={currency} setCurrency={setCurrency} />

      <main>
        <OverviewSection
          locale={locale}
          currency={currency}
          manualCups={manualCups}
          onManualCupsChange={setManualCups}
          averageCostPerCup={costs.averageCostPerCup}
          nextAverageCostPerCup={costs.nextAverageCostPerCup}
        />

        <SetupSection
          locale={locale}
          currency={currency}
          brewSettings={brewSettings}
          consumables={consumables}
          onBrewSettingChange={(key, value) =>
            setBrewSettings((prev) => ({
              ...prev,
              [key]: value
            }))
          }
          onConsumablePriceChange={(id, pricePerUnit) =>
            setConsumables((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, pricePerUnit } : item
              )
            )
          }
        />

        <SettingsSection />
      </main>

      <AppFooter
        currency={currency}
        locale={locale}
        nextCupCost={costs.nextAverageCostPerCup}
      />
    </>
  )
}
