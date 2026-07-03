import { httpsCallable } from 'firebase/functions'

import { functions } from '../../../../lib/firebase'

export function getPublicListUrl(listId: string) {
  return `${window.location.origin}/${listId}`
}

export async function copyShareUrl(listId: string) {
  const url = getPublicListUrl(listId)
  await navigator.clipboard.writeText(url)
  return url
}

// Co-admin creation runs in a Cloud Function (Admin SDK) so it never swaps the
// caller's auth session and only an existing admin can add co-admins.
const addCoAdminFn = httpsCallable(functions, 'addCoAdmin')

export async function addCoAdmin(listId: string, email: string, password: string) {
  await addCoAdminFn({ listId, email, password })
}
