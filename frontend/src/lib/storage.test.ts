import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  STORAGE_KEY,
  createDefaultAppData,
  loadAppData,
  saveAppData,
  resetAppData
} from './storage.ts'

function createMemoryStorage() {
  const data = new Map<string, string>()

  return {
    getItem(key: string) {
      return data.get(key) ?? null
    },
    setItem(key: string, value: string) {
      data.set(key, value)
    },
    removeItem(key: string) {
      data.delete(key)
    }
  }
}

describe('appData storage', () => {
  it('returns defaults when storage is empty', () => {
    const storage = createMemoryStorage()
    const result = loadAppData(storage)

    assert.equal(result.status, 'empty')
    assert.equal(result.data.version, 1)
    assert.equal(result.data.cupsBrewed, 0)
    assert.deepEqual(result.data.equipment, [])
    assert.equal(result.data.consumables[0].pricePerUnit, 0)
  })

  it('saves and restores user data', () => {
    const storage = createMemoryStorage()
    const data = createDefaultAppData()

    data.cupsBrewed = 1296
    data.brewSettings.doseGrams = 18.5

    data.equipment.push({
      id: 1,
      type: 'espressoMachine',
      name: 'Test machine',
      price: 2500,
      currency: 'EUR',
      acquisitionDate: '2025-09-10'
    })

    assert.equal(saveAppData(data, storage), true)

    const restored = loadAppData(storage)

    assert.equal(restored.status, 'loaded')
    assert.deepEqual(restored.data, data)
  })

  it('preserves original consumable currency', () => {
    const storage = createMemoryStorage()
    const data = createDefaultAppData()

    data.consumables[0].pricePerUnit = 35
    data.consumables[0].currency = 'EUR'

    saveAppData(data, storage)

    const restored = loadAppData(storage)

    assert.equal(restored.data.consumables[0].pricePerUnit, 35)
    assert.equal(restored.data.consumables[0].currency, 'EUR')
  })

  it('rejects invalid JSON without overwriting it', () => {
    const storage = createMemoryStorage()

    storage.setItem(STORAGE_KEY, '{invalid-json')

    const result = loadAppData(storage)

    assert.equal(result.status, 'invalid')
    assert.equal(storage.getItem(STORAGE_KEY), '{invalid-json')
  })

  it('rejects an unsupported version', () => {
    const storage = createMemoryStorage()
    const data = {
      ...createDefaultAppData(),
      version: 2
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(data))

    const result = loadAppData(storage)

    assert.equal(result.status, 'unsupported')
    assert.equal(storage.getItem(STORAGE_KEY), JSON.stringify(data))
  })

  it('rejects invalid equipment dates', () => {
    const storage = createMemoryStorage()
    const data = createDefaultAppData()

    data.equipment.push({
      id: 1,
      type: 'grinder',
      name: 'Test grinder',
      price: 1000,
      currency: 'SEK',
      acquisitionDate: '2025-02-30'
    })

    assert.equal(saveAppData(data, storage), false)
    assert.equal(storage.getItem(STORAGE_KEY), null)
  })

  it('rejects negative cup counts', () => {
    const storage = createMemoryStorage()
    const data = createDefaultAppData()

    data.cupsBrewed = -1

    assert.equal(saveAppData(data, storage), false)
  })

  it('resets saved data', () => {
    const storage = createMemoryStorage()

    saveAppData(createDefaultAppData(), storage)

    assert.equal(resetAppData(storage), true)
    assert.equal(storage.getItem(STORAGE_KEY), null)
    assert.equal(loadAppData(storage).status, 'empty')
  })

  it('handles unavailable storage', () => {
    const storage = {
      getItem(): string | null {
        throw new Error('Storage unavailable')
      },
      setItem(): void {
        throw new Error('Storage unavailable')
      },
      removeItem(): void {
        throw new Error('Storage unavailable')
      }
    }

    assert.equal(loadAppData(storage).status, 'unavailable')
    assert.equal(saveAppData(createDefaultAppData(), storage), false)
    assert.equal(resetAppData(storage), false)
  })

  it('preserves invalid data until explicitly reset', () => {
    const storage = createMemoryStorage()
    const original = '{invalid-json'

    storage.setItem(STORAGE_KEY, original)

    assert.equal(loadAppData(storage).status, 'invalid')
    assert.equal(storage.getItem(STORAGE_KEY), original)

    // Reading invalid data must not overwrite it.
    assert.equal(storage.getItem(STORAGE_KEY), original)

    // Reset is a separate, explicit operation.
    assert.equal(resetAppData(storage), true)
    assert.equal(storage.getItem(STORAGE_KEY), null)
    assert.equal(loadAppData(storage).status, 'empty')
  })

  it('reports a failed write', () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('Quota exceeded')
      },
      removeItem: () => {}
    }

    assert.equal(saveAppData(createDefaultAppData(), storage), false)
  })

  it('does not report success when reset fails', () => {
    const storage = {
      getItem: () => JSON.stringify(createDefaultAppData()),
      setItem: () => {},
      removeItem: () => {
        throw new Error('Storage unavailable')
      }
    }

    assert.equal(resetAppData(storage), false)
    assert.equal(loadAppData(storage).status, 'loaded')
  })
})
