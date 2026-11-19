import { useTranslation } from 'react-i18next'
import { navigateToLanguage } from '../../i18n'
import { LANGUAGES } from '../../i18n/languages'
import SelectWithCaret from '../ui/SelectWithCaret'

import type { Currency } from 'shared';

export default function PreferencesForm({ currency, setCurrency }: { currency: Currency; setCurrency: (currency: Currency) => void }) {
  const { t } = useTranslation()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigateToLanguage(e.target.value)
  }

  return (
    <div className="formGrid">
      <label htmlFor="locale">{t('settings.language')}</label>
      <SelectWithCaret
        className="buttonLike"
        id="locale"
        value={window.location.pathname.replace(/\/$/, '') || '/'}
        onChange={handleLanguageChange}
      >
        {Object.entries(LANGUAGES).map(([path, { label }]) => (
          <option key={path} value={path}>
            {label}
          </option>
        ))}
      </SelectWithCaret>

      <label htmlFor="currency">{t('settings.currency')}</label>
      <SelectWithCaret
        className="buttonLike"
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
      >
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="SEK">SEK</option>
        <option value="USD">USD</option>
      </SelectWithCaret>
    </div>
  )
}
