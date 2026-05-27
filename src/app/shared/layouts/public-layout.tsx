import { Outlet, useMatches } from 'react-router-dom'

import { AppHeader } from '../components/app-header'

export function PublicLayout() {
  const matches = useMatches()
  const isLanding = matches.some((m) => m.pathname === '/')

  return (
    <div className="flex min-h-screen flex-col bg-canvas-primary text-fg-primary">
      <AppHeader variant={isLanding ? 'landing' : 'public'} />
      <Outlet />
    </div>
  )
}
