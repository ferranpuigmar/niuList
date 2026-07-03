import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, RotateCcw, ShieldAlert, ShoppingBag } from 'lucide-react'

import { Button } from '../../../app/shared/components/button'
import { ConfirmDialog } from '../../../app/shared/components/confirm-dialog'
import { FormField } from '../../../app/shared/components/form-field'
import { StatusBadge } from '../../../app/shared/components/status-badge'
import { PageShell } from '../../../app/shared/components/page-shell'
import { useAuthStore } from '../../auth/store/auth-store'
import { useGift } from '../hooks/use-gift'
import { useReserveGift } from '../../reservations/hooks/use-reserve-gift'
import { useCancelReservation } from '../../reservations/hooks/use-cancel-reservation'
import { useMarkBought } from '../../reservations/hooks/use-mark-bought'
import { useAdminMarkBought } from '../../reservations/hooks/use-admin-mark-bought'
import { useReopenGift } from '../../reservations/hooks/use-reopen-gift'
import { useVisitor } from '../../reservations/hooks/use-visitor'
import { formatPrice } from '../../../app/shared/utils/format-price'
import {
  reserveGiftSchema,
  type ReserveGiftValues,
} from '../../reservations/schemas/reservation-schemas'

export default function GiftDetailPage() {
  const params = useParams()
  const listId = params.listId ?? ''
  const giftId = params.giftId ?? ''

  const authUser = useAuthStore((s) => s.user)
  const isAdmin = !!authUser

  const { visitorToken, visitorTokenHash, setVisitorName } = useVisitor()

  const { gift, loading } = useGift(listId, giftId)
  const reserveMutation = useReserveGift(listId)
  const cancelMutation = useCancelReservation(listId)
  const markBoughtMutation = useMarkBought(listId)
  const adminMarkBoughtMutation = useAdminMarkBought(listId)
  const reopenMutation = useReopenGift(listId)
  const [confirmAction, setConfirmAction] = useState<'reopen' | 'markBought' | null>(null)

  const form = useForm<ReserveGiftValues>({
    resolver: zodResolver(reserveGiftSchema),
    defaultValues: { visitorName: '' },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const handleReserve = async (values: ReserveGiftValues) => {
    await reserveMutation.mutateAsync({ giftId, visitorName: values.visitorName, visitorToken })
    setVisitorName(values.visitorName)
  }

  const handleCancel = async () => {
    await cancelMutation.mutateAsync({ giftId, visitorToken })
  }

  const handleMarkBought = async () => {
    await markBoughtMutation.mutateAsync({ giftId, visitorToken })
  }

  if (loading) {
    return (
      <PageShell className="py-10 text-center text-sm text-fg-secondary">
        Cargando...
      </PageShell>
    )
  }

  if (!gift) {
    return (
      <PageShell className="py-10 text-center text-sm text-fg-secondary">
        Regalo no encontrado
      </PageShell>
    )
  }

  const isMyReservation =
    gift.status === 'reserved' &&
    !!visitorTokenHash &&
    gift.reservedByTokenHash === visitorTokenHash
  const isReservedByOther = gift.status === 'reserved' && !isMyReservation

  return (
    <PageShell className="space-y-5">
      <Link
        className="text-sm font-medium text-accent-primary hover:underline"
        to={`/${listId}`}
      >
        Volver a la lista
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {gift.imageUrl ? (
            <img
              alt={gift.name}
              className="h-64 w-full rounded-2xl object-cover md:h-[420px]"
              src={gift.imageUrl}
            />
          ) : (
            <div className="h-64 rounded-2xl bg-canvas-surface-hover md:h-[420px]" />
          )}
          <StatusBadge variant={gift.status} />
          <h1 className="font-serif text-4xl">{gift.name}</h1>
          <p className="font-body text-lg font-semibold">{formatPrice(gift.price)}</p>
          {gift.description ? (
            <p className="text-sm text-fg-secondary">{gift.description}</p>
          ) : null}
        </div>

        <div className="space-y-4">
          {gift.size || gift.color ? (
            <div className="flex flex-wrap gap-2">
              {gift.size ? (
                <span className="rounded-full border border-stroke-default px-3 py-1 text-xs text-fg-secondary">
                  Talla: {gift.size}
                </span>
              ) : null}
              {gift.color ? (
                <span className="rounded-full border border-stroke-default px-3 py-1 text-xs text-fg-secondary">
                  Color: {gift.color}
                </span>
              ) : null}
            </div>
          ) : null}

          {gift.purchaseUrl ? (
            <a
              className="inline-flex items-center gap-2 rounded-lg border border-stroke-default px-4 py-2 text-sm font-medium text-accent-primary transition-colors hover:bg-canvas-surface-hover"
              href={gift.purchaseUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Ir a comprar
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}

          {gift.status === 'pending' ? (
            <div className="space-y-3 rounded-2xl border border-stroke-default bg-accent-light p-5">
              <h2 className="font-body font-semibold">Quieres regalar esto?</h2>
              <form className="space-y-3" onSubmit={handleSubmit(handleReserve)}>
                <FormField
                  label="Tu nombre"
                  placeholder="Tu nombre"
                  error={errors.visitorName?.message}
                  {...register('visitorName')}
                />
                {reserveMutation.isError ? (
                  <p className="font-body text-xs text-error">
                    Error al reservar. Intentalo de nuevo.
                  </p>
                ) : null}
                <Button
                  disabled={reserveMutation.isPending}
                  fullWidth
                  type="submit"
                >
                  {reserveMutation.isPending ? 'Reservando...' : 'Reservar este regalo'}
                </Button>
              </form>
            </div>
          ) : null}

          {isMyReservation ? (
            <div className="space-y-3 rounded-2xl border border-status-bought bg-status-bought-light p-5">
              <h2 className="font-body font-semibold">Regalo reservado!</h2>
              <p className="text-sm text-fg-secondary">
                Reservado por {gift.reservedBy}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  disabled={markBoughtMutation.isPending}
                  variant="outline"
                  onClick={handleMarkBought}
                >
                  {markBoughtMutation.isPending ? 'Confirmando...' : 'Ya lo he comprado'}
                </Button>
                <Button
                  disabled={cancelMutation.isPending}
                  variant="ghost"
                  onClick={handleCancel}
                >
                  {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar reserva'}
                </Button>
              </div>
            </div>
          ) : null}

          {isReservedByOther ? (
            <div className="space-y-2 rounded-2xl border border-stroke-default bg-status-reserved-light p-5">
              <p className="font-body text-sm font-medium">
                Reservado por {gift.reservedBy}
              </p>
              <p className="text-xs text-fg-secondary">
                Este regalo ya esta reservado
              </p>
            </div>
          ) : null}

          {gift.status === 'bought' ? (
            <div className="space-y-3 rounded-2xl border border-status-bought bg-status-bought-light p-5">
              <p className="font-serif text-2xl">
                Gracias, {gift.reservedBy ?? ''}!
              </p>
              <p className="text-sm text-fg-secondary">
                Gracias por tu generosidad. Este regalo ya ha sido comprado.
              </p>
              <Link to={`/${listId}`}>
                <Button fullWidth variant="outline">
                  Volver a la lista
                </Button>
              </Link>
            </div>
          ) : null}

          {isAdmin ? (
            <div className="space-y-3 rounded-2xl border border-stroke-default bg-canvas-surface-hover p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <ShieldAlert className="h-4 w-4" />
                Administrar
              </div>
              <Button
                disabled={gift.status === 'pending' || reopenMutation.isPending || adminMarkBoughtMutation.isPending}
                fullWidth
                variant="outline"
                onClick={() => setConfirmAction('reopen')}
              >
                <RotateCcw className="h-4 w-4" />
                Reabrir regalo
              </Button>
              <Button
                disabled={gift.status === 'bought' || adminMarkBoughtMutation.isPending || reopenMutation.isPending}
                fullWidth
                variant="outline"
                onClick={() => setConfirmAction('markBought')}
              >
                <ShoppingBag className="h-4 w-4" />
                Marcar como comprado
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Si, reabrir regalo"
        message="El regalo volvera a estar disponible para que cualquier visitante pueda reservarlo."
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          reopenMutation.mutate(giftId)
          setConfirmAction(null)
        }}
        open={confirmAction === 'reopen'}
        pending={reopenMutation.isPending}
        title="Reabrir regalo?"
      />

      <ConfirmDialog
        confirmLabel="Si, marcar como comprado"
        message="El regalo se marcara como comprado. Esta accion no se puede deshacer desde la web."
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          adminMarkBoughtMutation.mutate(giftId)
          setConfirmAction(null)
        }}
        open={confirmAction === 'markBought'}
        pending={adminMarkBoughtMutation.isPending}
        title="Marcar como comprado?"
      />
    </PageShell>
  )
}
