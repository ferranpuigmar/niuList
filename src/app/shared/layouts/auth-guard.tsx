import { Navigate, Outlet, useParams } from 'react-router-dom'

import { ROUTES } from '../../routes'
import { useAuthStore } from '../../../features/auth/store/auth-store'

export function AuthGuard() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const params = useParams()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-sm text-[var(--color-text-secondary)]">
        Cargando...
      </div>
    )
  }

  if (!user) {
    return <Navigate replace to={ROUTES.login} />
  }

  if (!params.listId) {
    return <Navigate replace to={ROUTES.login} />
  }

  return <Outlet />
}
