
import { useTranslation } from 'react-i18next'
import { PlugsIcon, TrashIcon } from '@phosphor-icons/react'
import CoffeeIntegrationForm from './CoffeeIntegrationForm'

import type { StorageStatus } from '../../lib/storage'

type SettingsSectionProps = {
  storageStatus: StorageStatus
  onResetData: () => void
}

export default function SettingsSection({
  storageStatus,
  onResetData
}: SettingsSectionProps) {
  const { t } = useTranslation()

  const hasStorageError =
    storageStatus === 'invalid' ||
    storageStatus === 'unsupported' ||
    storageStatus === 'unavailable'

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

        <section className="card">
          <h3>
            <TrashIcon />
            <span>{t('settings.storage.title')}</span>
          </h3>

          <p>{t('settings.storage.description')}</p>

          {hasStorageError && (
            <p role="alert">
              {t(`settings.storage.${storageStatus}`)}
            </p>
          )}

          <div>
            <button
              type="button"
              onClick={onResetData}
              disabled={
                storageStatus === 'empty' ||
                storageStatus === 'unavailable'
              }
            >
              {t('settings.storage.reset')}
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}
