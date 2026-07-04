# Feature: gifts

El **CRUD de regalos** (solo admins) y su visualización en tiempo real: crear/editar/borrar regalos, subir imágenes a Storage, autorrellenar el formulario desde una URL de tienda, y las suscripciones `onSnapshot` que mantienen la UI al día.

> El cambio de estado de un regalo (reservar/comprar) NO vive aquí, sino en [reservations](reservations.md).

## Archivos

```
src/features/gifts/
├── api/
│   ├── index.ts
│   └── gifts/
│       ├── service.ts        # createGift, updateGift, deleteGift (Firestore directo)
│       ├── image-service.ts  # uploadGiftImage → Storage
│       └── mappers.ts        # mapGiftDoc / mapGiftSnapshot → Gift
├── hooks/
│   ├── use-gifts.ts          # onSnapshot de la colección (lista completa)
│   ├── use-gift.ts           # onSnapshot de UN documento (página de detalle)
│   ├── use-create-gift.ts
│   ├── use-update-gift.ts
│   └── use-delete-gift.ts
├── components/
│   ├── gift-card.tsx         # Card del grid (pública y admin)
│   └── stat-card.tsx
├── pages/
│   ├── gift-detail-page.tsx     # /:listId/regalo/:giftId (pública, con reserva)
│   ├── admin-list-page.tsx      # /:listId/admin (panel del admin)
│   ├── admin-add-gift-page.tsx  # /:listId/admin/anadir
│   └── admin-edit-gift-page.tsx # /:listId/admin/editar/:giftId
├── schemas/
│   └── gift-schemas.ts       # giftSchema (zod): name, price, purchaseUrl...
└── types/
    └── gift-type.ts          # Gift + GiftStatus ('pending' | 'reserved' | 'bought')
```

## Hooks

| Hook | Mecanismo | Qué hace |
|---|---|---|
| `useGifts(listId)` | **onSnapshot** (colección, ordenada por `createdAt desc`) | Lista en tiempo real. Si otro navegador reserva un regalo, tu grid se actualiza solo |
| `useGift(listId, giftId)` | **onSnapshot** (un solo doc) | Detalle en tiempo real. Devuelve `null` si el doc no existe |
| `useCreateGift` / `useUpdateGift` | mutación TanStack Query | Escriben a Firestore + suben imagen si hay |
| `useDeleteGift` | mutación | `deleteDoc` |

Los mappers: `mapGiftDoc(id, data)` es la conversión base doc→`Gift`; `mapGiftSnapshot` la aplica a docs de query (que siempre tienen data). Si añades un campo al modelo, tócalo ahí y en `gift-type.ts`.

## Subida de imágenes

`uploadGiftImage` (`api/gifts/image-service.ts`) sube a Storage en `lists/{listId}/gifts/{giftId}/<uuid>.<ext>`:

- El nombre es un `crypto.randomUUID()` — **nunca** se usa `file.name` del usuario en la ruta (colisiones/caracteres raros).
- Las rules de Storage limitan a admins, 5 MB y `image/*`.
- El flujo en `useCreateGift`: primero `addDoc` (para tener `giftId`), luego subir imagen, luego `updateGift` con la `imageUrl`.

## Autorrellenar desde URL de tienda

En las páginas de añadir/editar, el botón de extraer llama por `fetch` a la Cloud Function `extractUrlMetadata` con la `purchaseUrl`. La función devuelve `{ title, description, imageDataUrl }` (imagen en base64, que el cliente convierte a `File` para el flujo normal de subida). Diagrama en [04 · Flujos §5](../04-flujos.md#5-añadir--editar-un-regalo-admin).

## GiftCard: pública vs admin

`gift-card.tsx` recibe `variant` (`'public' | 'admin'`) y, en la pública, `visitorTokenHash` para marcar "Tú" cuando `gift.reservedByTokenHash === visitorTokenHash`. Los regalos no-pendientes se atenúan para los demás visitantes.

## Flujos donde participa

- [Añadir/editar regalo](../04-flujos.md#5-añadir--editar-un-regalo-admin)
- [Tiempo real](../04-flujos.md#7-tiempo-real-onsnapshot-vs-tanstack-query)
- [Ciclo de vida de una reserva](../04-flujos.md#6-ciclo-de-vida-de-una-reserva-visitante--el-corazón-de-la-app) (la página de detalle monta las acciones de reserva)
