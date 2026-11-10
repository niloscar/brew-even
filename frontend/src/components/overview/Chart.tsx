
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendDownIcon } from '@phosphor-icons/react'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  ReferenceLine
} from 'recharts'

import ChartTooltip from './ChartTooltip'
import { calculateCostCurve } from '../../lib/costCurve'
import { calculateDailyBrewRate } from '../../lib/brewRate'
import * as currencyUtils from '../../utils/currency'
import { MOCK_RATES } from '../../data/mockData'

import type { Currency } from 'shared'
import type { EquipmentPurchase } from '../../lib/cost'

import styles from './Chart.module.css'

type ChartProps = {
  equipment: EquipmentPurchase[]
  cupsBrewed: number
  consumablesPerCup: number
  locale: string
  currency: Currency
}

type Period = '90' | '365' | 'all'

const PERIODS: Period[] = ['all', '365', '90']
const FORECAST_SHARE = 0.3

const now = new Date()

const TODAY = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0')
].join('-')

export default function Chart({
  equipment,
  cupsBrewed,
  consumablesPerCup,
  locale,
  currency
}: ChartProps) {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<Period>('90')

  const brewRate = useMemo(
    () => calculateDailyBrewRate(equipment, cupsBrewed, TODAY),
    [equipment, cupsBrewed]
  )

  const data = useMemo(() => {
    if (cupsBrewed === 0) return []

    const historyDays = period === 'all' ? null : Number(period)

    const startCups = historyDays === null || brewRate === null
      ? 1
      : Math.max(
          1,
          Math.round(cupsBrewed - brewRate * historyDays)
        )

    const historicalCupSpan = cupsBrewed - startCups

    const forecastCupSpan = Math.round(
      historicalCupSpan * FORECAST_SHARE / (1 - FORECAST_SHARE)
    )

    const futureCups = brewRate === null || historicalCupSpan === 0
      ? cupsBrewed
      : cupsBrewed + Math.max(1, forecastCupSpan)

    const convertPrice = (price: number) =>
      currencyUtils.convert(price, MOCK_RATES[currency])

    const historical = calculateCostCurve({
      equipment,
      cupsBrewed,
      consumablesPerCup,
      startCups,
      endCups: cupsBrewed
    })

    const hasForecast = futureCups > cupsBrewed

    const forecast = hasForecast
      ? calculateCostCurve({
          equipment,
          cupsBrewed,
          consumablesPerCup,
          startCups: cupsBrewed,
          endCups: futureCups
        })
      : []

    const historyPoints = historical.map((point) => ({
      cupsBrewed: point.cupsBrewed,
      historicalPrice: convertPrice(point.averagePrice),
      forecastPrice: point.cupsBrewed === cupsBrewed && hasForecast
        ? convertPrice(point.averagePrice)
        : null
    }))

    const forecastPoints = forecast.slice(1).map((point) => ({
      cupsBrewed: point.cupsBrewed,
      historicalPrice: null,
      forecastPrice: convertPrice(point.averagePrice)
    }))

    return [...historyPoints, ...forecastPoints]
  }, [
    equipment,
    cupsBrewed,
    consumablesPerCup,
    currency,
    period,
    brewRate
  ])

  const hasForecast = data.some(
    (point) => point.forecastPrice !== null
  )

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartContainer}>
        <div className={styles.chartToolbar}>
          <h3>
            <TrendDownIcon aria-hidden="true" />
            <span>{t('overview.chartTitle')}</span>
          </h3>

          <div
            className={styles.periodSelector}
            role="group"
            aria-label={t('overview.chartPeriod')}
          >
            {PERIODS.map((value) => (
              <button
                key={value}
                type="button"
                className={styles.periodButton}
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
              >
                {t(`overview.chartPeriod${value}`)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chartCanvas}>
          {data.length === 0 ? (
            <p className={styles.chartEmpty}>
              {t('overview.chartEmpty')}
            </p>
          ) : (
            <LineChart
              responsive
              className={styles.chart}
              data={data}
              margin={{ top: 8, right: 0, bottom: 8, left: 0 }}
            >
              <XAxis
                dataKey="cupsBrewed"
                type="number"
                domain={['dataMin', 'dataMax']}
                hide
              />

              <YAxis
                type="number"
                domain={([dataMin, dataMax]) => {
                  const range = Math.max(
                    dataMax - dataMin,
                    dataMax * 0.1,
                    1
                  )

                  return [
                    Math.max(0, dataMin - range * 0.5),
                    dataMax + range * 0.25
                  ]
                }}
                allowDataOverflow
                hide
                width={0}
              />

              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    {...props}
                    locale={locale}
                    currency={currency}
                    currentCups={cupsBrewed}
                  />
                )}
              />

              {hasForecast && (
                <ReferenceLine
                  x={cupsBrewed}
                  stroke="var(--border-dark)"
                  strokeDasharray="3 4"
                />
              )}

              <Line
                type="monotone"
                dataKey="historicalPrice"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={data.length === 1}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="forecastPrice"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </div>
      </div>

      <div className={styles.chartLegend}>
        <span className={styles.legendHistorical}>
          {t('overview.chartHistory')}
        </span>

        {hasForecast && (
          <span className={styles.legendForecast}>
            {t('overview.chartForecast')}
          </span>
        )}
      </div>

      <p className={styles.chartNote}>
        {t('overview.chartModelNote')}
      </p>
    </div>
  )
}
