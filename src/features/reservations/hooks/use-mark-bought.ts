import { useMutation } from '@tanstack/react-query'

import { markGiftAsBought } from '../api/reservations/service'

export function useMarkBought(listId: string) {
  return useMutation({
    mutationFn: (giftId: string) => markGiftAsBought(listId, giftId),
  })
}
