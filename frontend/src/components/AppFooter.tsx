import * as format from '../utils/format'
import * as currencyUtils from '../utils/currency'
import { MOCK_RATES } from '../data/mockData'
import { ArrowUpRightIcon, CoffeeIcon, GithubLogoIcon } from '@phosphor-icons/react'

import type { Currency } from 'shared'

import styles from './AppFooter.module.css'

export default function AppFooter({ currency, locale, nextCupCost }: { currency: Currency, locale: string, nextCupCost: number }) {
  return (
      <footer className={`view ${styles.footer}`} id="about">
        <div className={`cardGrid ${styles.footerGrid}`}>
          <section>
            <h2>Built for the love of coffee</h2>
            <p>Brew-even is an independent project helping home baristas understand the true cost of their espresso setup.</p>
            <p>Created by <a href="https://oscarnilsson.dev?ref=brew-even" target="_blank" rel="noopener noreferrer"><span>Oscar Nilsson</span><ArrowUpRightIcon /></a>, coffee enthusiast and software developer.</p>
            <a href="https://github.com/niloscar/brew-even" target="_blank" rel="noopener noreferrer">
              <GithubLogoIcon />
              <span>View on GitHub</span>
              <ArrowUpRightIcon />
            </a>
          </section>

          <section className={`card ${styles.supportCard}`}>
            <h2 className={styles.supportHeader}>
              <CoffeeIcon />
              <span>Buy me a coffee</span>
            </h2>
            <p>Enjoying Brew-even? Buy me a coffee and help support its development.</p>
            <button className={styles.supportButton}>
              <span>Support the project</span>
              <ArrowUpRightIcon />
            </button>
            <i>My next cup of coffee will cost me{' '}{format.price(currencyUtils.convert(nextCupCost, MOCK_RATES[currency]), locale, currency)}.</i>
          </section>

          <section className={styles.bottomRow}>
            <p className={styles.copyright}>&copy; {new Date().getFullYear()} Brew-even</p>
            <p>Caffeine made me do it.</p>
          </section>
        </div>
      </footer>
  )
}