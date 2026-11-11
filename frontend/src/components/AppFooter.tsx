import { useTranslation } from 'react-i18next'
import * as format from '../utils/format'
import * as currencyUtils from '../utils/currency'
import { MOCK_RATES } from '../data/mockData'
import {
  ArrowUpRightIcon,
  CoffeeIcon,
  GithubLogoIcon
} from '@phosphor-icons/react'

import type { Currency } from 'shared'

import styles from './AppFooter.module.css'

interface AppFooterProps {
  currency: Currency
  locale: string
  nextCupCost: number
}

const CURRENT_YEAR = new Date().getFullYear()

export default function AppFooter({ currency, locale, nextCupCost}: AppFooterProps) {
  const { t } = useTranslation()

  const nextCupPrice =
    nextCupCost === null
      ? null
      : format.price(
          currencyUtils.convert(nextCupCost, MOCK_RATES[currency]),
          locale,
          currency
        )

  return (
    <footer className={`view ${styles.footer}`} id="about">
      <div className={`cardGrid ${styles.footerGrid}`}>
        <section>
          <h2>{t('footer.title')}</h2>

          <p>{t('footer.description')}</p>

          <p>
            {t('footer.createdBy')}{' '}
            <a
              href="https://oscarnilsson.dev?ref=brew-even"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Oscar Nilsson</span>
              <ArrowUpRightIcon />
            </a>
            {t('footer.creatorDescription')}
          </p>

          <a
            href="https://github.com/niloscar/brew-even"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubLogoIcon />
            <span>{t('footer.viewOnGitHub')}</span>
            <ArrowUpRightIcon />
          </a>
        </section>

        <section className={`card ${styles.supportCard}`}>
          <h2 className={styles.supportHeader}>
            <CoffeeIcon />
            <span>{t('footer.buyMeACoffee')}</span>
          </h2>

          <p>{t('footer.supportDescription')}</p>

          <button className="buttonAccent">
            <span>{t('footer.supportProject')}</span>
            <ArrowUpRightIcon />
          </button>

          {nextCupPrice !== null && (
            <i>{t('footer.nextCupCost', { price: nextCupPrice })}</i>
          )}
        </section>

        <section className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; {CURRENT_YEAR} Brew-even
          </p>
          <p>{t('footer.tagline')}</p>
        </section>
      </div>
    </footer>
  )
}
