import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'

import { db } from '../../../../lib/firebase'

// Admin-only actions. These write straight to Firestore because Firestore rules
// already restrict gift updates to list admins.

export function reopenGift(listId: string, giftId: string) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

  return updateDoc(giftRef, {
    status: 'pending',
    reservedBy: null,
    reservedByTokenHash: null,
    reservedAt: null,
    boughtAt: null,
    updatedAt: serverTimestamp(),
  })
}

export function adminMarkGiftBought(listId: string, giftId: string) {
  const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

  return updateDoc(giftRef, {
    status: 'bought',
    boughtAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
