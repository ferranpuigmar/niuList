import { useEffect } from 'react'

export function useAutofillFix(
  fieldNames: string[],
  trigger: (name: string) => void,
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      for (const name of fieldNames) {
        trigger(name)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])
}
