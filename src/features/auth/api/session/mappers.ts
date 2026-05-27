import type { User } from 'firebase/auth'

import type { AuthUser } from '../../types/auth-type'

export function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
  }
}
