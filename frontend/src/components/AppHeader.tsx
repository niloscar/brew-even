import useTheme from '../hooks/useTheme'
import SelectWithCaret from './ui/SelectWithCaret'
import ThemeSwitch from './ui/ThemeSwitch'
import { LANGUAGES } from '../i18n/languages'

import type { Currency } from 'shared'

import styles from './AppHeader.module.css'

interface AppHeaderProps {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export default function AppHeader({ currency, setCurrency }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.appHeader}>

      <h1>Brew-even</h1>

      <div className={styles.localeCurrency}>
        <SelectWithCaret
          id="locale"
          aria-label="Language"
          value={window.location.pathname.replace(/\/$/, '') || '/'}
          onChange={(e) => window.location.assign(e.target.value)}
        >
          {Object.entries(LANGUAGES).map(([path, { label }]) => (
            <option key={path} value={path}>{label}</option>
          ))}
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
