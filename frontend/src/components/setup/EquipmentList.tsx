import { useTranslation } from 'react-i18next'
import { MOCK_SETUP_PARTS } from '../../data/mockData'
import * as format from '../../utils/format'

import type { Currency } from 'shared'

import styles from './EquipmentList.module.css'

export default function EquipmentList({
  locale,
  currency
}: {
  locale: string
  currency: Currency
}) {
  const { t } = useTranslation()
  const sortedEquipment = [...MOCK_SETUP_PARTS].sort(
    (a, b) => b.price - a.price
  )

  return (
    <ul className={styles.equipmentList}>
      {sortedEquipment.map((part) => (
        <li
          key={part.id}
          title={t('setup.acquiredOn', {
            date: new Intl.DateTimeFormat(locale).format(
              new Date(`${part.acquisitionDate}T00:00:00`)
            )
          })}
        >
          <span className={styles.equipmentType}>
            {t(`setup.equipmentTypes.${part.type}`)}
          </span>
          <span className={styles.equipmentName}>{part.name}</span>
          <span className={styles.equipmentPrice}>
            {format.price(part.price, locale, currency)}
          </span>
        </li>
      ))}
      <li className={styles.equipmentTotal}>
        <span className={styles.equipmentTotalPrice}>
          {format.price(
            sortedEquipment.reduce((sum, part) => sum + part.price, 0),
            locale,
            currency
          )}
        </span>
      </li>
    </ul>
  )
}
