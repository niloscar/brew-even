import * as currencyUtils from '../../utils/currency'
import * as format from '../../utils/format'
import { MOCK_RATES } from '../../data/mockData'

import type { Currency } from 'shared'

export default function OverviewSection({ locale, currency }: { locale: string; currency: Currency }) {
  return (
    <section className="view" id="overview">
      <h2>Overview</h2>

      <div className="cardGrid col3">
        <section className="card">
          <h3>Cups brewed</h3>
          <p>{format.number(1274, locale)}</p>
        </section>

        <section className="card">
          <h3>Last cup cost</h3>
          <p>
            {format.price(
              currencyUtils.convert(51.31, MOCK_RATES[currency]),
              locale,
              currency
            )}
          </p>
        </section>

        <section className="card">
          <h3>Next cup cost</h3>
          <p>
            {format.price(
              currencyUtils.convert(51.21, MOCK_RATES[currency]),
              locale,
              currency
            )}
          </p>
        </section>
      </div>
    </section>
  )
}
