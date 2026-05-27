import { useMutation, useQueryClient } from '@tanstack/react-query'

import { reopenGift } from '../api/reservations/service'

export function useReopenGift(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (giftId: string) => reopenGift(listId, giftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts', listId] })
    },
  })
}
