
import { CaretDownIcon } from '@phosphor-icons/react'

import type { SelectHTMLAttributes } from 'react'

import styles from './SelectWithCaret.module.css'

type SelectWithCaretProps = SelectHTMLAttributes<HTMLSelectElement> & {
  wrapperClassName?: string
}

export default function SelectWithCaret({ wrapperClassName, className, children, ...props }: SelectWithCaretProps) {
  return (
    <div className={`${styles.wrapper} ${wrapperClassName ?? ''}`}>
      <select
        {...props}
        className={`${styles.select} ${className ?? ''}`}
      >
        {children}
      </select>

      <CaretDownIcon
        size={12}
        className={styles.caret}
        aria-hidden="true"
      />
    </div>
  )
}
