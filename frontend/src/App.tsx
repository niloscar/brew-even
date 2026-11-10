import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AppHeader from './components/AppHeader'
import OverviewSection from './components/overview/OverviewSection'
import SetupSection from './components/setup/SetupSection'
import SettingsSection from './components/settings/SettingsSection'
import AppFooter from './components/AppFooter'

import { calculateCosts, calculateConsumablesPerCup } from './lib/cost'
import * as currencyUtils from './utils/currency'
import { MOCK_SETUP_PARTS, MOCK_SETTINGS, MOCK_CONSUMABLES, MOCK_RATES } from './data/mockData'

import type { Currency } from 'shared'
import type { Equipment, EquipmentInput } from './types/equipment'

const DEFAULT_CUPS_BREWED = 1289

export default function App() {
  const [currency, setCurrency] = useState<Currency>(import.meta.env.VITE_DEFAULT_CURRENCY as Currency)
  const [manualCups, setManualCups] = useState(String(DEFAULT_CUPS_BREWED))
  const [brewSettings, setBrewSettings] = useState(MOCK_SETTINGS)
  const [consumables, setConsumables] = useState(MOCK_CONSUMABLES)
  const [equipment, setEquipment] = useState<Equipment[]>(MOCK_SETUP_PARTS)

  const { i18n } = useTranslation()
  const locale = i18n.language

  function addEquipment(values: EquipmentInput) {
    setEquipment((prev) => {
      const nextId = Math.max(0, ...prev.map((item) => item.id)) + 1

      return [
        ...prev,
        { id: nextId, ...values }
      ]
    })
  }

  function updateEquipment(id: number, values: EquipmentInput) {
    setEquipment((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...values } : item
      )
    )
  }

  function removeEquipment(id: number) {
    setEquipment((prev) =>
      prev.filter((item) => item.id !== id)
    )
  }

  const cupsBrewed = Number(manualCups || 0)
  const consumablesPerCup = calculateConsumablesPerCup(brewSettings, consumables)

  const costs = calculateCosts({
    equipment: equipment.map((item) => ({
      price: currencyUtils.convertToSek(item.price, item.currency, MOCK_RATES),
      acquisitionDate: item.acquisitionDate
    })),
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
          equipment={equipment}
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
          onAddEquipment={addEquipment}
          onUpdateEquipment={updateEquipment}
          onRemoveEquipment={removeEquipment}
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
