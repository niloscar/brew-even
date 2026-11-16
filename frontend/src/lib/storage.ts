
import type { Currency } from 'shared'
import type { AppData } from '../types/appData'
import type { Consumable } from '../types/setup'
import type { Equipment } from '../types/equipment'

export const STORAGE_KEY = 'brew-even-app-data'

export type StorageStatus =
  | 'empty'
  | 'loaded'
  | 'invalid'
  | 'unsupported'
  | 'unavailable'

export type LoadResult = {
  data: AppData
  status: StorageStatus
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const CURRENCIES = ['SEK', 'EUR', 'USD', 'GBP']

const EQUIPMENT_TYPES = [
  'espressoMachine',
  'grinder',
  'scale',
  'knockBox',
  'coffeeCanister',
  'tamper',
  'wdt',
  'tampingMat',
  'waterTestKit'
]

export function createDefaultAppData(currency: Currency = 'SEK'): AppData {
  return {
    version: 1,
    currency,
    cupsBrewed: 0,
    brewSettings: {
      doseGrams: 15,
      yieldGrams: 30
    },
    consumables: [
      {
        id: 1,
        type: 'coffeeBeans',
        pricePerUnit: 0,
        currency
      },
      {
        id: 2,
        type: 'water',
        pricePerUnit: 0,
        currency
      }
    ],
    equipment: []
  }
}

function getStorage(storage?: StorageLike): StorageLike {
  return storage ?? window.localStorage
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

function isNonNegativeNumber(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0
  )
}

function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && CURRENCIES.includes(value)
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00Z`)

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  )
}

function isEquipment(value: unknown): value is Equipment {
  if (!isRecord(value)) return false

  return (
    Number.isSafeInteger(value.id) &&
    (value.id as number) > 0 &&
    typeof value.type === 'string' &&
    EQUIPMENT_TYPES.includes(value.type) &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    value.name.length <= 100 &&
    isNonNegativeNumber(value.price) &&
    isCurrency(value.currency) &&
    isValidDate(value.acquisitionDate)
  )
}

function isConsumable(value: unknown): value is Consumable {
  if (!isRecord(value)) return false

  return (
    Number.isSafeInteger(value.id) &&
    (value.id as number) > 0 &&
    (value.type === 'coffeeBeans' || value.type === 'water') &&
    isNonNegativeNumber(value.pricePerUnit) &&
    isCurrency(value.currency)
  )
}

function isAppData(value: unknown): value is AppData {
  if (!isRecord(value)) return false
  if (value.version !== 1) return false

  if (!isCurrency(value.currency)) return false

  if (
    !Number.isSafeInteger(value.cupsBrewed) ||
    (value.cupsBrewed as number) < 0
  ) {
    return false
  }

  if (!isRecord(value.brewSettings)) return false

  if (
    !isNonNegativeNumber(value.brewSettings.doseGrams) ||
    !isNonNegativeNumber(value.brewSettings.yieldGrams)
  ) {
    return false
  }

  if (
    !Array.isArray(value.equipment) ||
    !value.equipment.every(isEquipment)
  ) {
    return false
  }

  const equipmentIds = value.equipment.map((item: Equipment) => item.id)

  if (new Set(equipmentIds).size !== equipmentIds.length) return false

  if (
    !Array.isArray(value.consumables) ||
    value.consumables.length !== 2 ||
    !value.consumables.every(isConsumable)
  ) {
    return false
  }

  const types = value.consumables.map((item: Consumable) => item.type)

  const ids = value.consumables.map((item: Consumable) => item.id)

  return (
    types.includes('coffeeBeans') &&
    types.includes('water') &&
    new Set(types).size === 2 &&
    new Set(ids).size === ids.length
  )
}

export function loadAppData(storage?: StorageLike): LoadResult {
  const defaults = createDefaultAppData()

  let raw: string | null

  try {
    raw = getStorage(storage).getItem(STORAGE_KEY)
  } catch {
    return { data: defaults, status: 'unavailable' }
  }

  if (raw === null) return { data: defaults, status: 'empty' }

  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    return { data: defaults, status: 'invalid' }
  }

  if (!isRecord(parsed)) return { data: defaults, status: 'invalid' }

  if (typeof parsed.version !== 'number') return { data: defaults, status: 'invalid' }

  if (parsed.version !== 1) return { data: defaults, status: 'unsupported' }

  if (!isAppData(parsed)) return { data: defaults, status: 'invalid' }

  return { data: parsed, status: 'loaded' }
}

export function saveAppData(data: AppData, storage?: StorageLike): boolean {
  if (!isAppData(data)) return false

  try {
    getStorage(storage).setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )
    return true
  } catch {
    return false
  }
}

export function resetAppData(storage?: StorageLike): boolean {
  try {
    getStorage(storage).removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
