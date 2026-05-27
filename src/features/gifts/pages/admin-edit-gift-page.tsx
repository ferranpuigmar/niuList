import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getFunctions } from 'firebase/functions'
import { ImageUp, Loader2, Pencil, RotateCcw, Scan, ShoppingBag, Trash2, X } from 'lucide-react'

import { Button } from '../../../app/shared/components/button'
import { ConfirmDialog } from '../../../app/shared/components/confirm-dialog'
import { FormField } from '../../../app/shared/components/form-field'
import { PageShell } from '../../../app/shared/components/page-shell'
import { useGifts } from '../hooks/use-gifts'
import { useUpdateGift } from '../hooks/use-update-gift'
import { useDeleteGift } from '../hooks/use-delete-gift'
import { useMarkBought } from '../../reservations/hooks/use-mark-bought'
import { useReopenGift } from '../../reservations/hooks/use-reopen-gift'
import { giftSchema, type GiftValues } from '../schemas/gift-schemas'

type Metadata = {
  title: string | null
  description: string | null
  imageDataUrl: string | null
}

async function dataUrlToFile(dataUrl: string): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], 'product-image.jpg', { type: blob.type })
}

export default function AdminEditGiftPage() {
  const params = useParams()
  const listId = params.listId ?? ''
  const giftId = params.giftId ?? ''
  const navigate = useNavigate()

  const { gifts, loading } = useGifts(listId)
  const updateMutation = useUpdateGift()
  const deleteMutation = useDeleteGift()
  const markBoughtMutation = useMarkBought(listId)
  const reopenMutation = useReopenGift(listId)

  const gift = gifts.find((g) => g.id === giftId)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'reopen' | 'markBought' | null>(null)

  const form = useForm<GiftValues>({
    resolver: zodResolver(giftSchema),
    values: {
      name: gift?.name ?? '',
      price: gift?.price ?? 0,
      purchaseUrl: gift?.purchaseUrl ?? '',
      description: gift?.description ?? '',
      size: gift?.size ?? '',
      color: gift?.color ?? '',
    },
  })

  const { register, handleSubmit, formState, setValue } = form

  const handleExtract = async () => {
    const purchaseUrl = form.getValues('purchaseUrl')
    if (!purchaseUrl || !purchaseUrl.startsWith('http')) return

    setExtracting(true)
    try {
      const functions = getFunctions()
      const region = functions.region || 'us-central1'
      const response = await fetch(
        `https://${region}-lista-bebes.cloudfunctions.net/extractUrlMetadata`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: purchaseUrl }),
        },
      )
      const metadata: Metadata = await response.json()

      if (metadata.title) {
        setValue('name', metadata.title)
      }
      if (metadata.description) {
        setValue('description', metadata.description)
      }
      if (metadata.imageDataUrl && !imageFile) {
        const file = await dataUrlToFile(metadata.imageDataUrl)
        setImageFile(file)
        setImagePreview(metadata.imageDataUrl)
      }
    } catch {
      // ignore
    }
    setExtracting(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const onSubmit = async (values: GiftValues) => {
    await updateMutation.mutateAsync({
      ...values,
      listId,
      giftId,
      imageFile: imageFile ?? undefined,
    })
    navigate(`/${listId}/admin`)
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ listId, giftId })
    navigate(`/${listId}/admin`)
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
        Producto no encontrado
      </PageShell>
    )
  }

  return (
    <PageShell className="space-y-6">
      <Link
        className="text-sm font-medium text-accent-primary hover:underline"
        to={`/${listId}/admin`}
      >
        Volver a la lista
      </Link>

      <div className="w-full rounded-2xl border border-stroke-default bg-canvas-surface p-6">
        <h1 className="font-serif text-4xl">Editar producto</h1>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-end gap-3">
            <FormField
              className="flex-1"
              label="URL de compra"
              type="url"
              placeholder="https://..."
              error={formState.errors.purchaseUrl?.message}
              {...register('purchaseUrl')}
            />
            <Button
              type="button"
              variant="outline"
              disabled={extracting}
              onClick={handleExtract}
            >
              {extracting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Scan className="h-4 w-4" />
              )}
              Extraer datos
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-fg-primary md:text-sm">
                  Imagen
                </label>
                {(imagePreview || gift.imageUrl) ? (
                  <div className="group relative">
                    <img
                      alt="Preview"
                      className="h-32 w-full rounded-lg object-cover"
                      src={imagePreview ?? gift.imageUrl}
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/0 transition-colors group-hover:bg-black/30">
                      <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity group-hover:opacity-100">
                        <Pencil className="h-5 w-5 text-fg-primary" />
                        <input
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                          type="file"
                        />
                      </label>
                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity group-hover:opacity-100"
                        onClick={() => {
                          setImagePreview(null)
                          setImageFile(null)
                        }}
                        type="button"
                      >
                        <X className="h-5 w-5 text-error" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-stroke-default px-3.5 py-8 transition-colors hover:bg-canvas-surface-hover">
                    <ImageUp className="h-5 w-5 text-fg-secondary" />
                    <span className="text-sm text-fg-secondary">Subir imagen</span>
                    <input
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                      type="file"
                    />
                  </label>
                )}
              </div>

              <FormField
                label="Nombre del producto"
                error={formState.errors.name?.message}
                {...register('name')}
              />

              <FormField
                label="Descripcion"
                multiline
                {...register('description')}
              />
            </div>

            <div className="space-y-4">
              <FormField
                label="Precio"
                type="number"
                error={formState.errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />

              <FormField
                label="Talla"
                {...register('size')}
              />

              <FormField
                label="Color"
                {...register('color')}
              />
            </div>
          </div>

          {updateMutation.isError ? (
            <p className="font-body text-xs text-error">
              Error al guardar los cambios. Intentalo de nuevo.
            </p>
          ) : null}

          {gift ? (
            <div className="flex gap-2">
              <Button
                disabled={gift.status === 'pending' || reopenMutation.isPending || markBoughtMutation.isPending}
                fullWidth
                variant="outline"
                onClick={() => setConfirmAction('reopen')}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                Reabrir regalo
              </Button>
              <Button
                disabled={gift.status === 'bought' || markBoughtMutation.isPending || reopenMutation.isPending}
                fullWidth
                variant="outline"
                onClick={() => setConfirmAction('markBought')}
                type="button"
              >
                <ShoppingBag className="h-4 w-4" />
                Marcar como comprado
              </Button>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Button
              disabled={updateMutation.isPending}
              type="submit"
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Button
              disabled={deleteMutation.isPending}
              variant="outline"
              onClick={handleDelete}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar producto'}
            </Button>
          </div>
        </form>
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
          markBoughtMutation.mutate(giftId)
          setConfirmAction(null)
        }}
        open={confirmAction === 'markBought'}
        pending={markBoughtMutation.isPending}
        title="Marcar como comprado?"
      />
    </PageShell>
  )
}
