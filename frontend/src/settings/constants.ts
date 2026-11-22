import type { EquipmentType } from '../types/equipment'

export const SETUP_PART_OPTIONS = [
  { value: 'espressoMachine', label: 'Machine' },
  { value: 'grinder', label: 'Grinder' },
  { value: 'scale', label: 'Scale' },
  { value: 'knockBox', label: 'Knock box' },
  { value: 'coffeeCanister', label: 'Canister' },
  { value: 'tamper', label: 'Tamper' },
  { value: 'wdt', label: 'WDT' },
  { value: 'tampingMat', label: 'Tamping mat' },
  { value: 'waterTestKit', label: 'Water test kit' }
] satisfies { value: EquipmentType; label: string }[]

export const CONSUMABLE_OPTIONS = [
  { value: 'coffeeBeans', label: 'Coffee beans', unit: 'kg' },
  { value: 'water', label: 'Water', unit: 'L' },
  { value: 'electricity', label: 'Electricity', unit: 'kWh' },
  { value: 'milk', label: 'Milk', unit: 'L' },
  { value: 'cleaningProducts', label: 'Cleaning products', unit: 'item' }
]

export const MAX_EQUIPMENT_PRICE = 10_000_000
export const MAX_EQUIPMENT_PRICE_LENGTH = String(MAX_EQUIPMENT_PRICE).length + 3