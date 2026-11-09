import styles from './Graph.module.css'
import { useTranslation } from 'react-i18next'

export default function Graph() {
  const { t } = useTranslation()

  return (
    <div className={styles.graphContainer}>
      <i className={styles.graphLabel}>{t('overview.comingSoon')}</i>
    </div>
  )
}
