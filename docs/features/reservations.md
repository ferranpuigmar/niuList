# Feature: reservations

La parte **más delicada** de la app: visitantes **anónimos** reservan regalos, y solo quien reservó puede cancelar o marcar como comprado. Como no hay cuentas de visitante, la propiedad se demuestra con un **token secreto + hash**, y todas las acciones de visitante pasan por **Cloud Functions** (el cliente no tiene permiso de escritura en Firestore).

Lee primero el diagrama del flujo completo: [04 · Flujos §6](../04-flujos.md#6-ciclo-de-vida-de-una-reserva-visitante--el-corazón-de-la-app).

## Archivos

```
src/features/reservations/
├── api/
│   ├── index.ts
│   └── reservations/
│       ├── service.ts        # VISITANTE: callables reserveGift, cancelReservation, markGiftBought
│       └── admin-service.ts  # ADMIN: reopenGift, adminMarkGiftBought (Firestore directo)
├── hooks/
│   ├── use-visitor.ts            # token + hash del visitante (localStorage)
│   ├── use-reserve-gift.ts       # visitante
│   ├── use-cancel-reservation.ts # visitante
│   ├── use-mark-bought.ts        # visitante
│   ├── use-admin-mark-bought.ts  # admin
│   └── use-reopen-gift.ts        # admin
└── schemas/
    └── reservation-schemas.ts    # reserveGiftSchema (el nombre del visitante)
```

Y en el backend: `functions/src/reservations.ts` (las tres callables con transacción y verificación de hash).

## La separación clave: service vs admin-service

| | `service.ts` (visitante) | `admin-service.ts` (admin) |
|---|---|---|
| Cómo escribe | **Callables** → Cloud Function → Admin SDK | `updateDoc` directo a Firestore |
| Quién autoriza | La función: verifica el **hash del token** | Las Security Rules: `isListAdmin` |
| Por qué | El visitante no tiene permisos de escritura y su propiedad se valida en servidor | El admin sí tiene permiso por rules; no necesita token |

Si tocas esta feature, **mantén esa separación**: nunca añadas una escritura directa a Firestore para una acción de visitante (las rules la rechazarían) ni pases tokens por las acciones de admin.

## useVisitor: la identidad del visitante

`use-visitor.ts` gestiona la identidad anónima:

- `visitorToken` — UUID generado con `crypto.randomUUID()` y persistido en `localStorage` (clave `regalitos_visitor_token`). **Solo sale del navegador hacia las callables.**
- `visitorTokenHash` — SHA-256 hex del token, calculado con Web Crypto. Es lo que se compara con `gift.reservedByTokenHash` para saber si una reserva "es mía". Se calcula async, por eso empieza como `''`.
- `visitorName` / `setVisitorName` — el nombre que escribió al reservar (localStorage, para prellenar).

El servidor calcula el mismo hash en `functions/src/utils/token.ts`; Node y Web Crypto producen exactamente el mismo hex.

## Hooks de mutación

| Hook | Llama a | Requiere |
|---|---|---|
| `useReserveGift` | callable `reserveGift` | `{ giftId, visitorName, visitorToken }` |
| `useCancelReservation` | callable `cancelReservation` | `{ giftId, visitorToken }` |
| `useMarkBought` | callable `markGiftBought` | `{ giftId, visitorToken }` |
| `useAdminMarkBought` | `adminMarkGiftBought` (directo) | `giftId` |
| `useReopenGift` | `reopenGift` (directo) | `giftId` |

Ninguna mutación invalida queries de regalos: la UI se refresca sola por los `onSnapshot` de [gifts](gifts.md).

## Garantías del backend (functions/src/reservations.ts)

- `reserveGift`: **transacción** — lee el doc y solo escribe si `status === 'pending'`. Dos visitantes simultáneos → uno gana, el otro recibe `failed-precondition`.
- `cancelReservation` / `markGiftBought`: solo proceden si `status === 'reserved'` **y** `sha256(tokenEnviado) === reservedByTokenHash`. Un visitante no puede tocar reservas ajenas ni aunque llame a la función a mano.
- Al cancelar (o cuando un admin reabre) se limpian `reservedBy`, `reservedByTokenHash`, `reservedAt` y `boughtAt`.

## Limitaciones conocidas

**Si el visitante borra `localStorage` (o cambia de navegador/dispositivo, o usa incógnito), pierde el acceso a sus propias reservas.**

`getOrCreateToken()` solo reutiliza el token si lo encuentra guardado; si no está, genera uno **nuevo** con `crypto.randomUUID()` — no hay forma de recuperar el anterior. Consecuencias:

- El hash del token nuevo ya no coincide con `reservedByTokenHash` de los regalos que había reservado antes. Para él, esos regalos pasan a verse como reservados por otra persona: desaparecen los botones "Cancelar reserva" / "Ya lo he comprado".
- También pierde el nombre guardado (`regalitos_visitor_name`) — solo afecta a la comodidad de no tener que reescribirlo.
- Puede seguir reservando **otros** regalos con normalidad; el token nuevo es válido para reservas futuras.
- **No es un fallo de seguridad**: nadie roba la reserva ni puede impersonar a otro visitante. Es el propio dueño quien pierde su vía de autogestión.
- **Única recuperación**: el admin reabre el regalo (`reopenGift`, no requiere token) o lo marca comprado directamente desde el panel.

Es un trade-off inherente al modelo "reservar sin registrarse": al no haber cuenta, la única prueba de propiedad es un secreto local al dispositivo. Cualquier alternativa (cuentas de visitante, magic links) añadiría la fricción que la app busca evitar.

### `reservedBy` (el nombre) sigue siendo visible — pero no sirve como prueba de propiedad

`reservedByTokenHash` es irreversible y solo se usa para comparar, pero `reservedBy` (el nombre que escribió el visitante) se guarda **en texto plano** y es público (`mapGiftSnapshot`, rules de lectura `allow read: if true`). Así que aunque el visitante pierda el token, "Reservado por Juan" sigue apareciendo igual en la card y el detalle.

Esto es **solo informativo**, nunca se usa para autorizar nada:

- La UI decide qué botones mostrar comparando *exclusivamente* `reservedByTokenHash === sha256(miToken)` — nunca por nombre.
- El backend (`functions/src/reservations.ts`) tampoco acepta el nombre como prueba: `cancelReservation`/`markGiftBought` solo verifican el hash del token recibido.
- Los nombres no son únicos ni secretos (cualquiera puede escribir "Juan"), así que no podrían usarse de forma segura como mecanismo de autorización aunque se quisiera.

En la práctica: el visitante puede *reconocer visualmente* cuál era "su" regalo por el nombre, pero no recupera ninguna acción sobre él — solo el admin puede resolverlo (de forma manual/humana, verificando fuera de la app si hace falta).

### Mejora futura considerada: recuperación opcional por email (magic link)

Se evaluó usar el **email como identificador** del visitante para que la reserva fuese recuperable tras perder localStorage. Conclusiones del análisis:

- **Email sin verificar**: descartado. Un email no es un secreto (lo conoce todo el círculo del invitado); autorizar por email escrito permitiría a cualquiera gestionar reservas ajenas. Sería degradar la seguridad que hoy da el token aleatorio.
- **Email verificado obligatorio** (magic link de Firebase Auth): seguro y recuperable, pero rompe el pitch de "reservar sin registrarse" (fricción de ir al correo y volver) y obliga a almacenar datos personales (GDPR).
- **Híbrido opcional** — la opción elegida si algún día hace falta:
  1. El flujo actual (token + hash) se mantiene intacto como camino por defecto, sin fricción.
  2. Al reservar, se pide el email **opcionalmente** ("por si necesitas recuperar tu reserva desde otro dispositivo"). Se guardaría en el documento no visible públicamente (o hasheado si solo sirve para recuperar).
  3. Un botón "recuperar mis reservas" enviaría un magic link (email link sign-in de Firebase Auth); al verificarlo, una Cloud Function reasignaría `reservedByTokenHash` al hash del token del dispositivo nuevo.

**Estado**: no implementado a propósito. Para el caso de uso real (lista que vive 2-3 meses, ~20-40 invitados), perder localStorage es raro y el admin lo resuelve reabriendo el regalo en dos clics. Implementarlo solo si los admins reportan que el problema ocurre con frecuencia.

## Flujos donde participa

- [Ciclo de vida de una reserva](../04-flujos.md#6-ciclo-de-vida-de-una-reserva-visitante--el-corazón-de-la-app)
- [Tiempo real](../04-flujos.md#7-tiempo-real-onsnapshot-vs-tanstack-query)
- El porqué del hash: [03 · Backend](../03-backend-firebase.md#por-qué-el-token-se-guarda-hasheado)
