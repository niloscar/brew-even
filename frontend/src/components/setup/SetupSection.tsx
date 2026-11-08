import BrewSettingsForm from './BrewSettingsForm'
import ConsumablesForm from './ConsumablesForm'
import EquipmentList from './EquipmentList'
import {
  CoffeeBeanIcon,
  PlusIcon, 
  SlidersHorizontalIcon,
  ToolboxIcon
} from '@phosphor-icons/react'

import styles from './SetupSection.module.css'

import type { Currency } from 'shared'

interface SetupSectionProps {
  locale: string
  currency: Currency
}

export default function SetupSection({ locale, currency }: SetupSectionProps) {
  return (
    <section className="view" id="setup">
      <h2>Setup</h2>

      <div className="cardGrid contained col2">
        <section className="card">
          <h3>
            <SlidersHorizontalIcon />
            <span>Brew settings</span>
          </h3>

          <BrewSettingsForm />
        </section>

        <section className="card">
          <h3>
            <CoffeeBeanIcon />
            <span>Consumables</span>
          </h3>

          <ConsumablesForm locale={locale} currency={currency} />
        </section>

        <section className="card span2">
          <button
            aria-label="Add new equipment"
            className={styles.addEquipmentButton}
            onClick={() => alert('Add new equipment')}
          >
            <PlusIcon />
          </button>
          <h3>
            <ToolboxIcon />
            <span>Equipment</span>
          </h3>
          <EquipmentList locale={locale} currency={currency} />
        </section>
      </div>
    </section>
  )
}
