import type { Currency } from 'shared'

export type EquipmentType =
  | 'espressoMachine'
  | 'grinder'
  | 'scale'
  | 'knockBox'
  | 'coffeeCanister'
  | 'tamper'
  | 'wdt'
  | 'tampingMat'
  | 'waterTestKit'

export type Equipment = {
  id: number
  type: EquipmentType
  name: string
  price: number
  currency: Currency
  acquisitionDate: string
}

export type EquipmentInput = Omit<Equipment, 'id'>