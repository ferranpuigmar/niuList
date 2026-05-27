import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-body font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-accent-primary text-fg-on-accent hover:bg-accent-primary-hover',
        dark: 'bg-canvas-inverse text-fg-inverse hover:opacity-90',
        outline:
          'bg-transparent border border-stroke-default text-fg-primary hover:bg-canvas-surface-hover',
        ghost: 'bg-transparent text-accent-primary hover:underline',
      },
      size: {
        sm: 'px-4 py-2 text-xs rounded-lg gap-1.5',
        md: 'px-5 py-3 text-sm rounded-lg gap-2',
        lg: 'px-7 py-3.5 text-base rounded-xl gap-2',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonBase = VariantProps<typeof buttonVariants> & {
  as?: ElementType
  icon?: ElementType<{ className?: string }>
  children?: ReactNode
  className?: string
}

type ButtonAsButton = ButtonBase & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonAsAnchor = ButtonBase & AnchorHTMLAttributes<HTMLAnchorElement>

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

export function Button({
  as,
  className,
  variant,
  size,
  fullWidth,
  icon: Icon,
  children,
  ...props
}: ButtonProps) {
  const Component = as ?? 'button'

  return (
    <Component
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      type={Component === 'button' ? 'button' : undefined}
      {...(props as Record<string, unknown>)}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {children}
    </Component>
  )
}
