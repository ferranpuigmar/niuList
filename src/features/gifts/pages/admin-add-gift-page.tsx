import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getFunctions } from 'firebase/functions'
import { ImageUp, Loader2, Pencil, Scan, X } from 'lucide-react'

import { Button } from '../../../app/shared/components/button'
import { FormField } from '../../../app/shared/components/form-field'
import { PageShell } from '../../../app/shared/components/page-shell'
import { giftSchema, type GiftValues } from '../schemas/gift-schemas'
import { useCreateGift } from '../hooks/use-create-gift'

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

export default function AdminAddGiftPage() {
  const params = useParams()
  const listId = params.listId ?? ''
  const navigate = useNavigate()

  const createMutation = useCreateGift()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)

  const form = useForm<GiftValues>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: '',
      price: 0,
      purchaseUrl: '',
      description: '',
      size: '',
      color: '',
    },
  })

  const { register, handleSubmit, formState, setValue, getValues } = form

  const handleExtract = async () => {
    const purchaseUrl = getValues('purchaseUrl')
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
    await createMutation.mutateAsync({
      ...values,
      listId,
      imageFile: imageFile ?? undefined,
    })
    navigate(`/${listId}/admin`)
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
        <h1 className="font-serif text-4xl">Anadir producto</h1>
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
                {imagePreview ? (
                  <div className="group relative">
                    <img
                      alt="Preview"
                      className="h-32 w-full rounded-lg object-cover"
                      src={imagePreview}
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
                placeholder="Ej: Cuna colecho"
                error={formState.errors.name?.message}
                {...register('name')}
              />

              <FormField
                label="Descripcion"
                multiline
                placeholder="Descripcion del producto"
                {...register('description')}
              />
            </div>

            <div className="space-y-4">
              <FormField
                label="Precio"
                type="number"
                placeholder="0"
                error={formState.errors.price?.message}
                {...register('price', { valueAsNumber: true })}
              />

              <FormField
                label="Talla"
                placeholder="Ej: 6 meses"
                {...register('size')}
              />

              <FormField
                label="Color"
                placeholder="Ej: Rosa"
                {...register('color')}
              />
            </div>
          </div>

          {createMutation.isError ? (
            <p className="font-body text-xs text-error">
              Error al crear el producto. Intentalo de nuevo.
            </p>
          ) : null}

          <Button
            disabled={createMutation.isPending}
            fullWidth
            type="submit"
          >
            {createMutation.isPending ? 'Anadiendo...' : 'Anadir producto'}
          </Button>
        </form>
      </div>
    </PageShell>
  )
}
