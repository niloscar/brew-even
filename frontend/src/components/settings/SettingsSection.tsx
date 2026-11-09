import { useTranslation } from 'react-i18next'
import CoffeeIntegrationForm from './CoffeeIntegrationForm'
import { PlugsIcon } from '@phosphor-icons/react'

export default function SettingsSection() {
  const { t } = useTranslation()

  return (
    <section className="view" id="settings">
      <h2>{t('settings.title')}</h2>

      <div className="cardGrid col1">
        <section className="card">
          <h3>
            <PlugsIcon />
            <span>{t('settings.connectSetup')}</span>
          </h3>

          <p>{t('settings.connectDescription')}</p>
          <p>{t('settings.automaticUpdates')}</p>

          <CoffeeIntegrationForm />
        </section>
      </div>
    </section>
  )
}
