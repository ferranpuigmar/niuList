import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Bookmark, Check } from 'lucide-react'

import { cn } from '../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body',
  {
    variants: {
      variant: {
        pending: 'bg-status-pending-light text-status-pending',
        reserved: 'bg-status-reserved-light text-status-reserved',
        bought: 'bg-status-bought-light text-status-bought',
        admin: 'bg-accent-light text-accent-primary',
      },
    },
    defaultVariants: {
      variant: 'pending',
    },
  },
)

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    name?: string
  }

const icons = {
  pending: null,
  reserved: Bookmark,
  bought: Check,
  admin: null,
} as const

const labels = {
  pending: 'Pendiente',
  reserved: 'Reservado',
  bought: 'Comprado',
  admin: 'Admin',
} as const

export function StatusBadge({ className, variant = 'pending', name, ...props }: StatusBadgeProps) {
  const Icon = icons[variant]
  const label = variant === 'admin' ? props.children ?? 'Admin' : labels[variant]
  const displayName = variant === 'admin' ? null : name ? ` · ${name}` : ''

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {label}
      {displayName}
    </span>
  )
}
