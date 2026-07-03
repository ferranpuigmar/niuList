import { ChevronRight } from 'lucide-react'

import { StatusBadge } from '../../../app/shared/components/status-badge'
import type { Gift } from '../types/gift-type'
import { formatPrice } from '../../../app/shared/utils/format-price'

type GiftCardProps = {
  gift: Gift
  variant?: 'public' | 'admin'
  onClick?: () => void
  visitorTokenHash?: string
}

const placeholderColors = [
  '#FEF3E2', '#EDF7EF', '#FFF5EE', '#F0F0FF', '#FFF0F0',
]

function getPlaceholderColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return placeholderColors[Math.abs(hash) % placeholderColors.length]
}

export function GiftCard({ gift, variant = 'public', onClick, visitorTokenHash }: GiftCardProps) {
  const isMine =
    gift.status === 'reserved' &&
    !!visitorTokenHash &&
    gift.reservedByTokenHash === visitorTokenHash
  const isDisabled = gift.status !== 'pending' && variant === 'public' && !isMine

  return (
    <div
      className={`flex flex-col rounded-2xl border border-stroke-default bg-canvas-surface overflow-hidden ${
        variant === 'admin' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${isDisabled ? 'opacity-75' : 'cursor-pointer hover:shadow-md transition-shadow'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.()
      }}
    >
      {gift.imageUrl ? (
        <img
          alt={gift.name}
          className="aspect-[4/3] w-full object-cover bg-canvas-surface-hover"
          loading="lazy"
          src={gift.imageUrl}
        />
      ) : (
        <div
          className="aspect-[4/3] w-full"
          style={{ backgroundColor: getPlaceholderColor(gift.id) }}
        />
      )}
      <div className="flex flex-col gap-2 p-3 md:p-4">
        <h3 className="line-clamp-2 font-serif text-base text-fg-primary md:text-lg">
          {gift.name}
        </h3>
        <p className="font-body text-sm text-fg-secondary">
          desde {formatPrice(gift.price)}
        </p>
        {gift.size || gift.color ? (
          <p className="text-xs text-fg-secondary">
            {[gift.size, gift.color].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        {variant === 'admin' ? (
          <StatusBadge variant={gift.status} name={gift.reservedBy} />
        ) : (
          <StatusBadge variant={gift.status} name={isMine ? 'Tu' : gift.reservedBy} />
        )}
        {gift.status === 'pending' ? (
          <span className="flex items-center gap-1 text-sm font-medium text-fg-secondary">
            Ver detalle
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
    </div>
  )
}
