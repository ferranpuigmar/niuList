import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

import { Button } from '../../../app/shared/components/button'
import { copyShareUrl } from '../api/sharing/service'

type ShareButtonProps = {
  listId: string
}

export function ShareButton({ listId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyShareUrl(listId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Button onClick={handleCopy} variant="outline">
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Enlace copiado
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Compartir
        </>
      )}
    </Button>
  )
}
