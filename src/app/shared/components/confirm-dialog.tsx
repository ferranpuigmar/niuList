import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { Button } from './button'

type ConfirmDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  pending?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  pending,
}: ConfirmDialogProps) {
  return (
    <Dialog className="relative z-50" onClose={onClose} open={open}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md space-y-4 rounded-2xl border border-stroke-default bg-canvas-surface p-6 shadow-xl">
          <DialogTitle className="font-serif text-2xl">{title}</DialogTitle>
          <p className="font-body text-sm text-fg-secondary">{message}</p>
          <div className="flex gap-2">
            <Button disabled={pending} onClick={onConfirm}>
              {pending ? `${confirmLabel}...` : confirmLabel}
            </Button>
            <Button disabled={pending} onClick={onClose} variant="ghost">
              Cancelar
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
