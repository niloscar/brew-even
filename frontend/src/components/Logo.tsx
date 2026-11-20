import styles from './Logo.module.css'

export default function Logo({ ariaHidden = false, animated = false }: { ariaHidden?: boolean, animated?: boolean }) {
  return (
    <h1 className={styles.logoContainer} aria-hidden={ariaHidden}>
      <span className={`${styles.logo} ${animated ? styles.animated : ''}`} aria-hidden={true} />
      <span className={styles.logoText}>Brew-even</span>
    </h1>
  )
}