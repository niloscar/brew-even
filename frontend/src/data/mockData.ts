import type { Equipment } from '../types/equipment'

export const MOCK_RATES = {
  SEK: 1,
  USD: 0.11,
  EUR: 0.10,
  GBP: 0.09
}

export const MOCK_SETUP_PARTS: Equipment[] = [
  {
    id: 1,
    type: 'espressoMachine',
    name: 'La Marzocco Linea Micra',
    price: 43000,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 2,
    type: 'grinder',
    name: 'Eureka Oro Mignon Stark W',
    price: 10009,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 3,
    type: 'grinder',
    name: '1Zpresso X-Ultra',
    price: 1828,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 4,
    type: 'scale',
    name: 'Acaia Lunar',
    price: 3430,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 5,
    type: 'knockBox',
    name: 'Black Angle',
    price: 295,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 6,
    type: 'coffeeCanister',
    name: 'Fellow Atmos 1,2 l',
    price: 499,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 7,
    type: 'coffeeCanister',
    name: 'Fellow Atmos 0,7 l',
    price: 449,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 8,
    type: 'tamper',
    name: 'Normcore V4.1 tamper',
    price: 674,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 9,
    type: 'wdt',
    name: 'Subminimal Flick',
    price: 429,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 10,
    type: 'tampingMat',
    name: 'JoeFrex',
    price: 164,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  },
  {
    id: 11,
    type: 'waterTestKit',
    name: 'JBL Pro Aquatest x2',
    price: 347,
    currency: 'SEK',
    acquisitionDate: '2025-09-10'
  }
] 

export const MOCK_SETTINGS = {
  doseGrams: 15,
  yieldGrams: 30
}

export const MOCK_CONSUMABLES = [
  {
    id: 1,
    type: 'coffeeBeans',
    pricePerUnit: 378,
    currency: 'SEK'
  },
  {
    id: 2,
    type: 'water',
    pricePerUnit: 6.33,
    currency: 'SEK'
  }
]

export const MOCK_ALTERNATIVES = [
  {
    id: 1,
    type: 'coffeeShop',
    pricePerCup: 40,
    currency: 'SEK'
  },
  {
    id: 2,
    type: 'dripCoffee',
    pricePerCup: 15,
    currency: 'SEK'
  }
]
