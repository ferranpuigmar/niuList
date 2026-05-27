import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'

import { db } from '../../../../lib/firebase'

export function reserveGift(
  listId: string,
  giftId: string,
  reservedBy: string,
  reservedByToken: string,
) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

  return updateDoc(giftRef, {
    status: 'reserved',
    reservedBy,
    reservedByToken,
    reservedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function cancelReservation(listId: string, giftId: string) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

  return updateDoc(giftRef, {
    status: 'pending',
    reservedBy: null,
    reservedByToken: null,
    reservedAt: null,
    boughtAt: null,
    updatedAt: serverTimestamp(),
  })
}

export function markGiftAsBought(listId: string, giftId: string) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

  return updateDoc(giftRef, {
    status: 'bought',
    boughtAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function reopenGift(listId: string, giftId: string) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

  return updateDoc(giftRef, {
    status: 'pending',
    reservedBy: null,
    reservedByToken: null,
    reservedAt: null,
    boughtAt: null,
    updatedAt: serverTimestamp(),
  })
}
