import { useTranslation } from 'react-i18next'
import SelectWithCaret from '../SelectWithCaret'
import { PlugsConnectedIcon } from '@phosphor-icons/react'

export default function CoffeeIntegrationForm() {
  const { t } = useTranslation()

  return (
    <form className="formGrid" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="supplier">{t('settings.supplier')}</label>
      <SelectWithCaret
        className="buttonLike" 
        id="supplier" 
        name="supplier" 
        disabled>
        {/* <option value="laMarzocco">La Marzocco</option> */}
      </SelectWithCaret>

      <label htmlFor="apiKey">{t('settings.apiKey')}</label>
      <input
        type="password"
        id="apiKey"
        name="apiKey"
        autoComplete="off"
        disabled
      />

      <button 
        type="submit"
        disabled
      >
        <PlugsConnectedIcon aria-hidden="true" />
        {t('settings.connect')}
      </button>
    </form>
  )
}