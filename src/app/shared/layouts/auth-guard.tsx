import { Navigate, Outlet, useParams } from 'react-router-dom'

import { ROUTES } from '../../routes'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { useList } from '../../../features/lists/hooks/use-list'

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-sm text-[var(--color-text-secondary)]">
    Cargando...
  </div>
)

export function AuthGuard() {
  const user = useAuthStore((s) => s.user)
  const authLoading = useAuthStore((s) => s.loading)
  const params = useParams()
  const listId = params.listId ?? ''

  const { data: list, isLoading: listLoading, isError } = useList(listId)

  if (authLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate replace to={ROUTES.login} />
  }

  if (!listId) {
    return <Navigate replace to={ROUTES.login} />
  }

  if (listLoading) {
    return <Loading />
  }

  // The list doesn't exist → nothing to administer.
  if (isError || !list) {
    return <Navigate replace to={ROUTES.landing} />
  }

  // Logged in but not an admin of this list → send to its public view.
  if (!list.adminIds.includes(user.uid)) {
    return <Navigate replace to={`/${listId}`} />
  }

  return <Outlet />
}
