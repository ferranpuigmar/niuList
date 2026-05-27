import {
  Children,
  cloneElement,
  isValidElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'

import { cn } from '../../utils/cn'
import { textVariants, type TextVariant } from './text.config'

export type TextProps = TextVariant & {
  as?: ElementType
  asChild?: boolean
  children?: ReactNode
  className?: string
  ref?: Ref<HTMLElement>
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'ref'>

export function Text({
  as,
  asChild,
  className,
  variant,
  color,
  children,
  ref,
  ...props
}: TextProps) {
  const classes = cn(textVariants({ variant, color }), className)

  if (asChild) {
    const child = Children.only(children)
    if (isValidElement(child)) {
      return cloneElement(child, {
        className: cn(child.props.className, classes),
        ref,
        ...props,
      } as Record<string, unknown>)
    }
    return <>{children}</>
  }

  const Component = as ?? 'span'

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  )
}
