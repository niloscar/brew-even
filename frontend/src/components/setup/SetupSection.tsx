import { useState } from 'react'
import * as currencyUtils from '../../utils/currency'
import * as format from '../../utils/format'
import NumberStepperInput from '../NumberStepperInput'

import styles from './SetupSection.module.css'

import {
  CONSUMABLE_OPTIONS,
  SETUP_PART_OPTIONS
} from '../../settings/constants'
import {
  MOCK_SETTINGS,
  MOCK_CONSUMABLES,
  MOCK_SETUP_PARTS,
  MOCK_RATES
} from '../../data/mockData'

import type { Currency } from 'shared'

interface SetupSectionProps {
  locale: string
  currency: Currency
}

type BrewSetting = 'gramsBeansPerCup' | 'gramsCoffeePerCup'
type ConsumableId = (typeof MOCK_CONSUMABLES)[number]['id']

export default function SetupSection({ locale, currency }: SetupSectionProps) {
  const [settings, setSettings] = useState(MOCK_SETTINGS)
  const [consumables, setConsumables] = useState(MOCK_CONSUMABLES)

  function handleSettingChange(name: BrewSetting, value: number) {
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }))
  }

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

  const sortedSetupParts = [...MOCK_SETUP_PARTS].sort((a, b) => {
    return b.price - a.price
  })

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
    <section className="view" id="setup">
      <h2>Setup</h2>

      <div className="cardGrid col2">
        <section className="card">
          <h3>Brew settings</h3>

          <form className="formGrid">
              <label htmlFor="gramsBeansPerCup">Beans per cup</label>
              <NumberStepperInput
                id="gramsBeansPerCup"
                label="Beans per cup"
                value={settings.gramsBeansPerCup}
                onChange={(value) => handleSettingChange('gramsBeansPerCup', value)}
                step={0.1}
                unit="g"
              />

              <label htmlFor="gramsCoffeePerCup">Coffee per cup</label>
              <NumberStepperInput
                id="gramsCoffeePerCup"
                label="Coffee per cup"
                value={settings.gramsCoffeePerCup}
                onChange={(value) => handleSettingChange('gramsCoffeePerCup', value)}
                step={0.1}
                unit="g"
              />
          </form>
        </section>

        <section className="card">
          <h3>Consumables</h3>

          <form className="formGrid" onSubmit={(e) => e.preventDefault()}>
            {consumables.map((consumable) => {
              const option = CONSUMABLE_OPTIONS.find(
                (option) => option.value === consumable.type
              )

              const price = displayPrice(consumable.pricePerUnit)
              const unit = option?.unit ?? 'item'

              return (
                <>
                  <label htmlFor={`consumable-${consumable.id}`}>
                    {option?.label}
                  </label>

                  <NumberStepperInput
                    id={`consumable-${consumable.id}`}
                    label={`${option?.label} price`}
                    value={price}
                    onChange={(value) =>
                      handleConsumablePrice(consumable.id, value)
                    }
                    min={0}
                    step={0.01}
                    unit={`${currencySymbol}/${unit}`}
                  />
                </>
              )
            })}
          </form>
        </section>

        <section className="card span2">
          <h3>Hardware</h3>
          <ul className={styles.setupPartsList}>
            {sortedSetupParts.map((part) => (
              <li key={part.id} title={`Acquired on ${part.acquisitionDate}`}>
                <span className={styles.setupPartType}>
                  {
                    SETUP_PART_OPTIONS.find(
                      (option) => option.value === part.type
                    )?.label
                  }
                </span>
                <span className={styles.setupPartName}>{part.name}</span>
                <span className={styles.setupPartPrice}>
                  {format.price(part.price, locale, currency)}
                </span>
              </li>
            ))}
            <li className={styles.setupPartsTotal}>
              <span className={styles.setupPartsTotalPrice}>
                {format.price(
                  sortedSetupParts.reduce((sum, part) => sum + part.price, 0),
                  locale,
                  currency
                )}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </section>
  )
}
