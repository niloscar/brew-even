import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  return (
    <section className="view" id="setup">
      <h2>{t('setup.title')}</h2>

      <div className="cardGrid contained col2">
        <section className="card">
          <h3>
            <SlidersHorizontalIcon />
            <span>{t('setup.brewSettings')}</span>
          </h3>

          <BrewSettingsForm />
        </section>

        <section className="card">
          <h3>
            <CoffeeBeanIcon />
            <span>{t('setup.consumables')}</span>
          </h3>

          <ConsumablesForm locale={locale} currency={currency} />
        </section>

        <section className="card span2">
          <button
            aria-label={t('setup.addEquipment')}
            className={styles.addEquipmentButton}
            onClick={() => alert(t('setup.addEquipment'))}
          >
            <PlusIcon weight="bold" />
          </button>
          <h3>
            <ToolboxIcon />
            <span>{t('setup.equipment')}</span>
          </h3>
          <EquipmentList locale={locale} currency={currency} />
        </section>
      </div>
    </section>
  )
}
