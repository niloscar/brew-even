
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSectionScroll } from './hooks/useSectionScroll'
import { useExchangeRates } from './hooks/useExchangeRates'

import AppHeader from './components/AppHeader'
import OverviewSection from './components/overview/OverviewSection'
import SetupSection from './components/setup/SetupSection'
import SettingsSection from './components/settings/SettingsSection'
import AppFooter from './components/AppFooter'

import { calculateCosts, calculateConsumablesPerCup } from './lib/cost'
import {
  createDefaultAppData,
  loadAppData,
  resetAppData,
  saveAppData
} from './lib/storage'
import * as currencyUtils from './utils/currency'
import { MOCK_APP_DATA } from './data/mockData'

import type { Currency } from 'shared'
import type { AppData } from './types/appData'
import type { EquipmentInput } from './types/equipment'
import type { LoadResult } from './lib/storage'

const DEVELOPER_NEXT_CUP_COST_SEK = 19.83

function initializeSession(): LoadResult {
  const url = new URL(window.location.href)

  if (url.searchParams.get('mock') !== '1') return loadAppData()

  const data = structuredClone(MOCK_APP_DATA)

  if (!saveAppData(data)) return { data, status: 'unavailable' }

  url.searchParams.delete('mock')
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)

  return { data, status: 'loaded' }
}

const initialSession = initializeSession()

export default function App() {
  const [session, setSession] = useState<LoadResult>(initialSession)
  const sessionRef = useRef(session)

  const [manualCups, setManualCups] = useState(String(session.data.cupsBrewed))
  const [resetKey, setResetKey] = useState(0)

  const { rates, status: exchangeRateStatus } = useExchangeRates()

  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const { data: appData, status: storageStatus } = session

  const { currency, cupsBrewed, brewSettings, consumables, equipment } = appData

  useSectionScroll()

  function updateAppData(update: (prev: AppData) => AppData) {
    const current = sessionRef.current
    const nextData = update(current.data)

    let nextStatus = current.status

    if (nextStatus === 'empty' || nextStatus === 'loaded') {
      nextStatus = saveAppData(nextData) ? 'loaded' : 'unavailable'
    }

    const nextSession: LoadResult = {
      data: nextData,
      status: nextStatus
    }

    sessionRef.current = nextSession
    setSession(nextSession)
  }

  function handleReset() {
    if (!window.confirm(t('settings.storage.confirmReset'))) return

    if (!resetAppData()) {
      const nextSession: LoadResult = {
        ...sessionRef.current,
        status: 'unavailable'
      }

      sessionRef.current = nextSession
      setSession(nextSession)
      return
    }

    const defaults = createDefaultAppData()

    const nextSession: LoadResult = {
      data: defaults,
      status: 'empty'
    }

    sessionRef.current = nextSession
    setSession(nextSession)
    setManualCups(String(defaults.cupsBrewed))
    setResetKey((prev) => prev + 1)
  }

  function setCurrency(currency: Currency) {
    updateAppData((prev) => ({ ...prev, currency }))
  }

  function handleManualCupsChange(value: string) {
    setManualCups(value)

    const cups = Number(value || 0)

    if (!Number.isSafeInteger(cups) || cups < 0) return

    updateAppData((prev) => ({
      ...prev,
      cupsBrewed: cups
    }))
  }

  function addEquipment(values: EquipmentInput) {
    updateAppData((prev) => {
      const nextId = Math.max(0, ...prev.equipment.map((item) => item.id)) + 1

      return {
        ...prev,
        equipment: [...prev.equipment, { id: nextId, ...values }]
      }
    })
  }

  function updateEquipment(id: number, values: EquipmentInput) {
    updateAppData((prev) => ({
      ...prev,
      equipment: prev.equipment.map((item) =>
        item.id === id ? { ...item, ...values } : item
      )
    }))
  }

  function removeEquipment(id: number) {
    updateAppData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((item) => item.id !== id)
    }))
  }

  const consumablesPerCup = calculateConsumablesPerCup(
    brewSettings,
    consumables.map((item) => ({
      type: item.type,
      pricePerUnit: currencyUtils.convertToSek(
        item.pricePerUnit,
        item.currency,
        rates
      )
    }))
  )

  const normalizedEquipment = useMemo(
    () =>
      equipment.map((item) => ({
        price: currencyUtils.convertToSek(
          item.price,
          item.currency,
          rates
        ),
        acquisitionDate: item.acquisitionDate
      })),
    [equipment, rates]
  )

  const costs = calculateCosts({
    equipment: normalizedEquipment,
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
          rates={rates}
          exchangeRatesUnavailable={exchangeRateStatus === 'fallback'}
          equipment={normalizedEquipment}
          cupsBrewed={cupsBrewed}
          consumablesPerCup={consumablesPerCup}
          manualCups={manualCups}
          onManualCupsChange={handleManualCupsChange}
          averageCostPerCup={costs.averageCostPerCup}
          nextAverageCostPerCup={costs.nextAverageCostPerCup}
        />

        <SetupSection
          key={resetKey}
          locale={locale}
          currency={currency}
          rates={rates}
          brewSettings={brewSettings}
          consumables={consumables}
          equipment={equipment}
          onBrewSettingChange={(key, value) =>
            updateAppData((prev) => ({
              ...prev,
              brewSettings: {
                ...prev.brewSettings,
                [key]: value
              }
            }))
          }
          onConsumablePriceChange={(id, pricePerUnit, currency) =>
            updateAppData((prev) => ({
              ...prev,
              consumables: prev.consumables.map((item) =>
                item.id === id ? { ...item, pricePerUnit, currency } : item
              )
            }))
          }
          onAddEquipment={addEquipment}
          onUpdateEquipment={updateEquipment}
          onRemoveEquipment={removeEquipment}
        />

        <SettingsSection
          storageStatus={storageStatus}
          onResetData={handleReset}
        />
      </main>

      <AppFooter
        currency={currency}
        rates={rates}
        locale={locale}
        nextCupCost={DEVELOPER_NEXT_CUP_COST_SEK}
      />
    </>
  )
}
