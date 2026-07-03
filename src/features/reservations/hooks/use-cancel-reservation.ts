import { useMutation } from '@tanstack/react-query'

import { cancelReservation } from '../api/reservations/service'

export function useCancelReservation(listId: string) {
  return useMutation({
    mutationFn: ({ giftId, visitorToken }: { giftId: string; visitorToken: string }) =>
      cancelReservation(listId, giftId, visitorToken),
  })
}
