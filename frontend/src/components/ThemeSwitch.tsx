import { type MouseEvent } from 'react'
import styles from './ThemeSwitch.module.css'

type ThemeSwitchProps = {
  theme: 'light' | 'dark'
  toggleTheme: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function ThemeSwitch({
  theme,
  toggleTheme
}: ThemeSwitchProps) {
  return (
    <button
      onClick={toggleTheme}
      className={styles.themeSwitch}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span
        className={`${styles.icon} ${
          theme === 'light' ? styles.espresso : styles.latte
        }`}
        aria-hidden="true"
      />
    </button>
  )
}