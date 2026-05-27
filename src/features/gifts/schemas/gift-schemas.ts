import { z } from 'zod'

export const giftSchema = z.object({
  name: z.string().min(2, 'Escribe al menos 2 caracteres'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  purchaseUrl: z.string().url('Introduce una URL valida'),
  description: z.string().optional(),
  size: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
})

export type GiftValues = z.infer<typeof giftSchema>
