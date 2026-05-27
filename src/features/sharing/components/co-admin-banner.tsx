import { Users } from 'lucide-react'

type CoAdminBannerProps = {
  adminCount: number
}

export function CoAdminBanner({ adminCount }: CoAdminBannerProps) {
  if (adminCount <= 1) return null

  return (
    <div className="flex items-center gap-2 rounded-xl border border-accent-light bg-accent-light px-4 py-2.5">
      <Users className="h-4 w-4 shrink-0 text-accent-primary" />
      <p className="font-body text-xs text-fg-secondary">
        Esta lista tiene {adminCount} administradores. Tanto el creador como el co-admin pueden
        gestionar los regalos.
      </p>
    </div>
  )
}
