export type GiftStatus = 'pending' | 'reserved' | 'bought'

export type Gift = {
  id: string
  name: string
  price: number
  purchaseUrl: string
  description?: string
  size?: string
  color?: string
  imageUrl?: string
  status: GiftStatus
  reservedBy?: string
  reservedByTokenHash?: string
  reservedAt?: unknown
  boughtAt?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}
