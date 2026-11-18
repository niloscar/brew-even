import styles from './StatusMessage.module.css'

export default function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className={styles.statusMessage}>
      {children}
    </div>
  )
}
