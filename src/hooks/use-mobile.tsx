
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Also detect touch devices
  React.useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice && window.innerWidth <= 1024) {
      setIsMobile(true)
    }
  }, [])

  return !!isMobile
}

// Hook to detect if app is running in fullscreen mode
export function useIsFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  React.useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', checkFullscreen)
    return () => document.removeEventListener('fullscreenchange', checkFullscreen)
  }, [])

  return isFullscreen
}
