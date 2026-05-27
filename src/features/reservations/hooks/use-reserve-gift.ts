import { useMutation } from '@tanstack/react-query'

import { reserveGift } from '../api/reservations/service'

export function useReserveGift(listId: string) {
  return useMutation({
    mutationFn: ({
      giftId,
      visitorName,
      visitorToken,
    }: {
      giftId: string
      visitorName: string
      visitorToken: string
    }) => reserveGift(listId, giftId, visitorName, visitorToken),
  })
}
