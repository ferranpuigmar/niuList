import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createAuthUser } from '../../auth/api/session/service'
import { addCoAdminToList } from '../../lists/api/lists/service'

export function useAddCoAdmin(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const cred = await createAuthUser(email, password)
      await addCoAdminToList(listId, cred.user.uid)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', listId] })
    },
  })
}
