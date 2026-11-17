
import { useTranslation } from 'react-i18next'
import { DatabaseIcon, PlugsIcon } from '@phosphor-icons/react'
import CoffeeIntegrationForm from './CoffeeIntegrationForm'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'

import type { StorageStatus } from '../../lib/storage'

type SettingsSectionProps = {
  storageStatus: StorageStatus
  onResetData: () => void
}

export default function SettingsSection({ storageStatus, onResetData }: SettingsSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="view" id="settings">
      <h2>{t('settings.title')}</h2>

      <div className="cardGrid contained col1">
        <section className="card">
          <h3>
            <PlugsIcon />
            <span>{t('settings.connectSetup')}</span>
          </h3>

          <p>{t('settings.connectDescription')}</p>

          <CoffeeIntegrationForm />
        </section>

        <section className="card">
          <h3>
            <DatabaseIcon />
            <span>{t('settings.storage.title')}</span>
          </h3>

          <p>{t('settings.storage.description')}</p>

          <div className="settingsAction">
            <button
              type="button"
              onClick={onResetData}
              disabled={
                storageStatus === 'empty' ||
                storageStatus === 'unavailable'
              }
            >
              <ArrowCounterClockwiseIcon aria-hidden="true" />
              {t('settings.storage.reset')}
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}
