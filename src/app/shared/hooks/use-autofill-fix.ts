import { useEffect } from 'react'

export function useAutofillFix(
  fieldNames: string[],
  trigger: (name: string) => void,
) {
  useEffect(() => {
    const timers = [100, 400, 800].map(delay =>
      setTimeout(() => {
        for (const name of fieldNames) {
          trigger(name)
        }
      }, delay),
    )

    const handleAnimationStart = (e: AnimationEvent) => {
      if (
        e.animationName === 'mui-auto-fill' &&
        e.target instanceof HTMLInputElement &&
        e.target.name
      ) {
        trigger(e.target.name)
      }
    }

    document.addEventListener(
      'animationstart',
      handleAnimationStart as EventListener,
    )

    return () => {
      timers.forEach(clearTimeout)
      document.removeEventListener(
        'animationstart',
        handleAnimationStart as EventListener,
      )
    }
  }, [fieldNames, trigger])
}
