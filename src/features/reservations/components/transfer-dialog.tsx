import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Check, Copy, Share2, TriangleAlert } from 'lucide-react'

import { Button } from '../../../app/shared/components/button'
import { getTransferUrl } from '../api/reservations/transfer'

type TransferDialogProps = {
  open: boolean
  onClose: () => void
  visitorToken: string
  listId: string
}

export function TransferDialog({ open, onClose, visitorToken, listId }: TransferDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const transferUrl = getTransferUrl(visitorToken, listId)

  useEffect(() => {
    if (!open) return
    let active = true
    import('qrcode')
      .then((QRCode) => QRCode.toDataURL(transferUrl, { width: 240, margin: 1 }))
      .then((url) => {
        if (active) setQrDataUrl(url)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [open, transferUrl])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transferUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const canShare = typeof navigator.share === 'function'

  const handleShare = async () => {
    try {
      await navigator.share({ title: 'Mis reservas', url: transferUrl })
    } catch {
      // el usuario cerró la hoja de compartir
    }
  }

  return (
    <Dialog className="relative z-50" onClose={onClose} open={open}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md space-y-4 rounded-2xl border border-stroke-default bg-canvas-surface p-6 shadow-xl">
          <DialogTitle className="font-serif text-2xl">Usar en otro dispositivo</DialogTitle>
          <p className="font-body text-sm text-fg-secondary">
            Escanea este código (o copia el enlace) desde tu otro dispositivo para poder
            gestionar tus reservas también desde allí.
          </p>

          <div className="flex justify-center">
            {qrDataUrl ? (
              <img
                alt="Código QR para transferir tus reservas"
                className="h-60 w-60 rounded-xl border border-stroke-default"
                src={qrDataUrl}
              />
            ) : (
              <div className="h-60 w-60 animate-pulse rounded-xl bg-canvas-surface-hover" />
            )}
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-accent-light p-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
            <p className="font-body text-xs text-fg-secondary">
              Este enlace da acceso a gestionar tus reservas. No lo compartas con nadie:
              guárdalo solo para ti (por ejemplo, enviándotelo a tu propio correo).
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleCopy} variant="outline">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Enlace copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar enlace
                </>
              )}
            </Button>
            {canShare ? (
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4" />
                Compartir...
              </Button>
            ) : null}
            <Button onClick={onClose} variant="ghost">
              Cerrar
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
