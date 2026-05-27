import { Link, Navigate } from 'react-router-dom'
import { Heart, ShieldCheck, Share2, Sparkles, GiftIcon } from 'lucide-react'

import { ROUTES } from '../../routes'
import { Button } from '../../shared/components/button'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { Text } from '../../shared/components/text/text'

const features = [
  { icon: ShieldCheck, label: 'Sin duplicados' },
  { icon: Share2, label: 'Fácil de compartir' },
  { icon: Heart, label: 'Bonita y sencilla' },
]

export default function LandingPage() {
  const listId = useAuthStore((s) => s.listId)

  if (listId) return <Navigate replace to={`/${listId}/admin/configuracion`} />

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 pb-15 md:px-16">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <GiftIcon className="size-20 text-accent-primary" />
          <Text asChild variant="display-xl" className="text-center">
             <h1>La lista de regalos <br />
             para tu bebé</h1>
          </Text>
          <Text variant="subtitle-1" color='secondary' className="max-w-[700px] text-center pt-3">
            <span className='inline-block pb-2'>Crea una lista bonita y sencilla para compartir con familia y amigos.</span>
            <span className='inline-block pb-2'>Sin duplicados, sin estrés. Cada regalo se reserva antes de comprarse.</span>
          </Text>
        </div>

        <Link to={ROUTES.createList}>
          <Button size="lg">
            <Sparkles className="h-[18px] w-[18px]" />
            Crear mi lista gratis
          </Button>
        </Link>

        <div className="flex items-center gap-12">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-[18px] w-[18px] text-accent-primary" />
              <Text asChild variant="body-1" color="secondary">
                <span>{label}</span>
              </Text>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
