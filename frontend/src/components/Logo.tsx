import styles from './Logo.module.css'

export default function Logo({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <h1 className={styles.logoContainer} aria-hidden={ariaHidden}>
      <span className={styles.logo} aria-hidden={true} />
      <span className={styles.logoText}>Brew-even</span>
    </h1>
  )
}