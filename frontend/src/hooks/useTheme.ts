import { useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

const ANIMATION_DURATION = 1000

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  )

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    const root = document.documentElement

    const updateTheme = () => {
      root.dataset.theme = nextTheme

      flushSync(() => setTheme(nextTheme))

      localStorage.setItem('theme', nextTheme)
    }

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      updateTheme()
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()

    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const duration = Math.max(
      900,
      Math.min(
        1800,
        ANIMATION_DURATION * Math.sqrt(radius / 1000)
      )
    )

    const blobPath = (scale: number) => {
      const r = radius * scale

      const point = (dx: number, dy: number) =>
        `${x + dx * r} ${y + dy * r}`

      const path = [
        `M ${point(1, 0)}`,
        `C ${point(0.55, 0.58)} ${point(0.92, 0.85)} ${point(0, 1)}`,
        `C ${point(-0.92, 1.15)} ${point(-0.38, 0.47)} ${point(-1, 0)}`,
        `C ${point(-1.62, -0.47)} ${point(-0.24, -1.95)} ${point(0.24, -1)}`,
        `C ${point(0.50, -0.50)} ${point(1.45, -0.58)} ${point(1, 0)}`,
        'Z'
      ].join(' ')

      return `path("${path}")`
    }

    const transition = document.startViewTransition(updateTheme)

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [blobPath(0.001), blobPath(1.25)]
          },
          {
            duration,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)'
          }
        )
      })
      .catch(console.error)
  }

  return { theme, toggleTheme }
}