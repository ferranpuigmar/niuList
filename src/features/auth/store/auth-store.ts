import { create } from 'zustand'

import { withDevtools } from '../../../lib/zustand'
import type { AuthUser } from '../types/auth-type'

type AuthState = {
  user: AuthUser | null
  listId: string | null
  loading: boolean
  setUser: (user: AuthUser | null) => void
  setListId: (listId: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  withDevtools('auth-store', (set) => ({
    user: null,
    listId: null,
    loading: true,
    setUser: (user) => set({ user }),
    setListId: (listId) => set({ listId }),
    setLoading: (loading) => set({ loading }),
  })),
)

export const selectAuthUser = (state: AuthState) => state.user
export const selectAuthListId = (state: AuthState) => state.listId
export const selectAuthLoading = (state: AuthState) => state.loading
