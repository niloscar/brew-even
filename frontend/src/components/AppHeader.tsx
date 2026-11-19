import useTheme from '../hooks/useTheme'
import Logo from './Logo'
import ThemeSwitch from './ui/ThemeSwitch'

import styles from './AppHeader.module.css'

export default function AppHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.appHeader}>

      <Logo />

      <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
    </header>
  )
}