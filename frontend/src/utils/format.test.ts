
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { number, priceParts } from './format.ts'

describe('number formatting', () => {
  it('preserves regular formatting when no length limit is set', () => {
    const result = number(1234.567, 'sv-SE')

    assert.equal(
      result,
      new Intl.NumberFormat('sv-SE', {
        maximumFractionDigits: 2
      }).format(1234.567)
    )
  })

  it('preserves regular formatting when the value fits', () => {
    const result = number(1234, 'sv-SE', 0, 8)

    assert.equal(
      result,
      new Intl.NumberFormat('sv-SE', {
        maximumFractionDigits: 0
      }).format(1234)
    )
  })

  it('uses compact notation for large numbers', () => {
    const result = number(1234567, 'sv-SE', 0, 8)

    assert.equal(
      result,
      new Intl.NumberFormat('sv-SE', {
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(1234567)
    )
  })

  it('removes compact decimals when necessary', () => {
    const result = number(123456789, 'sv-SE', 0, 6)

    assert.equal(
      result,
      new Intl.NumberFormat('sv-SE', {
        notation: 'compact',
        maximumFractionDigits: 0
      }).format(123456789)
    )
  })
})

describe('priceParts formatting', () => {
  it('preserves decimals for small prices', () => {
    const parts = priceParts(0.01, 'sv-SE', 'SEK', 10)

    assert.equal(parts.find((part) => part.type === 'fraction')?.value, '01')
    assert.equal(parts.some((part) => part.type === 'compact'), false)
  })

  it('rounds to whole currency units before using compact notation', () => {
    const parts = priceParts(4923.45, 'sv-SE', 'SEK', 10)

    const result = parts.map((part) => part.value).join('')

    const expected = new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0
    }).format(4923.45)

    assert.equal(result, expected)
    assert.equal(parts.some((part) => part.type === 'compact'), false)
  })

  it('preserves regular formatting when the rounded price fits', () => {
    const parts = priceParts(999999, 'sv-SE', 'SEK', 10)

    assert.equal(parts.some((part) => part.type === 'compact'), false)
    assert.equal(parts.map((part) => part.value).join('').length, 10)
  })

  it('uses compact notation for large prices', () => {
    const parts = priceParts(9876543, 'sv-SE', 'SEK', 10)

    assert.equal(parts.some((part) => part.type === 'compact'), true)
    assert.ok(parts.map((part) => part.value).join('').length <= 10)
  })

  it('supports all languages and currencies', () => {
    const combinations = [
      ['sv-SE', 'SEK'],
      ['en-US', 'USD'],
      ['de-DE', 'EUR'],
      ['fr-FR', 'GBP']
    ] as const

    for (const [locale, currency] of combinations) {
      const parts = priceParts(98765432, locale, currency, 10)

      assert.equal(
        parts.some((part) => part.type === 'compact'),
        true,
        `${locale} / ${currency}`
      )

      assert.equal(
        parts.some((part) => part.type === 'currency'),
        true,
        `${locale} / ${currency}`
      )
    }
  })
})
