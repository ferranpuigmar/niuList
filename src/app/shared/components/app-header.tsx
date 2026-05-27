import { Fragment, type ReactNode } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDown, Eye, Gift, LayoutDashboard, LogIn, Settings, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { cn } from '../utils/cn'
import { StatusBadge } from './status-badge'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { logout } from '../../../features/auth/api/session/service'
import { ROUTES } from '../../routes'

type AppHeaderProps = {
  variant?: 'public' | 'admin' | 'landing' | 'centered'
  listName?: string
  className?: string
  onLogout?: () => void
  userSlot?: ReactNode
}

function AdminNav({ listId, userSlot, onLogout }: { listId: string | null; userSlot?: ReactNode; onLogout?: () => void }) {
  return (
    <nav className="flex items-center gap-2.5 md:gap-4">
      {userSlot ? (
        <span className="hidden text-sm text-fg-secondary md:block">{userSlot}</span>
      ) : null}
      <StatusBadge variant="admin" />
      <Menu as="div" className="relative">
        <MenuButton className="flex items-center gap-1.5 rounded-lg border border-stroke-default px-3 py-1.5 text-sm text-fg-secondary transition-colors hover:bg-canvas-surface-hover">
          <div className="h-6 w-6 rounded-full bg-accent-primary" />
          <ChevronDown className="h-3.5 w-3.5" />
        </MenuButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-stroke-default bg-canvas-surface p-1.5 shadow-lg">
            {listId ? (
              <MenuItem>
                <Link
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-primary transition-colors hover:bg-canvas-surface-hover"
                  to={`/${listId}/admin`}
                >
                  <LayoutDashboard className="h-4 w-4 text-fg-secondary" />
                  Administrar lista
                </Link>
              </MenuItem>
            ) : null}
            {listId ? (
              <MenuItem>
                <Link
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-primary transition-colors hover:bg-canvas-surface-hover"
                  to={`/${listId}`}
                >
                  <Eye className="h-4 w-4 text-fg-secondary" />
                  Ver lista publica
                </Link>
              </MenuItem>
            ) : null}
            {listId ? (
              <MenuItem>
                <Link
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-primary transition-colors hover:bg-canvas-surface-hover"
                  to={`/${listId}/admin/configuracion`}
                >
                  <Settings className="h-4 w-4 text-fg-secondary" />
                  Configuracion
                </Link>
              </MenuItem>
            ) : null}
            <div className="my-1 border-t border-stroke-default" />
            {onLogout ? (
              <MenuItem>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-primary transition-colors hover:bg-canvas-surface-hover"
                  onClick={onLogout}
                  type="button"
                >
                  <LogOut className="h-4 w-4 text-fg-secondary" />
                  Cerrar sesion
                </button>
              </MenuItem>
            ) : null}
          </MenuItems>
        </Transition>
      </Menu>
    </nav>
  )
}

export function AppHeader({
  variant = 'public',
  listName,
  className,
  onLogout,
  userSlot,
}: AppHeaderProps) {
  const user = useAuthStore((s) => s.user)
  const listIdStore = useAuthStore((s) => s.listId)
  const navigate = useNavigate()

  const isLoggedIn = !!user && !!listIdStore

  const listId = variant === 'admin' ? listIdStore : listIdStore
  const handleLogout = onLogout ?? (isLoggedIn
    ? async () => {
        await logout()
        navigate(ROUTES.landing)
      }
    : undefined)

  const logoLink = isLoggedIn ? `/${listIdStore}` : ROUTES.landing
  const logoLabel = listName ? `Lista de ${listName}` : 'regalitos'

  const isCentered = variant === 'centered'

  return (
    <header
      className={cn(
        'w-full border-b border-stroke-default',
        isCentered ? 'bg-canvas-surface' : 'bg-canvas-surface/95 backdrop-blur supports-[backdrop-filter]:bg-canvas-surface/80',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl items-center px-4 md:px-16',
          isCentered ? 'justify-center py-4' : 'h-16 justify-between',
        )}
      >
        <Link
          className={cn('flex items-center gap-2', variant === 'landing' ? 'gap-2.5' : 'gap-2')}
          to={logoLink}
        >
          <Gift className={cn('text-accent-primary', variant === 'landing' ? 'h-[22px] w-[22px]' : 'h-5 w-5')} />
          <span
            className={cn(
              'text-fg-primary',
              variant === 'landing' ? 'font-heading text-xl font-normal' : 'font-serif text-xl',
            )}
          >
            {logoLabel}
          </span>
        </Link>

        {!isCentered ? (
          variant === 'admin' || isLoggedIn ? (
            <AdminNav listId={listId} userSlot={userSlot} onLogout={handleLogout} />
          ) : variant === 'landing' ? (
            <Link
              className="flex items-center gap-2 rounded-lg border border-stroke-default px-4 py-2"
              to={ROUTES.login}
            >
              <LogIn className="h-4 w-4 text-fg-secondary" />
              <span className="font-body text-[13px] font-medium text-fg-secondary">
                Iniciar sesion
              </span>
            </Link>
          ) : (
            <div>
              <Link
                className="font-body text-sm font-medium text-accent-primary hover:underline"
                to={ROUTES.login}
              >
                Iniciar sesion
              </Link>
            </div>
          )
        ) : null}
      </div>
    </header>
  )
}
