import * as currencyUtils from '../../utils/currency'
import * as format from '../../utils/format'
import { MOCK_RATES } from '../../data/mockData'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CoffeeIcon
} from '@phosphor-icons/react'

import type { Currency } from 'shared'

import styles from './OverviewSection.module.css'

export default function OverviewSection({ locale, currency }: { locale: string, currency: Currency }) {
  const cupsBrewed = format.number(1274, locale)
  const lastCupCost = currencyUtils.convert(51.31, MOCK_RATES[currency])
  const nextCupCost = currencyUtils.convert(51.21, MOCK_RATES[currency])

  const renderPrice = (amount: number) =>
    format.priceParts(amount, locale, currency).map((part, index) => (
      <span key={index} className={styles[part.type]}>
        {part.value}
      </span>
    ))

  return (
    <section className="view" id="overview">
      <h2>Overview</h2>

      <div className={styles.graphContainer}>
        <div className={styles.graph}>
          <div className={styles.graphBar} style={{ height: '80%' }}></div>
          <div className={styles.graphBar} style={{ height: '60%' }}></div>
          <div className={styles.graphBar} style={{ height: '90%' }}></div>
          <div className={styles.graphBar} style={{ height: '70%' }}></div>
          <div className={styles.graphBar} style={{ height: '50%' }}></div>
          <div className={styles.graphBar} style={{ height: '85%' }}></div>
          <div className={styles.graphBar} style={{ height: '75%' }}></div>
        </div>

        <i className={styles.graphLabel}>Coming soon: Cost per cup over time</i>
      </div>

      <div className="cardGrid contained col3 col2-sm">
        <div className={`card ${styles.metricsCard}`}>
          <h3>
            <ArrowLeftIcon />
            <span>Last cup</span>
          </h3>
          <p className={styles.metricValue}>
            {renderPrice(lastCupCost)}
          </p>
        </div>

        <div className={`card ${styles.metricsCard}`}>
          <h3>
            <ArrowRightIcon />
            <span>Next cup</span>
          </h3>
          <p className={styles.metricValue}>
            {renderPrice(nextCupCost)}
          </p>
        </div>

        <div className={`card ${styles.metricsCard}`}>
          <h3>
            <CoffeeIcon />
            <span>Brewed</span>
          </h3>
          <p className={styles.metricValue}>{cupsBrewed}</p>
        </div>
      </div>
    </section>
  )
}
