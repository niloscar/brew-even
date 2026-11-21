import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calculateCostCurve } from './costCurve.ts'

describe('calculateCostCurve', () => {
  it('returns a flat curve without equipment', () => {
    const points = calculateCostCurve({
      equipment: [],
      cupsBrewed: 100,
      consumablesPerCup: 5.86
    })

    assert.ok(points.length > 1)
    assert.equal(points[0].cupsBrewed, 1)
    assert.equal(points.at(-1)?.cupsBrewed, 100)
    assert.ok(points.every((point) => Math.abs(point.averagePrice - 5.86) < 1e-10))
  })
})