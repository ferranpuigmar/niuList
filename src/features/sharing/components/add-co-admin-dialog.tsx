import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '../../../app/shared/components/button'
import { FormField } from '../../../app/shared/components/form-field'

const addCoAdminSchema = z.object({
  email: z.string().email('Introduce un email valido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
})

type AddCoAdminValues = z.infer<typeof addCoAdminSchema>

type AddCoAdminDialogProps = {
  open: boolean
  onClose: () => void
  onAdd: (values: AddCoAdminValues) => Promise<void>
}

export function AddCoAdminDialog({ open, onClose, onAdd }: AddCoAdminDialogProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<AddCoAdminValues>({
    resolver: zodResolver(addCoAdminSchema),
    defaultValues: { email: '', password: '' },
  })

  const { register, handleSubmit, formState, reset } = form

  const handleSubmitForm = async (values: AddCoAdminValues) => {
    setPending(true)
    setError(null)
    try {
      await onAdd(values)
      reset()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al anadir co-admin')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog className="relative z-50" onClose={onClose} open={open}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md space-y-4 rounded-2xl border border-stroke-default bg-canvas-surface p-6 shadow-xl">
          <DialogTitle className="font-serif text-2xl">Anadir co-admin</DialogTitle>
          <p className="font-body text-sm text-fg-secondary">
            El co-administrador podra gestionar los regalos y la configuracion de la lista.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
            <FormField
              label="Email del co-admin"
              type="email"
              error={formState.errors.email?.message}
              {...register('email')}
            />
            <FormField
              label="Contrasena"
              type="password"
              autoComplete="new-password"
              error={formState.errors.password?.message}
              {...register('password')}
            />
            {error ? (
              <p className="font-body text-xs text-error">{error}</p>
            ) : null}
            <div className="flex gap-2">
              <Button
                disabled={pending}
                type="submit"
              >
                {pending ? 'Anadiendo...' : 'Anadir co-admin'}
              </Button>
              <Button
                onClick={onClose}
                type="button"
                variant="ghost"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
