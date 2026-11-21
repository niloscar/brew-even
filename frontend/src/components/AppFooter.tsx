
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SupportSection from './support/SupportSection'
import ExternalLink from './ui/ExternalLink'
import { PaperPlaneTiltIcon, GithubLogoIcon } from '@phosphor-icons/react'

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
            <ExternalLink href="https://oscarnilsson.dev?ref=brew-even">
              <span>Oscar Nilsson</span>
            </ExternalLink>
            {t('footer.creatorDescription')}
          </p>

          <ul className={styles.socialLinks}>
            <li>
              <ExternalLink href="https://github.com/niloscar/brew-even">
                <GithubLogoIcon />
                <span>{t('footer.viewOnGitHub')}</span>
              </ExternalLink>
            </li>
            <li>
              <a
                href="mailto:hello@breweven.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PaperPlaneTiltIcon />
                <span>hello@breweven.app</span>
              </a>
            </li>
          </ul>
        </section>

        <SupportSection
          currency={currency}
          rates={rates}
          locale={locale}
          nextCupCost={nextCupCost}
        />

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
