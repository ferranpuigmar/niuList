import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { createAuthUser, login } from '../../auth/api/session/service'
import { mapFirebaseUser } from '../../auth/api/session/mappers'
import { useAuthStore } from '../../auth/store/auth-store'
import { createList } from '../api/lists/service'
import type { CreateListValues } from '../schemas/list-schemas'

export function useCreateListMutation() {
  const setUser = useAuthStore((s) => s.setUser)
  const setListId = useAuthStore((s) => s.setListId)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: CreateListValues) => {
      const mainCred = await createAuthUser(input.email, input.password)
      const adminIds = [mainCred.user.uid]

      if (input.coAdminEmail && input.coAdminPassword) {
        const coAdminCred = await createAuthUser(input.coAdminEmail, input.coAdminPassword)
        adminIds.push(coAdminCred.user.uid)
        await login(input.email, input.password)
      }

      const { babyName, emoji, welcomeMessage } = input
      const listRef = await createList({ babyName, emoji, welcomeMessage, adminIds })

      setUser(mapFirebaseUser(mainCred.user))
      setListId(listRef.id)

      return listRef.id
    },
    onSuccess: (listId) => {
      navigate(`/${listId}/admin`)
    },
  })
}
