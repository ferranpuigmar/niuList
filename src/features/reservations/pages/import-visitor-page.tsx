import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react'

import { Button } from '../../../app/shared/components/button'
import { PageShell } from '../../../app/shared/components/page-shell'
import { getStoredVisitorToken, importVisitorToken } from '../hooks/use-visitor'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type ImportStatus = 'invalid' | 'confirm' | 'success'

export default function ImportVisitorPage() {
  const [searchParams] = useSearchParams()
  const listId = searchParams.get('lista') ?? ''
  const destination = listId ? `/${listId}` : '/'

  // The token travels in the fragment; read it once on mount.
  const incomingToken = useMemo(() => {
    const raw = window.location.hash.slice(1)
    return UUID_RE.test(raw) ? raw : null
  }, [])

  const [status, setStatus] = useState<ImportStatus>(() => {
    if (!incomingToken) return 'invalid'
    const current = getStoredVisitorToken()
    // If this device already has a different identity, ask before replacing it.
    return current && current !== incomingToken ? 'confirm' : 'success'
  })

  useEffect(() => {
    if (!incomingToken) return
    // Drop the secret from the address bar / history as soon as possible.
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    if (status === 'success') importVisitorToken(incomingToken)
  }, [incomingToken, status])

  const handleReplace = () => {
    if (!incomingToken) return
    importVisitorToken(incomingToken)
    setStatus('success')
  }

  if (status === 'invalid') {
    return (
      <PageShell className="mx-auto max-w-md space-y-4 py-16 text-center">
        <CircleX className="mx-auto h-10 w-10 text-error" />
        <h1 className="font-serif text-3xl">Enlace no válido</h1>
        <p className="text-sm text-fg-secondary">
          Este enlace de transferencia está incompleto o caducado. Genera uno nuevo desde el
          dispositivo donde hiciste tus reservas.
        </p>
        <Link to="/">
          <Button variant="outline">Ir al inicio</Button>
        </Link>
      </PageShell>
    )
  }

  if (status === 'confirm') {
    return (
      <PageShell className="mx-auto max-w-md space-y-4 py-16 text-center">
        <TriangleAlert className="mx-auto h-10 w-10 text-accent-primary" />
        <h1 className="font-serif text-3xl">Este dispositivo ya tiene reservas</h1>
        <p className="text-sm text-fg-secondary">
          Si continúas, este navegador pasará a usar la identidad del enlace y dejará de
          gestionar las reservas hechas desde aquí (si las había).
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={handleReplace}>Sí, usar la identidad del enlace</Button>
          <Link to={destination}>
            <Button fullWidth variant="ghost">
              No, mantener la de este dispositivo
            </Button>
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell className="mx-auto max-w-md space-y-4 py-16 text-center">
      <CircleCheck className="mx-auto h-10 w-10 text-accent-primary" />
      <h1 className="font-serif text-3xl">¡Listo!</h1>
      <p className="text-sm text-fg-secondary">
        Tus reservas ya están disponibles en este dispositivo. Podrás cancelarlas o marcarlas
        como compradas igual que en el original.
      </p>
      <Link to={destination}>
        <Button fullWidth>{listId ? 'Ir a la lista' : 'Ir al inicio'}</Button>
      </Link>
    </PageShell>
  )
}
