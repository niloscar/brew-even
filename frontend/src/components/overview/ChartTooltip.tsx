import { useTranslation } from 'react-i18next'
import type { TooltipContentProps } from 'recharts'
import type { Currency } from 'shared'
import { CoffeeIcon, CoinsIcon } from '@phosphor-icons/react'

import * as format from '../../utils/format'
import styles from './Chart.module.css'

type ChartTooltipProps = TooltipContentProps & {
  locale: string
  currency: Currency
  currentCups: number
}

export default function ChartTooltip({
  active,
  payload,
  label,
  locale,
  currency,
  currentCups
}: ChartTooltipProps) {
  const { t } = useTranslation()

  if (!active || !payload?.length) return null

  const averagePrice = payload.find(
    (item) =>
      item.dataKey === 'historicalPrice' ||
      item.dataKey === 'forecastPrice'
  )?.value

  const cupsBrewed = Number(label)

  if (typeof averagePrice !== 'number' || !Number.isFinite(cupsBrewed)) {
    return null
  }

  const isForecast = cupsBrewed > currentCups

  const formattedPrice = format
    .priceParts(averagePrice, locale, currency)
    .map((part) => part.value)
    .join('')

  return (
    <div className={styles.tooltip}>
      <ul>
        <li>
          <CoffeeIcon
            className={styles.tooltipIcon}
            aria-hidden="true"
          />

          <span className={styles.tooltipText}>
            <span className={styles.tooltipLabel}>
              {t('overview.chartCupsTotal')}
            </span>

            <strong>
              {format.number(cupsBrewed, locale, 0)}{' '}
              {t('overview.cup', { count: cupsBrewed })}
            </strong>
          </span>
        </li>

        <li>
          <CoinsIcon
            className={styles.tooltipIcon}
            aria-hidden="true"
          />

          <span className={styles.tooltipText}>
            <span className={styles.tooltipLabel}>
              {!isForecast ? t('overview.chartAverageCost') : t('overview.chartForecast')}
            </span>

            <strong>{formattedPrice}</strong>
          </span>
        </li>
      </ul>
    </div>
  )
}