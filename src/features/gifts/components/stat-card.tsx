import type { ElementType } from 'react'

import { cn } from '../../../app/shared/utils/cn'

type StatCardProps = {
  icon: ElementType<{ className?: string }>
  value: number
  label: string
  className?: string
  active?: boolean
  onClick?: () => void
}

export function StatCard({ icon: Icon, value, label, className, active, onClick }: StatCardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className={cn(
        'flex items-center gap-3 rounded-2xl border px-4 py-3.5',
        onClick
          ? 'cursor-pointer transition-colors hover:bg-canvas-surface-hover'
          : '',
        active
          ? 'border-accent-primary bg-accent-light'
          : 'border-stroke-default bg-canvas-surface',
        className,
      )}
      onClick={onClick}
      type={Component === 'button' ? 'button' : undefined}
    >
      <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-accent-primary' : 'text-fg-secondary')} />
      <div>
        <p className="font-body text-xl font-bold text-fg-primary">{value}</p>
        <p className="font-body text-sm font-medium text-fg-secondary">{label}</p>
      </div>
    </Component>
  )
}
