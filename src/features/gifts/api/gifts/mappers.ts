import type { DocumentData, DocumentSnapshot } from 'firebase/firestore'

import type { Gift } from '../../types/gift-type'

export function mapGiftSnapshot(snapshot: DocumentSnapshot<DocumentData>): Gift {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    name: data.name,
    price: data.price,
    purchaseUrl: data.purchaseUrl,
    description: data.description,
    size: data.size,
    color: data.color,
    imageUrl: data.imageUrl,
    status: data.status,
    reservedBy: data.reservedBy,
    reservedByToken: data.reservedByToken,
    reservedAt: data.reservedAt,
    boughtAt: data.boughtAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}
