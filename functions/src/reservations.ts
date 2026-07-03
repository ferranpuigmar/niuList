import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import { hashToken } from './utils/token.js'

type ReserveData = {
  listId?: string
  giftId?: string
  visitorName?: string
  visitorToken?: string
}

type OwnedActionData = {
  listId?: string
  giftId?: string
  visitorToken?: string
}

function giftDoc(listId: string, giftId: string) {
  return getFirestore().doc(`lists/${listId}/gifts/${giftId}`)
}

/**
 * Reserve a pending gift. Runs in a transaction so two visitors can't grab the
 * same gift at once, and stores only the hash of the visitor's token.
 */
export const reserveGift = onCall<ReserveData>(async (request) => {
  const listId = request.data.listId?.trim()
  const giftId = request.data.giftId?.trim()
  const visitorName = request.data.visitorName?.trim()
  const visitorToken = request.data.visitorToken?.trim()

  if (!listId || !giftId || !visitorName || !visitorToken) {
    throw new HttpsError('invalid-argument', 'Faltan datos de la reserva')
  }

  const ref = giftDoc(listId, giftId)

  await getFirestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'El regalo no existe')
    }
    if (snap.data()?.status !== 'pending') {
      throw new HttpsError('failed-precondition', 'El regalo ya no está disponible')
    }

    tx.update(ref, {
      status: 'reserved',
      reservedBy: visitorName,
      reservedByTokenHash: hashToken(visitorToken),
      reservedAt: FieldValue.serverTimestamp(),
      boughtAt: null,
      updatedAt: FieldValue.serverTimestamp(),
    })
  })

  return { ok: true }
})

/** Cancel a reservation — only the visitor who made it (matching token) can. */
export const cancelReservation = onCall<OwnedActionData>(async (request) => {
  const listId = request.data.listId?.trim()
  const giftId = request.data.giftId?.trim()
  const visitorToken = request.data.visitorToken?.trim()

  if (!listId || !giftId || !visitorToken) {
    throw new HttpsError('invalid-argument', 'Faltan datos')
  }

  const ref = giftDoc(listId, giftId)

  await getFirestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'El regalo no existe')
    }
    const gift = snap.data()!
    if (gift.status !== 'reserved' || gift.reservedByTokenHash !== hashToken(visitorToken)) {
      throw new HttpsError('permission-denied', 'No puedes cancelar esta reserva')
    }

    tx.update(ref, {
      status: 'pending',
      reservedBy: null,
      reservedByTokenHash: null,
      reservedAt: null,
      boughtAt: null,
      updatedAt: FieldValue.serverTimestamp(),
    })
  })

  return { ok: true }
})

/** Mark a reserved gift as bought — only the visitor who reserved it. */
export const markGiftBought = onCall<OwnedActionData>(async (request) => {
  const listId = request.data.listId?.trim()
  const giftId = request.data.giftId?.trim()
  const visitorToken = request.data.visitorToken?.trim()

  if (!listId || !giftId || !visitorToken) {
    throw new HttpsError('invalid-argument', 'Faltan datos')
  }

  const ref = giftDoc(listId, giftId)

  await getFirestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'El regalo no existe')
    }
    const gift = snap.data()!
    if (gift.status !== 'reserved' || gift.reservedByTokenHash !== hashToken(visitorToken)) {
      throw new HttpsError('permission-denied', 'No puedes marcar este regalo')
    }

    tx.update(ref, {
      status: 'bought',
      boughtAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
  })

  return { ok: true }
})
