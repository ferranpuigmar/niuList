import { useMutation } from '@tanstack/react-query'

import { changePassword } from '../api/session/service'

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePassword(currentPassword, newPassword),
  })
}
