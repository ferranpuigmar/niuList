import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import { db } from '../../../lib/firebase'
import { mapGiftSnapshot } from '../api/gifts/mappers'
import type { Gift } from '../types/gift-type'

export function useGifts(listId: string) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!listId) return

    const giftsQuery = query(
      collection(db, 'lists', listId, 'gifts'),
      orderBy('createdAt', 'desc'),
    )

    const unsubscribe = onSnapshot(
      giftsQuery,
      (snapshot) => {
        const result = snapshot.docs.map(mapGiftSnapshot)
        setGifts(result)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [listId])

  return { gifts, loading, error }
}
