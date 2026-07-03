import { useMutation } from '@tanstack/react-query'

import { reopenGift } from '../api/reservations/admin-service'

export function useReopenGift(listId: string) {
  return useMutation({
    mutationFn: (giftId: string) => reopenGift(listId, giftId),
  })
}
