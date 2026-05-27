export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code

    const messages: Record<string, string> = {
      'auth/user-not-found': 'No hay ninguna cuenta con este email',
      'auth/wrong-password': 'Contrasena incorrecta',
      'auth/invalid-credential': 'Email o contrasena incorrectos',
      'auth/email-already-in-use': 'Este email ya esta registrado',
      'auth/weak-password': 'La contrasena debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Introduce un email valido',
      'auth/too-many-requests': 'Demasiados intentos. Intentalo mas tarde',
      'auth/network-request-failed': 'Error de conexion. Comprueba tu red',
      'auth/requires-recent-login': 'Inicia sesion de nuevo e intentalo',
    }

    return messages[code] ?? error.message
  }

  return 'Ha ocurrido un error inesperado'
}
