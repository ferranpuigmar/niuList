import { onCall, HttpsError } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

type AddCoAdminData = {
  listId?: string
  email?: string
  password?: string
}

function isEmailExistsError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: string }).code === 'auth/email-already-exists'
  )
}

/**
 * Creates (or reuses) a co-admin account and adds it to the list's adminIds.
 * Runs server-side with the Admin SDK so it never swaps the caller's client
 * auth session (which client-side createUserWithEmailAndPassword would), and
 * so only an existing admin of the list can add co-admins.
 */
export const addCoAdmin = onCall<AddCoAdminData>(async (request) => {
  const callerUid = request.auth?.uid
  if (!callerUid) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión')
  }

  const listId = request.data.listId?.trim()
  const email = request.data.email?.trim()
  const password = request.data.password

  if (!listId || !email || !password) {
    throw new HttpsError('invalid-argument', 'Faltan datos del co-admin')
  }
  if (password.length < 6) {
    throw new HttpsError('invalid-argument', 'La contraseña debe tener al menos 6 caracteres')
  }

  const db = getFirestore()
  const listRef = db.doc(`lists/${listId}`)
  const listSnap = await listRef.get()

  if (!listSnap.exists) {
    throw new HttpsError('not-found', 'La lista no existe')
  }

  const adminIds: string[] = listSnap.data()?.adminIds ?? []
  if (!adminIds.includes(callerUid)) {
    throw new HttpsError('permission-denied', 'No eres administrador de esta lista')
  }

  // Create the co-admin account, or reuse it if the email already exists.
  let coAdminUid: string
  try {
    const user = await getAuth().createUser({ email, password })
    coAdminUid = user.uid
  } catch (err) {
    if (isEmailExistsError(err)) {
      const existing = await getAuth().getUserByEmail(email)
      coAdminUid = existing.uid
    } else {
      logger.error('Failed to create co-admin', err)
      throw new HttpsError('internal', 'No se pudo crear el co-admin')
    }
  }

  if (adminIds.includes(coAdminUid)) {
    return { ok: true, uid: coAdminUid, alreadyAdmin: true }
  }

  await listRef.update({
    adminIds: FieldValue.arrayUnion(coAdminUid),
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { ok: true, uid: coAdminUid, alreadyAdmin: false }
})
