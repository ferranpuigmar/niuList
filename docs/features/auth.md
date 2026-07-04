# Feature: auth

Gestiona la **sesión de los administradores**: login, logout, creación de cuentas, cambio de contraseña y el estado global de autenticación. Los visitantes NO pasan por aquí (son anónimos; ver [reservations](reservations.md)).

## Archivos

```
src/features/auth/
├── api/
│   ├── index.ts
│   └── session/
│       ├── service.ts       # login, logout, createAuthUser, changePassword
│       └── mappers.ts       # mapFirebaseUser: User de Firebase → AuthUser propio
├── hooks/
│   ├── auth-initializer.tsx # Componente sin UI montado en AppProviders
│   ├── use-auth.ts          # useAuthObserver (onAuthStateChanged → store)
│   ├── use-login.ts         # useLoginMutation
│   └── use-change-password.ts
├── schemas/
│   └── auth-schemas.ts      # zod del form de login
├── store/
│   └── auth-store.ts        # Zustand: user, listId, loading
└── types/
    └── auth-type.ts         # AuthUser
```

## El store (única fuente de verdad de sesión)

`auth-store.ts` es el **único store Zustand del proyecto**:

| Campo | Qué es |
|---|---|
| `user` | `AuthUser \| null` — el admin logueado (mapeado, no el objeto crudo de Firebase) |
| `listId` | La lista "activa" del admin (resuelta al arrancar o al hacer login) |
| `loading` | `true` hasta que Firebase resuelve si hay sesión persistida. Las guardas esperan a que sea `false` |

Cualquier componente lee sesión así: `useAuthStore((s) => s.user)`. Hay selectores exportados (`selectAuthUser`, etc.).

## Hooks

| Hook | Qué hace | Quién lo usa |
|---|---|---|
| `useAuthObserver` | Se suscribe a `onAuthStateChanged` y sincroniza el store | `AuthInitializer` |
| `useLoginMutation` | Login → resuelve `listId` → navega a `/{listId}/admin`. Falla si la cuenta no tiene listas | LoginPage |
| `useChangePassword` | Reautentica con la contraseña actual y cambia a la nueva | AdminSettingsPage |

## Servicios (`api/session/service.ts`)

Wrappers finos sobre `firebase/auth`:

- `login` / `logout` — sign in/out estándar.
- `createAuthUser` — `createUserWithEmailAndPassword`. ⚠️ **Cambia la sesión activa del navegador al usuario creado.** Solo se usa en el flujo de crear lista (donde el creador ES el nuevo usuario). Para crear cuentas de terceros (co-admins) se usa la Cloud Function `addCoAdmin` — ver [sharing](sharing.md).
- `changePassword` — Firebase exige reautenticación reciente para cambiar contraseña, por eso pide la actual.

## Flujos donde participa

- [Arranque y sesión](../04-flujos.md#1-arranque-de-la-app-y-sesión)
- [Login](../04-flujos.md#3-login-login)
- [Guardas de ruta](../04-flujos.md#4-guardas-de-ruta) (la guarda lee este store)
- [Crear lista](../04-flujos.md#2-crear-una-lista-crear) (creación de la cuenta del admin)
