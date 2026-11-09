import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calculateCosts, calculateBeanCostPerCup } from './cost.ts'
import {
  MOCK_SETUP_PARTS,
  MOCK_SETTINGS,
  MOCK_CONSUMABLES
} from '../data/mockData.ts'

describe('calculateCosts', () => {
  const equipment = [
    { price: 43000, acquisitionDate: '2025-09-10' },
    { price: 10000, acquisitionDate: '2025-10-01' }
  ]

  it('calculates total and average cost per cup', () => {
    const result = calculateCosts({
      equipment,
      cupsBrewed: 1000,
      consumablesPerCup: 5
    })

    assert.equal(result.equipmentCost, 53000)
    assert.equal(result.consumablesCost, 5000)
    assert.equal(result.totalCost, 58000)
    assert.equal(result.averageCostPerCup, 58)
  })

  it('calculates the cost after the next cup', () => {
    const result = calculateCosts({
      equipment,
      cupsBrewed: 1000,
      consumablesPerCup: 5
    })

    assert.equal(result.marginalCostPerCup, 5)
    assert.equal(result.nextAverageCostPerCup, 58005 / 1001)
  })

  it('handles zero brewed cups', () => {
    const result = calculateCosts({
      equipment,
      cupsBrewed: 0,
      consumablesPerCup: 5
    })

    assert.equal(result.averageCostPerCup, null)
    assert.equal(result.nextAverageCostPerCup, 53005)
  })

  it('only includes equipment purchased by the given date', () => {
    const result = calculateCosts({
      equipment,
      cupsBrewed: 100,
      consumablesPerCup: 5,
      asOfDate: '2025-09-30'
    })

    assert.equal(result.equipmentCost, 43000)
    assert.equal(result.totalCost, 43500)
  })

  it('includes equipment purchased on the given date', () => {
    const result = calculateCosts({
      equipment,
      cupsBrewed: 100,
      consumablesPerCup: 5,
      asOfDate: '2025-10-01'
    })

    assert.equal(result.equipmentCost, 53000)
  })

  it('handles a setup without equipment', () => {
    const result = calculateCosts({
      equipment: [],
      cupsBrewed: 100,
      consumablesPerCup: 5
    })

    assert.equal(result.equipmentCost, 0)
    assert.equal(result.averageCostPerCup, 5)
    assert.equal(result.nextAverageCostPerCup, 5)
  })

  it('rejects invalid cup counts', () => {
    for (const cupsBrewed of [-1, 1.5, NaN, Infinity]) {
      assert.throws(
        () =>
          calculateCosts({
            equipment,
            cupsBrewed,
            consumablesPerCup: 5
          }),
        RangeError
      )
    }
  })

  it('rejects invalid consumable costs', () => {
    for (const consumablesPerCup of [-1, NaN, Infinity]) {
      assert.throws(
        () =>
          calculateCosts({
            equipment,
            cupsBrewed: 100,
            consumablesPerCup
          }),
        RangeError
      )
    }
  })

  it('rejects invalid equipment prices', () => {
    for (const price of [-100, NaN, Infinity]) {
      assert.throws(
        () =>
          calculateCosts({
            equipment: [{ price, acquisitionDate: '2025-09-10' }],
            cupsBrewed: 100,
            consumablesPerCup: 5
          }),
        RangeError
      )
    }
  })

  it('rejects invalid asOfDate', () => {
    for (const asOfDate of ['2025-02-30', '2025-13-01', '2025-2-01']) {
      assert.throws(
        () =>
          calculateCosts({
            equipment,
            cupsBrewed: 100,
            consumablesPerCup: 5,
            asOfDate
          }),
        RangeError
      )
    }
  })

  it('rejects invalid equipment acquisition dates', () => {
    for (const acquisitionDate of ['2025-02-30', '2025-13-01', 'invalid']) {
      assert.throws(
        () =>
          calculateCosts({
            equipment: [{ price: 1000, acquisitionDate }],
            cupsBrewed: 100,
            consumablesPerCup: 5
          }),
        RangeError
      )
    }
  })

  it('handles leap year dates correctly', () => {
    const leapYearEquipment = [{ price: 1000, acquisitionDate: '2024-02-29' }]

    const before = calculateCosts({
      equipment: leapYearEquipment,
      cupsBrewed: 100,
      consumablesPerCup: 5,
      asOfDate: '2024-02-28'
    })

    const after = calculateCosts({
      equipment: leapYearEquipment,
      cupsBrewed: 100,
      consumablesPerCup: 5,
      asOfDate: '2024-02-29'
    })

    assert.equal(before.equipmentCost, 0)
    assert.equal(after.equipmentCost, 1000)
  })

  describe('calculateBeanCostPerCup', () => {
    it('calculates bean cost based on dose and price per kg', () => {
      assert.equal(calculateBeanCostPerCup(15, 378), 5.67)
    })

    it('handles zero dose and zero price', () => {
      assert.equal(calculateBeanCostPerCup(0, 378), 0)
      assert.equal(calculateBeanCostPerCup(15, 0), 0)
    })

    it('supports fractional doses', () => {
      assert.ok(Math.abs(calculateBeanCostPerCup(18.5, 400) - 7.4) < 1e-10)
    })

    it('rejects invalid doses', () => {
      for (const dose of [-1, NaN, Infinity]) {
        assert.throws(() => calculateBeanCostPerCup(dose, 378), RangeError)
      }
    })

    it('rejects invalid prices', () => {
      for (const price of [-1, NaN, Infinity]) {
        assert.throws(() => calculateBeanCostPerCup(15, price), RangeError)
      }
    })
  })

  it('calculates costs using the existing mock setup', () => {
    const beans = MOCK_CONSUMABLES.find((item) => item.type === 'coffeeBeans')

    assert.ok(beans)

    const consumablesPerCup = calculateBeanCostPerCup(
      MOCK_SETTINGS.doseGrams,
      beans.pricePerUnit
    )

    const result = calculateCosts({
      equipment: MOCK_SETUP_PARTS,
      cupsBrewed: 1274,
      consumablesPerCup
    })

    assert.equal(result.equipmentCost, 61124)
    assert.ok(Math.abs(result.consumablesCost - 7223.58) < 1e-8)
    assert.ok(Math.abs(result.totalCost - 68347.58) < 1e-8)
  })
})
