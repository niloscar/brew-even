import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_EQUIPMENT_PRICE, MAX_EQUIPMENT_PRICE_LENGTH, SETUP_PART_OPTIONS } from '../../settings/constants'
import { normalizeEquipmentPriceInput, clampEquipmentPrice } from '../../utils/equipment'
import SelectWithCaret from '../ui/SelectWithCaret'
import { CheckIcon, XIcon } from '@phosphor-icons/react'

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
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage ?? i18n.language

  const [draft, setDraft] = useState<EquipmentDraft>({
    type: initialValues?.type ?? SETUP_PART_OPTIONS[0].value,
    name: initialValues?.name ?? '',
    price: initialValues ? String(initialValues.price) : '',
    currency: initialValues?.currency ?? currency,
    acquisitionDate: initialValues?.acquisitionDate ?? ''
  })

  const isPriceOverMax = Number(draft.price.replace(',', '.')) > MAX_EQUIPMENT_PRICE

  function updateField<K extends keyof EquipmentDraft>(
    key: K,
    value: EquipmentDraft[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const price = clampEquipmentPrice(draft.price)

    if (
      !draft.name.trim() ||
      !draft.price.trim() ||
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

      <SelectWithCaret
        id="equipment-type"
        wrapperClassName={styles.categorySelect}
        value={draft.type}
        onChange={(e) => updateField('type', e.target.value as EquipmentType)}
      >
        {SETUP_PART_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(`setup.equipmentTypes.${option.value}`)}
          </option>
        ))}
      </SelectWithCaret>

      <label htmlFor="equipment-name">{t('setup.equipmentName')}</label>

      <input
        id="equipment-name"
        type="text"
        required
        maxLength={100}
        value={draft.name}
        onChange={(e) => updateField('name', e.target.value)}
      />

      <label htmlFor="equipment-price">{t('setup.equipmentPrice')}</label>

      <div className={styles.priceInputGroup}>
        <input
          id="equipment-price"
          type="text"
          inputMode="decimal"
          maxLength={MAX_EQUIPMENT_PRICE_LENGTH}
          required
          value={draft.price}
          aria-invalid={isPriceOverMax}
          className={isPriceOverMax ? styles.invalid : undefined}
          onChange={(e) => {
            const value = normalizeEquipmentPriceInput(e.target.value, locale)

            if (value !== null) updateField('price', value)
          }}
          onBlur={() => {
            const price = clampEquipmentPrice(draft.price)
            updateField('price', normalizeEquipmentPriceInput(String(price), locale) ?? '0')
          }}
        />

        <SelectWithCaret
          wrapperClassName={styles.currencySelect}
          aria-label={t('setup.equipmentCurrency')}
          value={draft.currency}
          onChange={(e) => updateField('currency', e.target.value as Currency)}
        >
          {CURRENCIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </SelectWithCaret>
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
          <XIcon aria-hidden="true" />
          <span>{t('common.cancel')}</span>
        </button>

        <button type="submit" className="buttonAccent">
          <CheckIcon aria-hidden="true" />
          <span>{t('common.save')}</span>
        </button>
      </div>
    </form>
  )
}
