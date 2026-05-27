import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '../../routes'
import { cn } from '../utils/cn'

type SiteHeaderProps = {
  rightSlot?: ReactNode
  className?: string
}

export function SiteHeader({ rightSlot, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        'border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/80',
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link className="font-serif text-2xl text-[var(--color-text-primary)]" to={ROUTES.landing}>
          regalitos
        </Link>
        <div>{rightSlot}</div>
      </div>
    </header>
  )
}
