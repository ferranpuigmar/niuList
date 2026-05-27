import { Outlet, useNavigate } from 'react-router-dom'

import { AppHeader } from '../components/app-header'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { logout } from '../../../features/auth/api/session/service'
import { ROUTES } from '../../routes'

export function AdminLayout() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.landing)
  }

  return (
    <div className="min-h-screen bg-canvas-primary text-fg-primary">
      <AppHeader
        variant="admin"
        onLogout={handleLogout}
        userSlot={user?.email}
      />
      <Outlet />
    </div>
  )
}
