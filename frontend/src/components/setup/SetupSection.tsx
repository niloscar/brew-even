import { useTranslation } from 'react-i18next'
import BrewSettingsForm from './BrewSettingsForm'
import ConsumablesForm from './ConsumablesForm'
import EquipmentList from './EquipmentList'
import { MOCK_SETTINGS, MOCK_CONSUMABLES } from '../../data/mockData'
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
  brewSettings: typeof MOCK_SETTINGS
  consumables: typeof MOCK_CONSUMABLES
  onBrewSettingChange: (
    key: keyof typeof MOCK_SETTINGS,
    value: number
  ) => void
  onConsumablePriceChange: (
    id: number,
    pricePerUnit: number
  ) => void
}

export default function SetupSection({ locale, currency, brewSettings, consumables, onBrewSettingChange, onConsumablePriceChange }: SetupSectionProps) {
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

          <BrewSettingsForm
            settings={brewSettings}
            onChange={onBrewSettingChange}
          />
        </section>

        <section className="card">
          <h3>
            <CoffeeBeanIcon />
            <span>{t('setup.consumables')}</span>
          </h3>

          <ConsumablesForm
            locale={locale}
            currency={currency}
            consumables={consumables}
            onPriceChange={onConsumablePriceChange}
          />
        </section>

        <section className="card span2">
          <div className={styles.equipmentHeader}>
            <h3>
              <ToolboxIcon />
              <span>{t('setup.equipment')}</span>
            </h3>

            <button
              type="button"
              aria-label={t('setup.addEquipment')}
              className={styles.addEquipmentButton}
              onClick={() => alert(t('setup.addEquipment'))}
            >
              <PlusIcon weight="bold" />
              <span>{t('common.add')}</span>
            </button>
          </div>

          <EquipmentList locale={locale} currency={currency} />
        </section>
      </div>
    </section>
  )
}
