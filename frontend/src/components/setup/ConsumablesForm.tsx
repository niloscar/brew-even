import { Fragment, useState } from 'react'
import NumberStepperInput from '../NumberStepperInput'
import * as currencyUtils from '../../utils/currency'
import { MOCK_CONSUMABLES, MOCK_RATES } from '../../data/mockData'
import { CONSUMABLE_OPTIONS } from '../../settings/constants'

import type { Currency } from 'shared'

type ConsumableId = (typeof MOCK_CONSUMABLES)[number]['id']

const CURRENCY_STEPS: Record<Currency, number> = {
  SEK: 1,
  EUR: 0.1,
  USD: 0.1,
  GBP: 0.1,
}

export default function ConsumablesForm({ locale, currency }: { locale: string; currency: Currency }) {
  const [consumables, setConsumables] = useState(MOCK_CONSUMABLES)

  function handleConsumablePrice(id: ConsumableId, amount: number) {
    if (!Number.isFinite(amount)) return

    setConsumables((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              pricePerUnit: Math.max(0, amount) / MOCK_RATES[currency]
            }
          : item
      )
    )
  }


  const currencySymbol =
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? currency

  function displayPrice(price: number) {
    return Number(currencyUtils.convert(price, MOCK_RATES[currency]).toFixed(2))
  }

  return (
    <form className="formGrid" onSubmit={(e) => e.preventDefault()}>
      {consumables.map((consumable) => {
        const option = CONSUMABLE_OPTIONS.find(
          (option) => option.value === consumable.type
        )

        const price = displayPrice(consumable.pricePerUnit)
        const unit = option?.unit ?? 'item'

        return (
          <Fragment key={consumable.id}>
            <label htmlFor={`consumable-${consumable.id}`}>
              {option?.label}
            </label>

            <NumberStepperInput
              id={`consumable-${consumable.id}`}
              label={`${option?.label} price`}
              value={price}
              onChange={(value) => handleConsumablePrice(consumable.id, value)}
              min={0}
              step={CURRENCY_STEPS[currency]}
              unit={`${currencySymbol}/${unit}`}
            />
          </Fragment>
        )
      })}
    </form>
  )
}
