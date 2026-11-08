import { MOCK_SETUP_PARTS } from '../../data/mockData'
import { SETUP_PART_OPTIONS } from '../../settings/constants'
import * as format from '../../utils/format'

import type { Currency } from 'shared'

import styles from './EquipmentList.module.css'

export default function EquipmentList({ locale, currency }: { locale: string, currency: Currency }) {
  const sortedEquipment = [...MOCK_SETUP_PARTS].sort((a, b) => b.price - a.price)

  return (
    <ul className={styles.equipmentList}>
      {sortedEquipment.map((part) => (
        <li key={part.id} title={`Acquired on ${part.acquisitionDate}`}>
          <span className={styles.equipmentType}>
            {SETUP_PART_OPTIONS.find((option) => option.value === part.type)?.label}
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
