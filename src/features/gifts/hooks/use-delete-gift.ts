import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteGift } from '../api/gifts/service'

export function useDeleteGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, giftId }: { listId: string; giftId: string }) =>
      deleteGift(listId, giftId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gifts', variables.listId] })
    },
  })
}
