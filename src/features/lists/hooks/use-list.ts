import { useQuery } from '@tanstack/react-query'

import { getListById } from '../api/lists/service'
import { mapListSnapshot } from '../api/lists/mappers'

export function useList(listId: string) {
  return useQuery({
    queryKey: ['list', listId],
    queryFn: async () => {
      const snap = await getListById(listId)
      if (!snap.exists()) {
        throw new Error('Lista no encontrada')
      }
      return mapListSnapshot(snap)
    },
    enabled: !!listId,
  })
}
