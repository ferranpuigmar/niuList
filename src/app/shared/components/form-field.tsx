import type { Ref, TextareaHTMLAttributes } from 'react'

import { cn } from '../utils/cn'
import { Text } from './text/text'

type FormFieldProps = {
  label: string
  error?: string | { message?: string }
  multiline?: boolean
  className?: string
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>
} & (
  | (Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'ref'> & { multiline?: false })
  | (Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'ref'> & { multiline: true })
)

export function FormField({
  label,
  error,
  multiline,
  className,
  ref,
  ...props
}: FormFieldProps) {
  const id = (props as Record<string, unknown>).id as string | undefined
    ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <Text asChild variant="body-2">
        <label htmlFor={id}>{label}</label>
      </Text>
      <div
        className={cn(
          'flex w-full rounded-xl border border-stroke-default bg-canvas-surface-hover px-3.5 py-3 focus-within:ring-2 focus-within:ring-accent-primary/25 focus-within:border-accent-primary',
          multiline ? 'items-start' : 'items-center',
        )}
      >
        {multiline ? (
          <textarea
            className="min-h-[120px] w-full bg-transparent font-body text-[15px] text-fg-primary outline-none placeholder:text-fg-secondary"
            id={id}
            ref={ref as Ref<HTMLTextAreaElement>}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className="w-full bg-transparent font-body text-[15px] text-fg-primary outline-none placeholder:text-fg-secondary"
            id={id}
            ref={ref as Ref<HTMLInputElement>}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error ? (
        <Text as="p" variant="caption" color="error">
          {typeof error === 'string' ? error : error.message}
        </Text>
      ) : null}
    </div>
  )
}
