import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

import { db } from '../../../../lib/firebase'

type GiftInput = {
  name: string
  price: number
  purchaseUrl: string
  description?: string
  size?: string
  color?: string
  imageUrl?: string
}

export function createGift(listId: string, input: GiftInput) {
  const giftsRef = collection(db, 'lists', listId, 'gifts')

  return addDoc(giftsRef, {
    ...input,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function updateGift(listId: string, giftId: string, input: Partial<GiftInput>) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

  return updateDoc(giftRef, {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export function deleteGift(listId: string, giftId: string) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)
  return deleteDoc(giftRef)
}
