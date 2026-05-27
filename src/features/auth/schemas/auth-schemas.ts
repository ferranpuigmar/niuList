import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Introduce un email valido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
})

export type LoginValues = z.infer<typeof loginSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Introduce tu contrasena actual'),
    newPassword: z.string().min(6, 'Minimo 6 caracteres'),
    confirmNewPassword: z.string().min(6, 'Repite la nueva contrasena'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmNewPassword'],
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
