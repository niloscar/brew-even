import type { Currency } from 'shared'
import useTheme from '../hooks/useTheme'
import ThemeSwitch from './ThemeSwitch'

import styles from './AppHeader.module.css'

interface AppHeaderProps {
  locale: string
  setLocale: (locale: string) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export default function AppHeader({ locale, setLocale, currency, setCurrency }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.appHeader}>
      <h1>Brew-even</h1>

      <div className={styles.localeCurrency}>
        <select
          id="locale"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
        >
          <option value="sv-SE">Swedish</option>
          <option value="en-US">English</option>
          <option value="de-DE">German</option>
          <option value="fr-FR">French</option>
        </select>

        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
        >
          <option value="SEK">SEK</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
    </header>
  )
}
