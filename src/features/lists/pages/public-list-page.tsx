import { useNavigate, useParams } from 'react-router-dom'

import { PageShell } from '../../../app/shared/components/page-shell'
import { GiftCard } from '../../gifts/components/gift-card'
import { CoAdminBanner } from '../../sharing/components/co-admin-banner'
import { useVisitor } from '../../reservations/hooks/use-visitor'
import { useList } from '../hooks/use-list'
import { useGifts } from '../../gifts/hooks/use-gifts'

export default function PublicListPage() {
  const navigate = useNavigate()
  const params = useParams()
  const listId = params.listId ?? ''
  const { visitorToken } = useVisitor()

  const { data: list, isLoading: listLoading } = useList(listId)
  const { gifts, loading: giftsLoading } = useGifts(listId)

  const total = gifts.length
  const bought = gifts.filter((g) => g.status === 'bought').length
  const percentage = total > 0 ? Math.round((bought / total) * 100) : 0

  if (listLoading || giftsLoading) {
    return (
      <PageShell className="py-10 text-center text-sm text-fg-secondary">
        Cargando...
      </PageShell>
    )
  }

  return (
    <PageShell className="space-y-6">
      <CoAdminBanner adminCount={list?.adminIds?.length ?? 0} />

      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">
            Lista de {list?.babyName}
            {list?.emoji ? ` ${list.emoji}` : null}
          </h1>
          {list?.welcomeMessage ? (
            <p className="mt-2 text-sm text-fg-secondary">{list.welcomeMessage}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-fg-secondary">
            {bought} de {total} regalos
          </p>
          <p className="font-body text-sm font-semibold text-accent-primary">
            {percentage}%
          </p>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-canvas-surface-hover">
          <div
            className="h-full rounded-full bg-accent-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {gifts.length === 0 ? (
        <p className="py-10 text-center text-sm text-fg-secondary">
          No hay productos en la lista.
        </p>
      ) : (
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gifts.map((gift) => (
            <GiftCard
              gift={gift}
              key={gift.id}
              visitorToken={visitorToken}
              onClick={() => navigate(`/${listId}/regalo/${gift.id}`)}
            />
          ))}
        </section>
      )}
    </PageShell>
  )
}
