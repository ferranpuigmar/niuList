# Feature: lists

La **lista de regalos** en sí: crearla, leerla, editar sus datos (nombre del bebé, emoji, mensaje de bienvenida) y su página pública.

## Archivos

```
src/features/lists/
├── api/
│   ├── index.ts
│   └── lists/
│       ├── service.ts    # createList, getListById, getListsByAdminId, updateListById
│       └── mappers.ts    # mapListSnapshot: doc Firestore → List
├── hooks/
│   ├── use-create-list.ts   # useCreateListMutation (el flujo completo de alta)
│   ├── use-list.ts          # useList (query de una lista)
│   └── use-update-list.ts   # editar datos de la lista
├── pages/
│   ├── public-list-page.tsx    # /:listId — la vista que ven los invitados
│   └── admin-settings-page.tsx # /:listId/admin/configuracion
├── schemas/
│   └── list-schemas.ts      # createListSchema, updateListSchema (zod)
└── types/
    └── list-type.ts         # List { id, babyName, emoji, welcomeMessage, adminIds, ... }
```

## Hooks

| Hook | Qué hace | Quién lo usa |
|---|---|---|
| `useList(listId)` | TanStack Query `['list', listId]` → `getDoc` de `lists/{listId}`. Lanza error si no existe | PublicListPage, AuthGuard, AdminSettingsPage |
| `useCreateListMutation` | Alta completa: cuenta del admin + doc de lista + co-admin opcional (callable) + navegación | CreateListPage |
| `useUpdateList` | `updateDoc` de babyName/emoji/welcomeMessage | AdminSettingsPage |

> `useList` usa TanStack Query (no `onSnapshot`) porque los datos de la lista cambian poco y solo por acciones del propio admin. Ver la [comparativa de mecanismos](../04-flujos.md#7-tiempo-real-onsnapshot-vs-tanstack-query).

## Páginas

- **PublicListPage** (`/:listId`) — la que ven los invitados: cabecera con nombre/emoji/mensaje, barra de progreso "X de Y regalos", grid de `GiftCard`s y el `CoAdminBanner`. Obtiene el `visitorTokenHash` de `useVisitor` para que cada card sepa si la reserva "es mía".
- **AdminSettingsPage** (`/:listId/admin/configuracion`) — editar datos de la lista, cambiar contraseña, añadir co-admin, compartir.

## Seguridad relevante

- Cualquiera puede **leer** una lista (rules: `allow read: if true`) — así funciona el enlace compartible.
- Solo usuarios de `adminIds` pueden **modificarla** (rules) — y `AuthGuard` usa ese mismo campo para decidir si te deja entrar al panel.

## Flujos donde participa

- [Crear lista](../04-flujos.md#2-crear-una-lista-crear)
- [Guardas de ruta](../04-flujos.md#4-guardas-de-ruta)
- [Compartir y co-admins](../04-flujos.md#8-compartir-y-co-admins)
