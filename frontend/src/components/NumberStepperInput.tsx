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
  function handleAdjust(direction: 1 | -1) {
    const decimals = (step.toString().split('.')[1] ?? '').length
    const factor = 10 ** decimals

    const nextValue =
      Math.round((value + direction * step) * factor) / factor

    onChange(Math.min(max ?? Infinity, Math.max(min, nextValue)))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.valueAsNumber

    if (!Number.isFinite(newValue)) return

    onChange(Math.min(max ?? Infinity, Math.max(min, newValue)))
  }

  return (
    <div className={styles.inputWrapper} data-unit={unit}>
      <input
        type="number"
        id={id}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        aria-label={unit ? `${label} (${unit})` : undefined}
      />

      <div className={styles.inputStepper}>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => handleAdjust(1)}
        >
          +
        </button>

        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => handleAdjust(-1)}
        >
          −
        </button>
      </div>
    </div>
  )
}