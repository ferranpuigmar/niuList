import { useEffect, useRef } from 'react'
import type { UseFormSetValue, FieldValues, Path } from 'react-hook-form'

export function useAutofillSync<T extends FieldValues>(
  setValue: UseFormSetValue<T>,
  fieldNames: Path<T>[],
) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const formEl = formRef.current
    if (!formEl) return

    const sync = () => {
      for (const name of fieldNames) {
        const el = formEl.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${name}"]`,
        )
        if (el?.value) {
          setValue(name, el.value as never, { shouldValidate: false, shouldDirty: true })
        }
      }
    }

    formEl.addEventListener('input', sync)
    const timer = setTimeout(sync, 500)

    return () => {
      formEl.removeEventListener('input', sync)
      clearTimeout(timer)
    }
  }, [])

  return formRef
}
