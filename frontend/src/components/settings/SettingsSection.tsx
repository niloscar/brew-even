import { useTranslation } from 'react-i18next'
import { DatabaseIcon, PlugsIcon } from '@phosphor-icons/react'
import PreferencesForm from './PreferencesForm'
import CoffeeIntegrationForm from './CoffeeIntegrationForm'
import {
  ArrowCounterClockwiseIcon,
  SlidersHorizontalIcon
} from '@phosphor-icons/react'

import type { Currency } from 'shared'
import type { StorageStatus } from '../../lib/storage'

type SettingsSectionProps = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  storageStatus: StorageStatus
  onResetData: () => void
}

export default function SettingsSection({ currency, setCurrency, storageStatus, onResetData }: SettingsSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="view" id="settings">
      <h2>{t('settings.title')}</h2>

      <div className="cardGrid contained col2">
        <section className="card">
          <h3>
            <SlidersHorizontalIcon />
            <span>{t('settings.preferences')}</span>
          </h3>

          <PreferencesForm currency={currency} setCurrency={setCurrency} />
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
                storageStatus === 'empty' || storageStatus === 'unavailable'
              }
            >
              <ArrowCounterClockwiseIcon aria-hidden="true" />
              {t('settings.storage.reset')}
            </button>
          </div>
        </section>

        <section className="card span2">
          <h3>
            <PlugsIcon />
            <span>{t('settings.connectSetup')}</span>
          </h3>

          <p>{t('settings.connectDescription')}</p>

          <CoffeeIntegrationForm />
        </section>
      </div>
    </section>
  )
}
