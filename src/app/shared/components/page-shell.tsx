import type { PropsWithChildren } from 'react'

import { cn } from '../utils/cn'

type PageShellProps = PropsWithChildren<{
  className?: string
}>

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn('mx-auto w-full max-w-6xl px-4 py-6 md:px-16 md:py-10', className)}>
      {children}
    </main>
  )
}
