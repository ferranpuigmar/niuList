import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  BookmarkCheck,
  Clock,
  Gift,
  Pencil,
  RotateCcw,
  Settings,
  ShoppingBag,
} from 'lucide-react'

import { Button } from '../../../app/shared/components/button'
import { ConfirmDialog } from '../../../app/shared/components/confirm-dialog'
import { PageShell } from '../../../app/shared/components/page-shell'
import { StatusBadge } from '../../../app/shared/components/status-badge'
import { StatCard } from '../components/stat-card'
import { ShareButton } from '../../sharing/components/share-button'
import { useGifts } from '../hooks/use-gifts'
import { useMarkBought } from '../../reservations/hooks/use-mark-bought'
import { useReopenGift } from '../../reservations/hooks/use-reopen-gift'

export default function AdminListPage() {
  const params = useParams()
  const listId = params.listId ?? ''

  const { gifts, loading } = useGifts(listId)
  const markBoughtMutation = useMarkBought(listId)
  const reopenMutation = useReopenGift(listId)
  const [confirmAction, setConfirmAction] = useState<{ type: 'reopen' | 'markBought'; giftId: string } | null>(null)

  const [filter, setFilter] = useState<'all' | 'pending' | 'reserved' | 'bought'>('all')

  const total = gifts.length
  const pending = gifts.filter((g) => g.status === 'pending').length
  const reserved = gifts.filter((g) => g.status === 'reserved').length
  const bought = gifts.filter((g) => g.status === 'bought').length

  const filteredGifts = filter === 'all' ? gifts : gifts.filter((g) => g.status === filter)

  const stats = [
    { icon: Gift, key: 'all' as const, label: 'Total', value: total },
    { icon: Clock, key: 'pending' as const, label: 'Pendientes', value: pending },
    { icon: BookmarkCheck, key: 'reserved' as const, label: 'Reservados', value: reserved },
    { icon: ShoppingBag, key: 'bought' as const, label: 'Comprados', value: bought },
  ]

  return (
    <PageShell className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">Gestionar lista de regalos</h1>
        </div>
        <div className="flex gap-2">
          <ShareButton listId={listId} />
          <Link to={`/${listId}/admin/configuracion`}>
            <Button variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/${listId}/admin/anadir`}>
            <Button>Anadir producto</Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.key}
            active={filter === item.key}
            icon={item.icon}
            label={item.label}
            value={item.value}
            onClick={total > 0 ? () => setFilter(item.key === filter ? 'all' : item.key) : undefined}
          />
        ))}
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {loading ? (
          <p className="col-span-full py-10 text-center text-sm text-fg-secondary">
            Cargando...
          </p>
        ) : gifts.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-fg-secondary">
            No hay productos en la lista. Anade tu primer producto.
          </p>
        ) : filteredGifts.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-fg-secondary">
            No hay productos con ese estado.
          </p>
        ) : (
          filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-stroke-default bg-canvas-surface"
            >
              <Link
                className="flex flex-1 flex-col transition-shadow hover:shadow-md"
                to={`/${listId}/admin/editar/${gift.id}`}
              >
                {gift.imageUrl ? (
                  <img
                    alt={gift.name}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    src={gift.imageUrl}
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-canvas-surface-hover" />
                )}
                <div className="flex flex-col gap-2 p-3 md:p-4">
                  <h3 className="font-serif text-base text-fg-primary md:text-lg">{gift.name}</h3>
                  {gift.size || gift.color ? (
                    <p className="text-xs text-fg-secondary">
                      {[gift.size, gift.color].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  <StatusBadge variant={gift.status} name={gift.reservedBy} />
                </div>
              </Link>
              <div className="flex gap-2 border-t border-stroke-default px-3 py-2 md:px-4">
                <Link
                  className="inline-flex items-center justify-center rounded-lg p-2 text-fg-secondary transition-colors hover:bg-canvas-surface-hover hover:text-accent-primary"
                  to={`/${listId}/admin/editar/${gift.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  className="inline-flex items-center justify-center rounded-lg p-2 text-fg-secondary transition-colors hover:bg-canvas-surface-hover hover:text-accent-primary disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={gift.status === 'pending' || reopenMutation.isPending || markBoughtMutation.isPending}
                  onClick={() => setConfirmAction({ type: 'reopen', giftId: gift.id! })}
                  title="Reabrir regalo"
                  type="button"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-lg p-2 text-fg-secondary transition-colors hover:bg-canvas-surface-hover hover:text-status-bought disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={gift.status === 'bought' || markBoughtMutation.isPending || reopenMutation.isPending}
                  onClick={() => setConfirmAction({ type: 'markBought', giftId: gift.id! })}
                  title="Marcar como comprado"
                  type="button"
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <ConfirmDialog
        confirmLabel="Si, reabrir regalo"
        message="El regalo volvera a estar disponible para que cualquier visitante pueda reservarlo."
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction) reopenMutation.mutate(confirmAction.giftId)
          setConfirmAction(null)
        }}
        open={confirmAction?.type === 'reopen'}
        pending={reopenMutation.isPending}
        title="Reabrir regalo?"
      />

      <ConfirmDialog
        confirmLabel="Si, marcar como comprado"
        message="El regalo se marcara como comprado. Esta accion no se puede deshacer desde la web."
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction) markBoughtMutation.mutate(confirmAction.giftId)
          setConfirmAction(null)
        }}
        open={confirmAction?.type === 'markBought'}
        pending={markBoughtMutation.isPending}
        title="Marcar como comprado?"
      />
    </PageShell>
  )
}
