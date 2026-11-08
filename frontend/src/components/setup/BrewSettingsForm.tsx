import { useState } from 'react'
import NumberStepperInput from '../NumberStepperInput'
import { MOCK_SETTINGS } from '../../data/mockData'

type BrewSetting = 'gramsBeansPerCup' | 'gramsCoffeePerCup'

export default function BrewSettingsForm() {
  const [settings, setSettings] = useState(MOCK_SETTINGS)

  function handleSettingChange(name: BrewSetting, value: number) {
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form className="formGrid">
      <label htmlFor="gramsBeansPerCup">Beans per cup</label>
      <NumberStepperInput
        id="gramsBeansPerCup"
        label="Beans per cup"
        value={settings.gramsBeansPerCup}
        onChange={(value) => handleSettingChange('gramsBeansPerCup', value)}
        step={0.1}
        unit="g"
      />

      <label htmlFor="gramsCoffeePerCup">Coffee per cup</label>
      <NumberStepperInput
        id="gramsCoffeePerCup"
        label="Coffee per cup"
        value={settings.gramsCoffeePerCup}
        onChange={(value) => handleSettingChange('gramsCoffeePerCup', value)}
        step={0.1}
        unit="g"
      />
    </form>
  )
}
