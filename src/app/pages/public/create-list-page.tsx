import { Baby, Shield, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate } from 'react-router-dom'

import { AppHeader } from '../../shared/components/app-header'
import { Button } from '../../shared/components/button'
import { FormField } from '../../shared/components/form-field'
import { Text } from '../../shared/components/text/text'
import {
  createListSchema,
  type CreateListValues,
} from '../../../features/lists/schemas/list-schemas'
import { useCreateListMutation } from '../../../features/lists/hooks/use-create-list'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { getFirebaseErrorMessage } from '../../../app/shared/utils/firebase-errors'
import { useAutofillSync } from '../../shared/hooks/use-autofill-sync'

export default function CreateListPage() {
  const listId = useAuthStore((s) => s.listId)
  const createListMutation = useCreateListMutation()

  const form = useForm({
    resolver: zodResolver(createListSchema),
    mode: 'onSubmit',
    defaultValues: {
      babyName: '',
      emoji: '',
      welcomeMessage: '',
      email: '',
      password: '',
      coAdminEmail: '',
      coAdminPassword: '',
    },
  })


  const formRef = useAutofillSync(form.setValue, [
    'babyName', 'emoji', 'welcomeMessage',
    'email', 'password', 'coAdminEmail', 'coAdminPassword',
  ])

  if (listId) return <Navigate replace to={`/${listId}/admin/configuracion`} />


  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form

  const onSubmit = async (values: CreateListValues) => {
    try {
      await createListMutation.mutateAsync(values)
    } catch (error) {
      setError('root', { message: getFirebaseErrorMessage(error) })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas-primary">
      <AppHeader variant="centered" />

      <main className="flex flex-1 flex-col items-center gap-8 px-4 py-10 md:px-16">
        <div className="flex w-full flex-col items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3.5 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
            <Text variant="overline" color="accent">
              Nuevo registro
            </Text>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Text variant="h1" className="text-center">
              Crea tu lista de regalos
            </Text>
            <Text variant="body-1" color="secondary" className="text-center">
              Configura los datos de tu lista y crea tu cuenta para gestionarla.
            </Text>
          </div>
        </div>

        <form ref={formRef} className="flex w-full flex-col gap-8" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-6 rounded-2xl border border-stroke-default bg-canvas-surface p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-light">
                  <Baby className="h-[18px] w-[18px] text-accent-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <Text variant="subtitle-1">Datos de la lista</Text>
                  <Text variant="body-2" color="secondary">
                    Lo que verán tus invitados
                  </Text>
                </div>
              </div>

              <FormField
                label="Nombre del bebé"
                placeholder="Emma"
                error={errors.babyName?.message}
                {...register('babyName')}
              />
              <FormField
                label="Emoji o icono (opcional)"
                placeholder="🎀"
                error={errors.emoji?.message}
                {...register('emoji')}
              />
              <FormField
                label="Mensaje de bienvenida"
                multiline
                placeholder="¡Gracias por querer celebrar la llegada de Emma!..."
                error={errors.welcomeMessage?.message}
                {...register('welcomeMessage')}
              />
            </div>

            <div className="flex flex-col gap-6 rounded-2xl border border-stroke-default bg-canvas-surface p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-light">
                  <Shield className="h-[18px] w-[18px] text-accent-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <Text variant="subtitle-1">Tu cuenta de administrador</Text>
                  <Text variant="body-2" color="secondary">
                    Credenciales para gestionar la lista
                  </Text>
                </div>
              </div>

              <FormField
                label="Email"
                type="email"
                placeholder="ferran@ejemplo.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <FormField
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <FormField
                label="Email co-admin (opcional)"
                type="email"
                placeholder="pareja@ejemplo.com"
                error={errors.coAdminEmail?.message}
                {...register('coAdminEmail')}
              />
              <FormField
                label="Contraseña co-admin (opcional)"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.coAdminPassword?.message}
                {...register('coAdminPassword')}
              />
            </div>
          </div>

          {errors.root ? (
            <Text variant="caption" color="error" className="text-center">
              {errors.root.message}
            </Text>
          ) : null}

          <div className="flex justify-center items-center">
            <Button
              variant="primary"
              icon={Sparkles}
              className="w-full rounded-xl md:w-auto"
              disabled={createListMutation.isPending}
              size="lg"
              type="submit"
            >
              {createListMutation.isPending ? 'Creando...' : 'Crear mi lista'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
