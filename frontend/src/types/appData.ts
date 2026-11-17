
import type { Currency } from 'shared'
import type { Equipment } from './equipment'
import type { BrewSettings, Consumable } from './setup'

export type AppData = {
  version: 1
  currency: Currency
  cupsBrewed: number
  brewSettings: BrewSettings
  consumables: Consumable[]
  equipment: Equipment[]
}
