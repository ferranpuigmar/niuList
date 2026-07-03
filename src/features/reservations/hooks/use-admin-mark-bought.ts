import { useMutation } from '@tanstack/react-query'

import { adminMarkGiftBought } from '../api/reservations/admin-service'

export function useAdminMarkBought(listId: string) {
  return useMutation({
    mutationFn: (giftId: string) => adminMarkGiftBought(listId, giftId),
  })
}
