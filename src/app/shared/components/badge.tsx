import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../utils/cn'

const badgeVariants = cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      pending: 'bg-[var(--color-accent-bg)] text-[var(--color-accent)]',
      reserved: 'bg-[var(--color-reserved-bg)] text-[var(--color-reserved)]',
      bought: 'bg-[var(--color-bought-bg)] text-[var(--color-bought)]',
      admin: 'bg-[var(--color-accent-bg)] text-[var(--color-accent)]',
    },
  },
  defaultVariants: {
    variant: 'pending',
  },
})

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
