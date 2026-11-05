import { useEffect, useState } from 'react'
import { getHealth } from './api/healthApi'

import styles from './App.module.css'

export default function App() {
  const [health, setHealth] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getHealth()
        setHealth(data.status)
      } catch (error) {
        console.error('Error fetching health:', error)
        setHealth('Error')
      }
    }

    fetchHealth()
  }, [])

  return (
    <>
      <h1>Hello World</h1>
      <p>API Health: <span className={health === 'ok' ? styles.apiHealthy : styles.apiUnhealthy}>{health?.toUpperCase()}</span></p>
    </>
  )
}
