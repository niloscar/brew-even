import type { EquipmentPurchase } from './cost'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function dateToTimestamp(value: string): number {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

export function calculateDailyBrewRate(equipment: EquipmentPurchase[], cupsBrewed: number, today: string): number | null {
  if (cupsBrewed <= 0 || equipment.length === 0) return null

  const oldestDate = equipment.reduce(
    (oldest, item) => item.acquisitionDate < oldest
      ? item.acquisitionDate
      : oldest,
    equipment[0].acquisitionDate
  )

  const start = dateToTimestamp(oldestDate)
  const end = dateToTimestamp(today)

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    return null
  }

  const elapsedDays = Math.max(1, Math.floor((end - start) / MS_PER_DAY) + 1)

  return cupsBrewed / elapsedDays
}
