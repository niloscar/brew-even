import { MAX_EQUIPMENT_PRICE } from '../settings/constants'

export function normalizeEquipmentPriceInput(value: string, locale: string): string | null {
  const decimalSeparator = new Intl.NumberFormat(locale)
    .formatToParts(1.1)
    .find((part) => part.type === 'decimal')?.value ?? '.'

  const rawValue = value
    .replace(/[.,]/g, decimalSeparator)
    .replace(/^0+(?=\d)/, '')

  return /^\d*(?:\.\d*)?$/.test(rawValue.replace(decimalSeparator, '.'))
    ? rawValue
    : null
}

export function clampEquipmentPrice(value: string): number {
  const price = Number(value.replace(',', '.'))

  return Number.isFinite(price)
    ? Math.min(MAX_EQUIPMENT_PRICE, Math.max(0, price))
    : 0
}
