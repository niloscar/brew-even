
export type EquipmentPurchase = {
  price: number
  acquisitionDate: string
}

type CostInput = {
  equipment: EquipmentPurchase[]
  cupsBrewed: number
  consumablesPerCup: number
  asOfDate?: string
}

type CostSummary = {
  equipmentCost: number
  consumablesCost: number
  totalCost: number
  averageCostPerCup: number | null
  nextAverageCostPerCup: number
  marginalCostPerCup: number
}


export function calculateBeanCostPerCup(doseGrams: number, pricePerKg: number): number {
  if (!Number.isFinite(doseGrams) || doseGrams < 0) {
    throw new RangeError('doseGrams must be a non-negative number')
  }

  if (!Number.isFinite(pricePerKg) || pricePerKg < 0) {
    throw new RangeError('pricePerKg must be a non-negative number')
  }

  return (doseGrams / 1000) * pricePerKg
}

export function calculateConsumablesPerCup(
  settings: { doseGrams: number; yieldGrams: number },
  consumables: { type: string; pricePerUnit: number }[]
): number {
  if (
    consumables.some(
      (item) =>
        !Number.isFinite(item.pricePerUnit) ||
        item.pricePerUnit < 0
    )
  ) {
    throw new RangeError('Invalid consumable price')
  }

  if (!Number.isFinite(settings.yieldGrams) || settings.yieldGrams < 0) {
    throw new RangeError('Invalid espresso yield')
  }

  const beans = consumables.find((item) => item.type === 'coffeeBeans')
  const water = consumables.find((item) => item.type === 'water')

  const beanCost = calculateBeanCostPerCup(
    settings.doseGrams,
    beans?.pricePerUnit ?? 0
  )

  const waterCost =
    (settings.yieldGrams / 1000) * (water?.pricePerUnit ?? 0)

  return beanCost + waterCost
}

export function calculateCosts({ equipment, cupsBrewed, consumablesPerCup, asOfDate }: CostInput): CostSummary {
  if (!Number.isSafeInteger(cupsBrewed) || cupsBrewed < 0) {
    throw new RangeError('cupsBrewed must be a non-negative integer')
  }

  if (!Number.isFinite(consumablesPerCup) || consumablesPerCup < 0) {
    throw new RangeError('consumablesPerCup must be a non-negative number')
  }

  if (
    equipment.some((item) => !Number.isFinite(item.price) || item.price < 0)
  ) {
    throw new RangeError('Equipment prices must be non-negative numbers')
  }

  if (asOfDate !== undefined && !isValidDate(asOfDate)) {
    throw new RangeError('Invalid asOfDate')
  }

  if (equipment.some((item) => !isValidDate(item.acquisitionDate))) {
    throw new RangeError('Invalid equipment acquisition date')
  }

  const equipmentCost = equipment
    .filter((item) => !asOfDate || item.acquisitionDate <= asOfDate)
    .reduce((sum, item) => sum + item.price, 0)

  const consumablesCost = cupsBrewed * consumablesPerCup
  const totalCost = equipmentCost + consumablesCost

  return {
    equipmentCost,
    consumablesCost,
    totalCost,
    averageCostPerCup: cupsBrewed > 0 ? totalCost / cupsBrewed : null,
    nextAverageCostPerCup: (totalCost + consumablesPerCup) / (cupsBrewed + 1),
    marginalCostPerCup: consumablesPerCup
  }
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00Z`)

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}