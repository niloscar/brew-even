
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
  step = 1,
  unit = ''
}: NumberStepperInputProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<string | null>(null)

  function handleAdjust(direction: 1 | -1) {
    const decimals = (step.toString().split('.')[1] ?? '').length
    const factor = 10 ** decimals

    const nextValue = Math.round((value + direction * step) * factor) / factor

    setDraft(null)
    onChange(Math.min(max ?? Infinity, Math.max(min, nextValue)))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value
    setDraft(rawValue)

    if (rawValue === '') return

    const newValue = event.target.valueAsNumber

    if (!Number.isFinite(newValue)) return

    onChange(Math.min(max ?? Infinity, Math.max(min, newValue)))
  }

  function handleBlur() {
    if (draft === '') {
      onChange(0)
    }

    setDraft(null)
  }

  return (
    <div className={styles.inputWrapper} data-unit={unit}>
      <input
        type="number"
        id={id}
        value={draft ?? value}
        min={min}
        max={max}
        step={step}
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
