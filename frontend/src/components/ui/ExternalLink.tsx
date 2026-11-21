import { ArrowUpRightIcon } from '@phosphor-icons/react'

import type { ComponentProps } from 'react'

import styles from './ExternalLink.module.css'

type ExternalLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'>

export default function ExternalLink({ children, className, ...props }: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={className ? `${styles.externalLink} ${className}` : styles.externalLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRightIcon 
        className={styles.externalArrow} 
        aria-hidden="true" 
        weight="bold"
      />
    </a>
  )
}
