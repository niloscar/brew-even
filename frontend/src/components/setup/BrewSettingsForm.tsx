import { useTranslation } from 'react-i18next'
import NumberStepperInput from '../NumberStepperInput'
import { MOCK_SETTINGS } from '../../data/mockData'

type BrewSettingsFormProps = {
  settings: typeof MOCK_SETTINGS
  onChange: (
    key: keyof typeof MOCK_SETTINGS,
    value: number
  ) => void
}

export default function BrewSettingsForm({ settings, onChange }: BrewSettingsFormProps) {
  const { t } = useTranslation()

  return (
    <form className="formGrid">
      <label htmlFor="doseGrams">
        {t('setup.coffeeDose')}
      </label>
      <NumberStepperInput
        id="doseGrams"
        label={t('setup.coffeeDose')}
        value={settings.doseGrams}
        onChange={(value) => onChange('doseGrams', value)}
        step={0.1}
        unit="g"
      />

      <label htmlFor="yieldGrams">
        {t('setup.espressoYield')}
      </label>
      <NumberStepperInput
        id="yieldGrams"
        label={t('setup.espressoYield')}
        value={settings.yieldGrams}
        onChange={(value) => onChange('yieldGrams', value)}
        step={0.1}
        unit="g"
      />
    </form>
  )
}
