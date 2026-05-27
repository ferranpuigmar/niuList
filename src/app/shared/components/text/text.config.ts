import { cva, type VariantProps } from 'class-variance-authority'

const textVariants = cva('', {
  variants: {
    variant: {
      'display-xl': 'font-serif text-[52px] font-normal leading-tight',
      display: 'font-serif text-[36px] font-normal leading-tight',
      h1: 'font-serif text-[28px] font-bold leading-tight',
      h2: 'font-serif text-[22px] font-semibold leading-snug',
      h3: 'font-serif text-xl font-bold leading-snug',
      h4: 'font-serif text-lg font-bold leading-snug',
      'subtitle-1': 'font-sans text-[17px] font-normal leading-normal',
      'subtitle-2': 'font-sans text-[15px] font-normal leading-normal',
      'body-1': 'font-sans text-sm font-medium leading-normal',
      'body-2': 'font-sans text-[13px] font-semibold leading-normal',
      caption: 'font-sans text-xs font-normal leading-normal',
      overline: 'font-sans text-[11px] font-medium leading-normal tracking-wider uppercase',
    },
    color: {
      primary: 'text-fg-primary',
      secondary: 'text-fg-secondary',
      accent: 'text-accent-primary',
      error: 'text-error',
      inverse: 'text-fg-inverse',
      'on-accent': 'text-fg-on-accent',
      bought: 'text-status-bought',
      reserved: 'text-status-reserved',
      pending: 'text-status-pending',
    },
  },
  defaultVariants: {
    variant: 'body-1',
    color: 'primary',
  },
})

export type TextVariant = VariantProps<typeof textVariants>

export { textVariants }
