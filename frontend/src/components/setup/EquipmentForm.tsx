import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SETUP_PART_OPTIONS } from '../../settings/constants'

import type { SubmitEvent } from 'react'
import type { Currency } from 'shared'
import type {
  Equipment,
  EquipmentInput,
  EquipmentType
} from '../../types/equipment'

import styles from './EquipmentForm.module.css'

interface EquipmentFormProps {
  currency: Currency
  initialValues?: Equipment
  onSave: (values: EquipmentInput) => void
  onCancel: () => void
}

type EquipmentDraft = Omit<EquipmentInput, 'price'> & { price: string }

const CURRENCIES: Currency[] = ['SEK', 'EUR', 'USD', 'GBP']

export default function EquipmentForm({
  currency,
  initialValues,
  onSave,
  onCancel
}: EquipmentFormProps) {
  const { t } = useTranslation()

  const [draft, setDraft] = useState<EquipmentDraft>({
    type: initialValues?.type ?? SETUP_PART_OPTIONS[0].value,
    name: initialValues?.name ?? '',
    price: initialValues ? String(initialValues.price) : '',
    currency: initialValues?.currency ?? currency,
    acquisitionDate: initialValues?.acquisitionDate ?? ''
  })

  function updateField<K extends keyof EquipmentDraft>(
    key: K,
    value: EquipmentDraft[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const price = Number(draft.price)

    if (
      !draft.name.trim() ||
      !draft.price.trim() ||
      !Number.isFinite(price) ||
      price < 0 ||
      !draft.acquisitionDate
    ) {
      return
    }

    onSave({
      type: draft.type,
      name: draft.name.trim(),
      price,
      currency: draft.currency,
      acquisitionDate: draft.acquisitionDate
    })
  }

  return (
    <form
      className={`formGrid ${styles.equipmentForm}`}
      onSubmit={handleSubmit}
    >
      <label htmlFor="equipment-type">{t('setup.equipmentCategory')}</label>
      <select
        id="equipment-type"
        value={draft.type}
        onChange={(e) => updateField('type', e.target.value as EquipmentType)}
      >
        {SETUP_PART_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(`setup.equipmentTypes.${option.value}`)}
          </option>
        ))}
      </select>

      <label htmlFor="equipment-name">{t('setup.equipmentName')}</label>
      <input
        id="equipment-name"
        type="text"
        required
        maxLength={100}
        value={draft.name}
        onChange={(e) => updateField('name', e.target.value)}
      />

      <label htmlFor="equipment-price">
        {t('setup.equipmentPrice')}
      </label>

      <div className={styles.priceInputGroup}>
        <input
          id="equipment-price"
          type="number"
          min="0"
          step="any"
          required
          value={draft.price}
          onChange={(e) => updateField('price', e.target.value)}
        />

        <select
          aria-label={t('setup.equipmentCurrency')}
          value={draft.currency}
          onChange={(e) =>
            updateField('currency', e.target.value as Currency)
          }
        >
          {CURRENCIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <label htmlFor="equipment-date">{t('setup.equipmentDate')}</label>
      <input
        id="equipment-date"
        type="date"
        required
        value={draft.acquisitionDate}
        onChange={(e) => updateField('acquisitionDate', e.target.value)}
      />

      <div className={styles.formActions}>
        <button type="button" onClick={onCancel}>
          {t('common.cancel')}
        </button>

        <button type="submit" className="buttonAccent">
          {t('common.save')}
        </button>
      </div>
    </form>
  )
}
