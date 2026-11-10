import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import BrewSettingsForm from './BrewSettingsForm'
import ConsumablesForm from './ConsumablesForm'
import EquipmentList from './EquipmentList'
import EquipmentForm from './EquipmentForm'
import { MOCK_SETTINGS, MOCK_CONSUMABLES } from '../../data/mockData'
import {
  CoffeeBeanIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  ToolboxIcon
} from '@phosphor-icons/react'

import styles from './SetupSection.module.css'

import type { Currency } from 'shared'
import type { Equipment, EquipmentInput } from '../../types/equipment'

interface SetupSectionProps {
  locale: string
  currency: Currency
  brewSettings: typeof MOCK_SETTINGS
  consumables: typeof MOCK_CONSUMABLES
  equipment: Equipment[]
  onBrewSettingChange: (
    key: keyof typeof MOCK_SETTINGS,
    value: number
  ) => void
  onConsumablePriceChange: (
    id: number,
    pricePerUnit: number
  ) => void
  onAddEquipment: (values: EquipmentInput) => void
  onUpdateEquipment: (id: number, values: EquipmentInput) => void
  onRemoveEquipment: (id: number) => void
}

export default function SetupSection({ 
  locale, 
  currency, 
  brewSettings, 
  consumables, 
  equipment, 
  onBrewSettingChange, 
  onConsumablePriceChange,
  onAddEquipment,
  onUpdateEquipment,
  onRemoveEquipment
}: SetupSectionProps) {
  const [formTarget, setFormTarget] = useState<'new' | number | null>(null)
  const { t } = useTranslation()

  const editingEquipment = typeof formTarget === 'number'
    ? equipment.find((item) => item.id === formTarget)
    : undefined

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

            {formTarget === null && (
              <button
                type="button"
                className={styles.addEquipmentButton}
                onClick={() => setFormTarget('new')}
              >
                <PlusIcon weight="bold" />
                <span>{t('common.add')}</span>
              </button>
            )}
          </div>

          {(formTarget === 'new' || editingEquipment) && (
            <>
              <h4>{editingEquipment ? t('common.edit') : t('common.add')}</h4>
              <EquipmentForm
                key={formTarget}
                currency={currency}
                initialValues={editingEquipment}
                onSave={(values) => {
                  if (typeof formTarget === 'number') {
                    onUpdateEquipment(formTarget, values)
                  } else {
                    onAddEquipment(values)
                  }

                  setFormTarget(null)
                }}
                onCancel={() => setFormTarget(null)}
              />
            </>
          )}

          <EquipmentList
            locale={locale}
            currency={currency}
            equipment={equipment}
            onEdit={onUpdateEquipment}
            onRemove={onRemoveEquipment}
          />
        </section>
      </div>
    </section>
  )
}
