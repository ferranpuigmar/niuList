import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

import type { Gift } from '../../types/gift-type'

export function mapGiftDoc(id: string, data: DocumentData): Gift {
  return {
    id,
    name: data.name,
    price: data.price,
    purchaseUrl: data.purchaseUrl,
    description: data.description,
    size: data.size,
    color: data.color,
    imageUrl: data.imageUrl,
    status: data.status,
    reservedBy: data.reservedBy,
    reservedByTokenHash: data.reservedByTokenHash,
    reservedAt: data.reservedAt,
    boughtAt: data.boughtAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

// Only ever called on query result docs (snapshot.docs), which always have data.
export function mapGiftSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): Gift {
  return mapGiftDoc(snapshot.id, snapshot.data())
}
