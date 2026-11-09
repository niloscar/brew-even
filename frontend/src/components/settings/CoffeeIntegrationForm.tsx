import { useTranslation } from 'react-i18next'

export default function CoffeeIntegrationForm() {
  const { t } = useTranslation()

  return (
    <form className="formGrid" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="supplier">{t('settings.supplier')}</label>
      <select className="buttonLike" id="supplier" name="supplier" disabled>
        {/* <option value="laMarzocco">La Marzocco</option> */}
      </select>

      <label htmlFor="apiKey">{t('settings.apiKey')}</label>
      <input
        type="password"
        id="apiKey"
        name="apiKey"
        autoComplete="off"
        disabled
      />

      <button type="submit">{t('settings.connect')}</button>
    </form>
  )
}