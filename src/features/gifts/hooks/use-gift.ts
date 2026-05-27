import { useGifts } from './use-gifts'

export function useGift(listId: string, giftId: string) {
  const { gifts, loading, error } = useGifts(listId)
  const gift = gifts.find((g) => g.id === giftId) ?? null
  return { gift, loading, error }
}
