import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../../../lib/firebase'
import { mapFirebaseUser } from '../api/session/mappers'
import { useAuthStore } from '../store/auth-store'

export function useAuthObserver() {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? mapFirebaseUser(user) : null)
      setLoading(false)
    })
    return unsubscribe
  }, [setUser, setLoading])
}
