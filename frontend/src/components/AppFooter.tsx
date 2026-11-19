import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SupportCheckout from './support/SupportCheckout'
import { ArrowUpRightIcon, CoffeeIcon, GithubLogoIcon } from '@phosphor-icons/react'

import type { Currency } from 'shared'

import styles from './AppFooter.module.css'

interface AppFooterProps {
  currency: Currency
  rates: Record<Currency, number>
  locale: string
  nextCupCost: number
}

const CURRENT_YEAR = new Date().getFullYear()

export default function AppFooter({ currency, rates, locale, nextCupCost}: AppFooterProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (window.location.hash !== '#about') return

    const frame = requestAnimationFrame(() => {
      document.getElementById('about')?.scrollIntoView({
        behavior: 'auto',
        block: 'start'
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [])

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

          <SupportCheckout 
            currency={currency} 
            rates={rates} 
            locale={locale} 
            nextCupCost={nextCupCost}
          />
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
