import { useTranslation } from 'react-i18next'
import { DatabaseIcon, PlugsIcon } from '@phosphor-icons/react'
import CoffeeIntegrationForm from './CoffeeIntegrationForm'
import SelectWithCaret from '../ui/SelectWithCaret'
import { LANGUAGES } from '../../i18n/languages'
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

          <div className="formGrid">
            <label htmlFor="locale">{t('settings.language')}</label>
            <SelectWithCaret
              className="buttonLike"
              id="locale"
              value={window.location.pathname.replace(/\/$/, '') || '/'}
              onChange={(e) => window.location.assign(e.target.value)}
            >
              {Object.entries(LANGUAGES).map(([path, { label }]) => (
                <option key={path} value={path}>
                  {label}
                </option>
              ))}
            </SelectWithCaret>

            <label htmlFor="currency">{t('settings.currency')}</label>
            <SelectWithCaret
              className="buttonLike"
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            >
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="SEK">SEK</option>
              <option value="USD">USD</option>
            </SelectWithCaret>
          </div>
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
