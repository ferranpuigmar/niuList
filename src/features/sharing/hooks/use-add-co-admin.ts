import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addCoAdmin } from '../api/sharing/service'

export function useAddCoAdmin(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      addCoAdmin(listId, email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', listId] })
    },
  })
}
