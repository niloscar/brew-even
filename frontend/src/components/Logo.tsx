import styles from './Logo.module.css'

export default function Logo({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <span 
      className={styles.logo} 
      aria-label={ariaHidden ? undefined : 'Brew-even'}  
      aria-hidden={ariaHidden}
      role={ariaHidden ? undefined : 'img'}
    />
  )
}