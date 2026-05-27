import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createGift, updateGift } from '../api/gifts/service'
import { uploadGiftImage } from '../api/gifts/image-service'
import type { GiftValues } from '../schemas/gift-schemas'

type CreateGiftInput = GiftValues & { imageFile?: File; listId: string }

export function useCreateGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ listId, imageFile, ...input }: CreateGiftInput) => {
      const { name, price, purchaseUrl, description, size, color } = input
      const docRef = await createGift(listId, { name, price, purchaseUrl, description, size, color })

      if (imageFile) {
        const imageUrl = await uploadGiftImage(listId, docRef.id, imageFile)
        await updateGift(listId, docRef.id, { imageUrl })
      }

      return docRef.id
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gifts', variables.listId] })
    },
  })
}
