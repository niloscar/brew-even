import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberStepperInput from '../NumberStepperInput'
import { MOCK_SETTINGS } from '../../data/mockData'

type BrewSetting = keyof typeof MOCK_SETTINGS

export default function BrewSettingsForm() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState(MOCK_SETTINGS)

  function handleSettingChange(name: BrewSetting, value: number) {
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form className="formGrid">
      <label htmlFor="doseGrams">
        {t('setup.coffeeDose')}
      </label>
      <NumberStepperInput
        id="doseGrams"
        label={t('setup.coffeeDose')}
        value={settings.doseGrams}
        onChange={(value) => handleSettingChange('doseGrams', value)}
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
        onChange={(value) => handleSettingChange('yieldGrams', value)}
        step={0.1}
        unit="g"
      />
    </form>
  )
}
