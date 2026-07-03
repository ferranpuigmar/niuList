import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import { db } from '../../../lib/firebase'
import { mapGiftDoc } from '../api/gifts/mappers'
import type { Gift } from '../types/gift-type'

export function useGift(listId: string, giftId: string) {
  const [gift, setGift] = useState<Gift | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!listId || !giftId) return

    const giftRef = doc(db, 'lists', listId, 'gifts', giftId)

    const unsubscribe = onSnapshot(
      giftRef,
      (snapshot) => {
        const data = snapshot.data()
        setGift(data ? mapGiftDoc(snapshot.id, data) : null)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [listId, giftId])

  return { gift, loading, error }
}
