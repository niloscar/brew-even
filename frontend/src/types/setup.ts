import type { Currency } from 'shared'

export type BrewSettings = {
  doseGrams: number
  yieldGrams: number
}

export type Consumable = {
  id: number
  type: 'coffeeBeans' | 'water'
  pricePerUnit: number
  currency: Currency
}