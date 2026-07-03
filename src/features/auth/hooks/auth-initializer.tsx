import { useAuthObserver } from './use-auth'
import { useEffect } from 'react'
import { getListsByAdminId } from '../../lists/api/lists/service'
import { useAuthStore } from '../store/auth-store'

export function AuthInitializer() {
  const user = useAuthStore((s) => s.user)
  const listId = useAuthStore((s) => s.listId)
  const setListId = useAuthStore((s) => s.setListId)

  useAuthObserver()

  useEffect(() => {
    if (user && !listId) {
      getListsByAdminId(user.uid)
        .then((snap) => {
          if (snap.empty) return
          // Deterministically pick the user's oldest (original) list instead of
          // relying on the arbitrary default document order.
          const millis = (doc: (typeof snap.docs)[number]) =>
            doc.data().createdAt?.toMillis?.() ?? 0
          const oldest = [...snap.docs].sort((a, b) => millis(a) - millis(b))[0]
          setListId(oldest.id)
        })
        .catch(() => {})
    }
  }, [user, listId, setListId])

  return null
}
