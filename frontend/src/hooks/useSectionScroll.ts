import { useEffect } from 'react'

export function useSectionScroll() {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const touch = window.matchMedia('(any-pointer: coarse)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let lastSmoothEvent = -Infinity
    let lastWheelEvent = -Infinity
    let lockUntil = 0
    let wheelLocked = false

    function isLikelyMouseWheel(event: WheelEvent) {
      if (event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL) return true

      return Math.abs(event.deltaY) >= 11 && event.deltaX === 0
    }

    function handleWheel(event: WheelEvent) {
      if (
        !desktop.matches ||
        touch.matches ||
        event.ctrlKey ||
        event.deltaY === 0 ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      ) {
        return
      }

      const now = performance.now()

      if (!isLikelyMouseWheel(event)) {
        lastSmoothEvent = now
        return
      }

      if (now - lastSmoothEvent < 300) return

      const gap = now - lastWheelEvent
      lastWheelEvent = now

      if (wheelLocked) {
        if (now < lockUntil || gap < 180) {
          if (event.cancelable) event.preventDefault()
          return
        }

        wheelLocked = false
      }

      if (!event.cancelable) return

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('.view')
      )
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0

      let currentIndex = 0

      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= headerHeight + 12) {
          currentIndex = index
        }
      })

      const rect = sections[currentIndex]?.getBoundingClientRect()
      if (!rect) return

      const direction = Math.sign(event.deltaY)

      if (rect.height > window.innerHeight + 2) {
        if (direction > 0 && rect.bottom > window.innerHeight + 12) return
        if (direction < 0 && rect.top < headerHeight - 12) return
      }

      const nextSection = sections[currentIndex + direction]
      if (!nextSection) return

      event.preventDefault()

      wheelLocked = true
      lockUntil = now + 600

      nextSection.scrollIntoView({
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
        block: 'start'
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])
}
