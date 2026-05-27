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
          if (!snap.empty) {
            setListId(snap.docs[0].id)
          }
        })
        .catch(() => {})
    }
  }, [user, listId, setListId])

  return null
}
