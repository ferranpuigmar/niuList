import { z } from 'zod'

export const updateListSchema = z.object({
  babyName: z.string().default('').pipe(z.string().min(2, 'Escribe al menos 2 caracteres')),
  emoji: z.string().default(''),
  welcomeMessage: z.string().default('').pipe(z.string().min(8, 'Minimo 8 caracteres')),
})

export const createListSchema = z
  .object({
    babyName: z.string().default('').pipe(z.string().min(2, 'Escribe al menos 2 caracteres')),
    emoji: z.string().default(''),
    welcomeMessage: z.string().default('').pipe(z.string().min(8, 'Minimo 8 caracteres')),
    email: z.string().default('').pipe(z.email('Introduce un email valido')),
    password: z.string().default('').pipe(z.string().min(6, 'Minimo 6 caracteres')),
    coAdminEmail: z.string().default('').pipe(z.email('Introduce un email valido').or(z.literal(''))),
    coAdminPassword: z.string().default(''),
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

export type UpdateListValues = {
  babyName: string
  emoji: string
  welcomeMessage: string
}

export type CreateListValues = {
  babyName: string
  emoji: string
  welcomeMessage: string
  email: string
  password: string
  coAdminEmail: string
  coAdminPassword: string
}
