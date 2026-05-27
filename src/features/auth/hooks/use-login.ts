import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { login } from '../api/session/service'
import { getListsByAdminId } from '../../lists/api/lists/service'
import { mapFirebaseUser } from '../api/session/mappers'
import { useAuthStore } from '../store/auth-store'

export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser)
  const setListId = useAuthStore((s) => s.setListId)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const cred = await login(email, password)
      setUser(mapFirebaseUser(cred.user))
      const listsSnap = await getListsByAdminId(cred.user.uid)
      if (listsSnap.empty) {
        throw new Error('No tienes ninguna lista asociada a esta cuenta')
      }
      const id = listsSnap.docs[0].id
      setListId(id)
      return id
    },
    onSuccess: (listId) => {
      navigate(`/${listId}/admin`)
    },
  })
}
