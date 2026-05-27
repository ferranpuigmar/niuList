import { useEffect } from 'react'

export function useAutofillFix(
  fieldNames: string[],
  trigger: (name: string) => void,
) {
  useEffect(() => {
    const handleAnimationStart = (e: AnimationEvent) => {
      if (
        e.animationName === 'mui-auto-fill' &&
        e.target instanceof HTMLInputElement &&
        fieldNames.includes(e.target.name)
      ) {
        setTimeout(() => trigger(e.target.name), 0)
      }
    }

    document.addEventListener(
      'animationstart',
      handleAnimationStart as EventListener,
    )

    return () => {
      document.removeEventListener(
        'animationstart',
        handleAnimationStart as EventListener,
      )
    }
  }, [fieldNames, trigger])
}
