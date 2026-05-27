import { z } from 'zod'

export const reserveGiftSchema = z.object({
  visitorName: z.string().min(2, 'Escribe tu nombre'),
})

export type ReserveGiftValues = z.infer<typeof reserveGiftSchema>
