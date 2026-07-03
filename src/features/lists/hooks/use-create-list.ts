import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { createAuthUser } from '../../auth/api/session/service'
import { mapFirebaseUser } from '../../auth/api/session/mappers'
import { useAuthStore } from '../../auth/store/auth-store'
import { addCoAdmin } from '../../sharing/api/sharing/service'
import { createList } from '../api/lists/service'
import type { CreateListValues } from '../schemas/list-schemas'

export function useCreateListMutation() {
  const setUser = useAuthStore((s) => s.setUser)
  const setListId = useAuthStore((s) => s.setListId)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: CreateListValues) => {
      const mainCred = await createAuthUser(input.email, input.password)

      const { babyName, emoji, welcomeMessage } = input
      const listRef = await createList({
        babyName,
        emoji,
        welcomeMessage,
        adminIds: [mainCred.user.uid],
      })

      // The co-admin is created server-side so the caller stays signed in as
      // the main admin (no session swap, no re-login workaround).
      if (input.coAdminEmail && input.coAdminPassword) {
        await addCoAdmin(listRef.id, input.coAdminEmail, input.coAdminPassword)
      }

      setUser(mapFirebaseUser(mainCred.user))
      setListId(listRef.id)

      return listRef.id
    },
    onSuccess: (listId) => {
      navigate(`/${listId}/admin`)
    },
  })
}
