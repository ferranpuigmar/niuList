import { useMutation } from '@tanstack/react-query'

import { cancelReservation } from '../api/reservations/service'

export function useCancelReservation(listId: string) {
  return useMutation({
    mutationFn: (giftId: string) => cancelReservation(listId, giftId),
  })
}
