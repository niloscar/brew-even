import { calculateCosts } from './cost'
import type { EquipmentPurchase } from './cost'

export type CostCurvePoint = {
  cupsBrewed: number
  averagePrice: number
}

type CostCurveInput = {
  equipment: EquipmentPurchase[]
  cupsBrewed: number
  consumablesPerCup: number
  startCups?: number
  endCups?: number
}

const MAX_POINTS = 160

export function calculateCostCurve({ equipment, cupsBrewed, consumablesPerCup, startCups = 1, endCups = cupsBrewed }: CostCurveInput): CostCurvePoint[] {
  if (!Number.isSafeInteger(cupsBrewed) || cupsBrewed < 0) throw new RangeError('Invalid cup count')

  if (!Number.isSafeInteger(startCups) || startCups < 1) throw new RangeError('Invalid start cup count')

  if (!Number.isSafeInteger(endCups) || endCups < 0) throw new RangeError('Invalid end cup count')

  if (endCups < startCups) return []

  const pointCount = Math.min(endCups - startCups + 1, MAX_POINTS )

  return Array.from({ length: pointCount }, (_, index) => {
    const count = pointCount === 1
      ? startCups
      : Math.round(startCups + (index * (endCups - startCups)) / (pointCount - 1))

    const costs = calculateCosts({ equipment, cupsBrewed: count, consumablesPerCup })

    if (costs.averageCostPerCup === null) throw new Error('Unable to calculate average cost')

    return {
      cupsBrewed: count,
      averagePrice: costs.averageCostPerCup
    }
  })
}
