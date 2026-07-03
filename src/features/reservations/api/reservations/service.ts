import { httpsCallable } from 'firebase/functions'

import { functions } from '../../../../lib/firebase'

// Visitor-facing reservation actions run through Cloud Functions so ownership
// (only the reserver may cancel / mark bought) is enforced server-side and the
// raw visitor token is never written to a publicly readable document.

const reserveGiftFn = httpsCallable(functions, 'reserveGift')
const cancelReservationFn = httpsCallable(functions, 'cancelReservation')
const markGiftBoughtFn = httpsCallable(functions, 'markGiftBought')

export async function reserveGift(
  listId: string,
  giftId: string,
  visitorName: string,
  visitorToken: string,
) {
  await reserveGiftFn({ listId, giftId, visitorName, visitorToken })
}

export async function cancelReservation(listId: string, giftId: string, visitorToken: string) {
  await cancelReservationFn({ listId, giftId, visitorToken })
}

export async function markGiftBought(listId: string, giftId: string, visitorToken: string) {
  await markGiftBoughtFn({ listId, giftId, visitorToken })
}
