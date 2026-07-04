# 02 · Estructura del proyecto

## Raíz del repo

```
lista_bebes/
├── src/                    # Frontend (React + Vite)
├── functions/              # Cloud Functions (paquete npm independiente)
├── docs/                   # Esta documentación
├── public/                 # Assets estáticos de Vite
├── dist/                   # Build del frontend (generado, gitignored)
├── firebase.json           # Config de Firebase CLI (qué desplegar y desde dónde)
├── .firebaserc             # Proyecto Firebase activo (lista-bebes)
├── firestore.rules         # Security Rules de Firestore
├── firestore.indexes.json  # Índices compuestos (vacío por ahora)
├── storage.rules           # Security Rules de Cloud Storage
├── .env                    # Credenciales VITE_FIREBASE_* (NO versionado)
├── eslint.config.js        # ESLint del frontend (ignora dist/ y functions/)
├── tsconfig.json           # Raíz por referencias → tsconfig.app.json + tsconfig.node.json
└── vite.config.ts
```

Cosas a saber:

- **Hay dos paquetes npm**: la raíz (frontend) y `functions/` (backend). Cada uno con su `package.json`, su `tsconfig` y su `eslint.config.js`. Los dos configs de ESLint fijan `tsconfigRootDir` para no pisarse.
- **`.env` no está en git**. Pide las credenciales al equipo. Las claves `VITE_FIREBASE_*` de un frontend Firebase son públicas por diseño (van en el bundle); la seguridad real la dan las rules.

## `src/` — frontend (feature-sliced)

El código se organiza por **features de dominio** (`src/features/`) más una capa de **app/infraestructura** (`src/app/`, `src/lib/`).

```
src/
├── main.tsx                # Entry point → monta <App/>
├── App.tsx                 # AppProviders + RouterProvider
├── lib/                    # Singletons de infraestructura
│   ├── firebase.ts         #   init de Firebase → exporta auth, db, storage, functions
│   ├── query-client.ts     #   QueryClient de TanStack Query (staleTime 30s, retry 1)
│   └── zustand.ts          #   helper withDevtools para stores
│
├── app/                    # Todo lo que NO es de un dominio concreto
│   ├── router.tsx          # createBrowserRouter: layouts + rutas + Suspense
│   ├── routes.ts           # Constantes de rutas (ROUTES)
│   ├── pages.ts            # lazy() imports de todas las páginas (code-splitting)
│   ├── providers.tsx       # QueryClientProvider + AuthInitializer
│   ├── pages/public/       # Páginas sin dominio: landing, login, crear lista
│   └── shared/
│       ├── components/     # UI genérica: Button, FormField, Input, Card, Text,
│       │                   # ConfirmDialog, StatusBadge, AppHeader, PageShell...
│       ├── hooks/          # use-autofill-sync, use-click-outside, use-mobile
│       ├── layouts/        # PublicLayout, AdminLayout, AuthGuard
│       └── utils/          # cn (clsx+twMerge), format-price, firebase-errors,
│                           # normalize-name
│
└── features/               # Un directorio por dominio
    ├── auth/
    ├── lists/
    ├── gifts/
    ├── reservations/
    └── sharing/
```

### Anatomía estándar de una feature

Todas las features siguen la misma estructura interna (no todas tienen todas las carpetas):

```
features/<nombre>/
├── api/          # Acceso a Firebase: servicios (llamadas) y mappers (doc → tipo TS)
├── hooks/        # Hooks de React: mutaciones (TanStack Query) y suscripciones (onSnapshot)
├── pages/        # Páginas completas montadas en el router
├── components/   # Componentes propios de la feature
├── schemas/      # Schemas zod para formularios
├── types/        # Tipos TypeScript del dominio
└── store/        # Store Zustand (solo existe en auth)
```

Regla de dependencia práctica: **páginas → hooks → api → `src/lib/firebase.ts`**. Los componentes de UI genérica viven en `src/app/shared/components/`.

Cada feature está documentada en detalle en [`docs/features/`](features/).

## `functions/` — backend

Paquete npm **independiente** (tiene su propio `node_modules`, `tsconfig`, ESLint):

```
functions/
├── src/
│   ├── index.ts            # initializeApp() + barrel de exports (nada de lógica)
│   ├── reservations.ts     # reserveGift, cancelReservation, markGiftBought
│   ├── co-admins.ts        # addCoAdmin
│   ├── url-metadata.ts     # extractUrlMetadata
│   └── utils/
│       ├── safe-fetch.ts   # fetch con protección SSRF (ipaddr.js, redirects revalidados)
│       ├── metadata.ts     # parseo Open Graph con cheerio
│       └── token.ts        # hashToken (SHA-256)
├── lib/                    # JS compilado (generado por tsc, gitignored)
├── package.json            # Node 22, firebase-functions v6, "main": "lib/index.js"
└── tsconfig.json           # module/moduleResolution: nodenext
```

Detalles importantes:

- **ESM**: `"type": "module"`. Los imports relativos llevan extensión **`.js`** (`import ... from './utils/token.js'`) porque Node lo exige en runtime, aunque el fuente sea `.ts`.
- **`lib/` es generado**: nunca lo edites ni lo commitees. `npm run build` (o el deploy) lo regenera desde `src/`.
- **API 2ª gen**: se importa de `firebase-functions/v2/https` (`onCall`, `onRequest`, `HttpsError`).
- El detalle de cada función está en [03 · Backend](03-backend-firebase.md#cloud-functions).

## Rutas de la app

Definidas en `src/app/routes.ts` y montadas en `src/app/router.tsx`. Todas las páginas se cargan con `lazy()` desde `src/app/pages.ts`.

| Ruta | Página | Layout / Guard |
|---|---|---|
| `/` | LandingPage | PublicLayout |
| `/login` | LoginPage | PublicLayout |
| `/crear` | CreateListPage | (sin layout; redirige a settings si ya tienes lista) |
| `/:listId` | PublicListPage | PublicLayout |
| `/:listId/regalo/:giftId` | GiftDetailPage | PublicLayout |
| `/:listId/admin` | AdminListPage | AuthGuard → AdminLayout |
| `/:listId/admin/anadir` | AdminAddGiftPage | AuthGuard → AdminLayout |
| `/:listId/admin/editar/:giftId` | AdminEditGiftPage | AuthGuard → AdminLayout |
| `/:listId/admin/configuracion` | AdminSettingsPage | AuthGuard → AdminLayout |
| `*` | → redirige a `/` | — |

`AuthGuard` no solo pide sesión: **verifica que el usuario sea admin de la lista de la URL** (detalles en [04 · Flujos](04-flujos.md#4-guardas-de-ruta)).

## Comandos

### Frontend (desde la raíz)

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b + vite build → dist/
npm run lint       # ESLint del frontend
npm run preview    # Servir el build localmente
```

### Functions (desde functions/)

```bash
npm run build      # tsc → lib/
npm run lint       # ESLint de functions
npm run serve      # Emulador local de functions
npm run deploy     # firebase deploy --only functions
```

### Deploy (desde la raíz)

```bash
firebase deploy --only firestore:rules,functions   # reglas + functions
```

> El hosting del frontend **no** está en `firebase.json`: el build de `dist/` se despliega por otro canal. Ver el orden seguro de deploy en [03 · Backend](03-backend-firebase.md#deploy).
