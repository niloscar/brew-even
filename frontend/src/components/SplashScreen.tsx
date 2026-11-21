import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Logo from './Logo'

import styles from './SplashScreen.module.css'

import type { AnimationEvent, CSSProperties } from 'react'

type SplashScreenProps = {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const root = document.getElementById('root')
    const previousInert = root?.inert
    const previousOverflow = document.documentElement.style.overflow

    if (root) root.inert = true
    document.documentElement.style.overflow = 'hidden'

    return () => {
      if (root) root.inert = previousInert ?? false
      document.documentElement.style.overflow = previousOverflow
    }
  }, [])

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return

    const exitAnimation = getComputedStyle(event.currentTarget).animationName.split(',')[0].trim()

    if (event.animationName === exitAnimation) onFinish()
  }

  const splashDuration = `${window.innerWidth < 1024 ? 1800 : 1400}ms`

  return createPortal(
    <div
      className={styles.splash}
      style={{ '--splash-duration': splashDuration } as CSSProperties}
      aria-hidden="true"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.logo}>
        <Logo ariaHidden />
      </div>
    </div>,
    document.body
  )
}
