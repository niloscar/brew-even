import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './NumberStepperInput.module.css'

interface NumberStepperInputProps {
  id: string
  label: string
  value: number
  onChange: (newValue: number) => void
  min?: number
  max?: number
  maxLength?: number
  step?: number
  unit?: string
}

export default function NumberStepperInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  max,
  maxLength,
  step = 1,
  unit = ''
}: NumberStepperInputProps) {
  const { t, i18n } = useTranslation()
  const [draft, setDraft] = useState<string | null>(null)

  const locale = i18n.resolvedLanguage ?? i18n.language

  const decimalSeparator =
    new Intl.NumberFormat(locale)
      .formatToParts(1.1)
      .find((part) => part.type === 'decimal')?.value ?? '.'

  const formattedValue = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 20
  }).format(value)

  function clamp(value: number): number {
    return Math.min(max ?? Infinity, Math.max(min, value))
  }

  function handleAdjust(direction: 1 | -1) {
    const decimals = (step.toString().split('.')[1] ?? '').length
    const factor = 10 ** decimals

    const currentValue =
      draft === null ? value : Number(draft.replace(',', '.')) || 0

    const nextValue =
      Math.round((currentValue + direction * step) * factor) / factor

    setDraft(null)
    onChange(clamp(nextValue))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value
      .replace(/[.,]/g, decimalSeparator)
      .replace(/^(-?)0+(?=\d)/, '$1')

    const normalized = rawValue.replace(decimalSeparator, '.')

    if (!/^-?\d*(?:\.\d*)?$/.test(normalized)) return

    setDraft(rawValue)

    if (rawValue === '') return

    const newValue = Number(normalized)

    if (!Number.isFinite(newValue)) return
    if (newValue < min || (max !== undefined && newValue > max)) return

    onChange(newValue)
  }

  function handleBlur() {
    if (draft !== null) {
      const newValue = Number(draft.replace(',', '.'))

      if (draft === '' || !Number.isFinite(newValue)) {
        onChange(clamp(0))
      } else if (newValue < min || (max !== undefined && newValue > max)) {
        onChange(clamp(newValue))
      }
    }

    setDraft(null)
  }

  function handleFocus() {
    setDraft(value.toString().replace('.', decimalSeparator))
  }

  const isOverMax = draft !== null 
    && max !== undefined 
    && Number(draft.replace(',', '.')) > max

  return (
    <div className={styles.inputWrapper} data-unit={unit}>
      <input
        className={isOverMax ? styles.invalid : undefined}
        type="text"
        inputMode="decimal"
        id={id}
        value={draft ?? formattedValue}
        maxLength={maxLength}
        aria-invalid={isOverMax}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={unit ? `${label} (${unit})` : undefined}
      />

      <div className={styles.inputStepper}>
        <button
          type="button"
          aria-label={t('common.increase', { label })}
          onClick={() => handleAdjust(1)}
        >
          +
        </button>

        <button
          type="button"
          aria-label={t('common.decrease', { label })}
          onClick={() => handleAdjust(-1)}
        >
          −
        </button>
      </div>
    </div>
  )
}
