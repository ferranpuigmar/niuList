import { z } from 'zod'

export const updateListSchema = z.object({
  babyName: z.string().min(2, 'Escribe al menos 2 caracteres'),
  emoji: z.string(),
  welcomeMessage: z.string().min(8, 'Minimo 8 caracteres'),
})

export const createListSchema = z
  .object({
    babyName: z.string().min(2, 'Escribe al menos 2 caracteres'),
    emoji: z.string(),
    welcomeMessage: z.string().min(8, 'Minimo 8 caracteres'),
    email: z.email('Introduce un email valido'),
    password: z.string().min(6, 'Minimo 6 caracteres'),
    coAdminEmail: z.email('Introduce un email valido').or(z.literal('')),
    coAdminPassword: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.coAdminEmail && !values.coAdminPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes indicar password del co-admin',
        path: ['coAdminPassword'],
      })
    }
  })

export type UpdateListValues = z.infer<typeof updateListSchema>

export type CreateListValues = z.infer<typeof createListSchema>
