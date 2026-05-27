import type { StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

export const withDevtools = <T>(name: string, creator: StateCreator<T>) =>
  devtools(creator, { name })
