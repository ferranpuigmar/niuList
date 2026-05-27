import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ROUTES } from '../../routes'
import { Button } from '../../shared/components/button'
import { FormField } from '../../shared/components/form-field'
import { PageShell } from '../../shared/components/page-shell'
import { loginSchema, type LoginValues } from '../../../features/auth/schemas/auth-schemas'
import { useLoginMutation } from '../../../features/auth/hooks/use-login'
import { getFirebaseErrorMessage } from '../../../app/shared/utils/firebase-errors'

export default function LoginPage() {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form

  const onSubmit = async (values: LoginValues) => {
    try {
      await loginMutation.mutateAsync(values)
    } catch (error) {
      setError('root', { message: getFirebaseErrorMessage(error) })
    }
  }

  return (
    <PageShell className="flex justify-center py-10 md:py-16">
      <div className="w-full max-w-md rounded-2xl border border-stroke-default bg-canvas-surface p-6 md:p-8">
        <h1 className="font-serif text-3xl">Inicia sesion</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <FormField
            label="Contrasena"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root ? (
            <p className="font-body text-xs text-error">{errors.root.message}</p>
          ) : null}

          <Button fullWidth disabled={loginMutation.isPending} type="submit">
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-fg-secondary">
          No tienes cuenta?{' '}
          <Link className="font-medium text-accent-primary hover:underline" to={ROUTES.createList}>
            Crea tu lista
          </Link>
        </p>
      </div>
    </PageShell>
  )
}
