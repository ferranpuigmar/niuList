import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../../../app/shared/components/button'
import { FormField } from '../../../app/shared/components/form-field'
import { PageShell } from '../../../app/shared/components/page-shell'
import { AddCoAdminDialog } from '../../sharing/components/add-co-admin-dialog'
import { useAddCoAdmin } from '../../sharing/hooks/use-add-co-admin'
import { useList } from '../hooks/use-list'
import { useUpdateList } from '../hooks/use-update-list'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { useChangePassword } from '../../../features/auth/hooks/use-change-password'
import { updateListSchema, type UpdateListValues } from '../schemas/list-schemas'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '../../../features/auth/schemas/auth-schemas'
import { getFirebaseErrorMessage } from '../../../app/shared/utils/firebase-errors'

export default function AdminSettingsPage() {
  const params = useParams()
  const listId = params.listId ?? ''

  const user = useAuthStore((s) => s.user)
  const { data: list, isLoading } = useList(listId)
  const updateMutation = useUpdateList(listId)
  const changePasswordMutation = useChangePassword()

  const [listSaved, setListSaved] = useState(false)
  const [showCoAdminDialog, setShowCoAdminDialog] = useState(false)
  const addCoAdminMutation = useAddCoAdmin(listId)

  const listForm = useForm({
    resolver: zodResolver(updateListSchema),
    values: {
      babyName: list?.babyName ?? '',
      emoji: list?.emoji ?? '',
      welcomeMessage: list?.welcomeMessage ?? '',
    },
  })

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const handleUpdateList = async (values: UpdateListValues) => {
    await updateMutation.mutateAsync(values)
    setListSaved(true)
    setTimeout(() => setListSaved(false), 3000)
  }

  const handleChangePassword = async (values: ChangePasswordValues) => {
    await changePasswordMutation.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
    passwordForm.reset()
  }

  if (isLoading) {
    return (
      <PageShell className="py-10 text-center text-sm text-fg-secondary">
        Cargando...
      </PageShell>
    )
  }

  return (
    <PageShell className="space-y-6">
      <Link
        className="text-sm font-medium text-accent-primary hover:underline"
        to={`/${listId}/admin`}
      >
        Volver a la lista
      </Link>

      <h1 className="font-serif text-4xl md:text-5xl">Configuracion</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="space-y-4 rounded-2xl border border-stroke-default bg-canvas-surface p-6">
          <h2 className="font-serif text-2xl">Datos de la lista</h2>
          <form
            className="space-y-4"
            onSubmit={listForm.handleSubmit(handleUpdateList)}
          >
            <FormField
              label="Nombre del bebe"
              error={listForm.formState.errors.babyName?.message}
              {...listForm.register('babyName')}
            />
            <FormField
              label="Emoji o icono"
              error={listForm.formState.errors.emoji?.message}
              {...listForm.register('emoji')}
            />
            <FormField
              label="Mensaje de bienvenida"
              multiline
              error={listForm.formState.errors.welcomeMessage?.message}
              {...listForm.register('welcomeMessage')}
            />

            {updateMutation.isError ? (
              <p className="font-body text-xs text-error">
                {getFirebaseErrorMessage(updateMutation.error)}
              </p>
            ) : null}

            {listSaved ? (
              <p className="font-body text-xs text-status-bought">Cambios guardados</p>
            ) : null}

            <Button
              disabled={updateMutation.isPending}
              fullWidth
              type="submit"
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </div>

        <div className="space-y-4 rounded-2xl border border-stroke-default bg-canvas-surface p-6">
          <h2 className="font-serif text-2xl">Tu cuenta</h2>

          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-fg-secondary">
            {user?.email ?? 'Sesion no disponible'}
          </p>
            <Button
              onClick={() => setShowCoAdminDialog(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              Anadir co-admin
            </Button>
          </div>
          <form
            className="space-y-4"
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
          >
            <FormField
              label="Contrasena actual"
              type="password"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')}
            />
            <FormField
              label="Nueva contrasena"
              type="password"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword')}
            />
            <FormField
              label="Confirmar nueva contrasena"
              type="password"
              error={passwordForm.formState.errors.confirmNewPassword?.message}
              {...passwordForm.register('confirmNewPassword')}
            />

            {changePasswordMutation.isSuccess ? (
              <p className="font-body text-xs text-status-bought">
                Contrasena actualizada correctamente
              </p>
            ) : null}

            {changePasswordMutation.isError ? (
              <p className="font-body text-xs text-error">
                {getFirebaseErrorMessage(changePasswordMutation.error)}
              </p>
            ) : null}

            <Button
              disabled={changePasswordMutation.isPending}
              fullWidth
              type="submit"
              variant="dark"
            >
              {changePasswordMutation.isPending
                ? 'Cambiando contrasena...'
                : 'Cambiar contrasena'}
            </Button>
          </form>
        </div>
      </div>

      <AddCoAdminDialog
        open={showCoAdminDialog}
        onClose={() => setShowCoAdminDialog(false)}
        onAdd={async (values) => {
          await addCoAdminMutation.mutateAsync(values)
        }}
      />
    </PageShell>
  )
}
