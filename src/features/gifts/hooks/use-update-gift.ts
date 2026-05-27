import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateGift } from '../api/gifts/service'
import { uploadGiftImage } from '../api/gifts/image-service'
import type { GiftValues } from '../schemas/gift-schemas'

type UpdateGiftInput = GiftValues & { imageFile?: File; listId: string; giftId: string }

export function useUpdateGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ listId, giftId, imageFile, ...input }: UpdateGiftInput) => {
      const { name, price, purchaseUrl, description, size, color } = input
      const payload: Parameters<typeof updateGift>[2] = { name, price, purchaseUrl, description, size, color }

      if (imageFile) {
        payload.imageUrl = await uploadGiftImage(listId, giftId, imageFile)
      }

      await updateGift(listId, giftId, payload)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gifts', variables.listId] })
    },
  })
}
