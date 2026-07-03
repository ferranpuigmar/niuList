import { useMutation } from '@tanstack/react-query'

import { markGiftBought } from '../api/reservations/service'

export function useMarkBought(listId: string) {
  return useMutation({
    mutationFn: ({ giftId, visitorToken }: { giftId: string; visitorToken: string }) =>
      markGiftBought(listId, giftId, visitorToken),
  })
}
