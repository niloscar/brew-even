import { useTranslation } from 'react-i18next'
import useTheme from '../hooks/useTheme'
import SelectWithCaret from './SelectWithCaret'
import ThemeSwitch from './ThemeSwitch'

import type { Currency } from 'shared'

import styles from './AppHeader.module.css'

interface AppHeaderProps {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export default function AppHeader({ currency, setCurrency }: AppHeaderProps) {
  const { i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.appHeader}>
      <h1>Brew-even</h1>

      <div className={styles.localeCurrency}>
        <SelectWithCaret
          id="locale"
          aria-label="Language"
          value={i18n.language}
          onChange={(e) => void i18n.changeLanguage(e.target.value)}
        >
          <option value="de-DE">Deutsch</option>
          <option value="en-US">English</option>
          <option value="fr-FR">Français</option>
          <option value="sv-SE">Svenska</option>
        </SelectWithCaret>

        <SelectWithCaret
          id="currency"
          aria-label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
        >
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="SEK">SEK</option>
          <option value="USD">USD</option>
        </SelectWithCaret>
      </div>

      <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
    </header>
  )
}
