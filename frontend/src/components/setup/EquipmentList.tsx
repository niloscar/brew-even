
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CaretDownIcon,
  PencilSimpleIcon,
  TrashIcon,
  CheckIcon,
  XIcon
} from '@phosphor-icons/react'

import { MOCK_RATES } from '../../data/mockData'
import { SETUP_PART_OPTIONS } from '../../settings/constants'
import * as currencyUtils from '../../utils/currency'
import * as format from '../../utils/format'

import type { Currency } from 'shared'
import type {
  Equipment,
  EquipmentInput,
  EquipmentType
} from '../../types/equipment'

import styles from './EquipmentList.module.css'

type EquipmentListProps = {
  locale: string
  currency: Currency
  equipment: Equipment[]
  onEdit: (id: number, values: EquipmentInput) => void
  onRemove: (id: number) => void
}

type EquipmentDraft = {
  type: EquipmentType
  name: string
  price: string
  currency: Currency
}

type EditingState = {
  id: number
  draft: EquipmentDraft
}

const CURRENCIES: Currency[] = ['SEK', 'EUR', 'USD', 'GBP']

export default function EquipmentList({
  locale,
  currency,
  equipment,
  onEdit,
  onRemove
}: EquipmentListProps) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState<EditingState | null>(null)

  function displayPrice(part: Equipment): number {
    const priceInSek = currencyUtils.convertToSek(
      part.price,
      part.currency,
      MOCK_RATES
    )

    return currencyUtils.convert(priceInSek, MOCK_RATES[currency])
  }

  function startEditing(part: Equipment) {
    setEditing((current) =>
      current?.id === part.id
        ? null
        : {
            id: part.id,
            draft: {
              type: part.type,
              name: part.name,
              price: String(part.price),
              currency: part.currency
            }
          }
    )
  }

  function updateField<K extends keyof EquipmentDraft>(
    key: K,
    value: EquipmentDraft[K]
  ) {
    setEditing((current) =>
      current
        ? {
            ...current,
            draft: { ...current.draft, [key]: value }
          }
        : null
    )
  }

  function handleSave(event: FormEvent<HTMLFormElement>, part: Equipment) {
    event.preventDefault()

    if (editing?.id !== part.id) return

    const { draft } = editing
    const price = Number(draft.price)

    if (
      !draft.name.trim() ||
      !draft.price.trim() ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return
    }

    onEdit(part.id, {
      type: draft.type,
      name: draft.name.trim(),
      price,
      currency: draft.currency,
      acquisitionDate: part.acquisitionDate
    })

    setEditing(null)
  }

  function handleRemove(part: Equipment) {
    if (!window.confirm(t('setup.confirmRemoveEquipment', {
      name: part.name
    }))) {
      return
    }

    onRemove(part.id)

    if (editing?.id === part.id) {
      setEditing(null)
    }
  }

  const sortedEquipment = [...equipment].sort(
    (a, b) => displayPrice(b) - displayPrice(a)
  )

  const totalPrice = equipment.reduce(
    (sum, part) => sum + displayPrice(part),
    0
  )

  return (
    <ul className={styles.equipmentList}>
      {sortedEquipment.map((part) => {
        const isEditing = editing?.id === part.id

        return (
          <li
            key={part.id}
            title={t('setup.acquiredOn', {
              date: new Intl.DateTimeFormat(locale).format(
                new Date(`${part.acquisitionDate}T00:00:00`)
              )
            })}
          >
            {isEditing ? (
              <form
                className={styles.equipmentEditForm}
                onSubmit={(event) => handleSave(event, part)}
              >
                <div className={styles.equipmentTypeSelect}>
                  <select
                    aria-label={t('setup.equipmentCategory')}
                    value={editing.draft.type}
                    onChange={(e) =>
                      updateField('type', e.target.value as EquipmentType)
                    }
                  >
                    {SETUP_PART_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(`setup.equipmentTypes.${option.value}`)}
                      </option>
                    ))}
                  </select>

                  <CaretDownIcon size={12} aria-hidden="true" />
                </div>

                <input
                  type="text"
                  aria-label={t('setup.equipmentName')}
                  required
                  maxLength={100}
                  value={editing.draft.name}
                  onChange={(e) =>
                    updateField('name', e.target.value)
                  }
                />

                <div className={styles.equipmentPriceGroup}>
                  <input
                    type="number"
                    aria-label={t('setup.equipmentPrice')}
                    min="0"
                    step="any"
                    required
                    value={editing.draft.price}
                    onChange={(e) =>
                      updateField('price', e.target.value)
                    }
                  />

                  <div className={styles.equipmentCurrencySelect}>
                    <select
                      aria-label={t('setup.equipmentCurrency')}
                      value={editing.draft.currency}
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

                    <CaretDownIcon size={12} aria-hidden="true" />
                  </div>
                </div>

                <div className={styles.equipmentActions}>
                  <button
                    type="submit"
                    aria-label={t('common.save')}
                    title={t('common.save')}
                  >
                    <CheckIcon />
                  </button>

                  <button
                    type="button"
                    aria-label={t('common.cancel')}
                    title={t('common.cancel')}
                    onClick={() => setEditing(null)}
                  >
                    <XIcon />
                  </button>
                </div>
              </form>
            ) : (
              <>
                <span className={styles.equipmentType}>
                  {t(`setup.equipmentTypes.${part.type}`)}
                </span>

                <span className={styles.equipmentName}>
                  {part.name}
                </span>

                <span className={styles.equipmentPrice}>
                  {format.price(displayPrice(part), locale, currency)}
                </span>

                <div className={styles.equipmentActions}>
                  <button
                    type="button"
                    aria-label={`${t('common.edit')}: ${part.name}`}
                    onClick={() => startEditing(part)}
                  >
                    <PencilSimpleIcon />
                  </button>

                  <button
                    type="button"
                    aria-label={`${t('common.remove')}: ${part.name}`}
                    onClick={() => handleRemove(part)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </>
            )}
          </li>
        )
      })}

      <li className={styles.equipmentTotal}>
        <span className={styles.equipmentTotalPrice}>
          {format.price(totalPrice, locale, currency)}
        </span>
      </li>
    </ul>
  )
}
