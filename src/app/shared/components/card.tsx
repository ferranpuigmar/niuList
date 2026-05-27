import type { HTMLAttributes } from 'react'

import { cn } from '../utils/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
