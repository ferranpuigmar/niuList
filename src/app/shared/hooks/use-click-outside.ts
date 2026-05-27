import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  onOutsideClick: () => void,
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!ref.current) {
        return
      }

      if (!ref.current.contains(event.target as Node)) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onOutsideClick, ref])
}
