import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateListById } from '../api/lists/service'
import type { UpdateListValues } from '../schemas/list-schemas'

export function useUpdateList(listId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateListValues) => updateListById(listId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', listId] })
    },
  })
}
