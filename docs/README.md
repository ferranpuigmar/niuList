# 📚 Documentación de Regalitos (lista_bebes)

Documentación de onboarding para desarrolladores nuevos en el proyecto, especialmente si tienes poca experiencia con Firebase.

## Índice

| Documento | Qué encontrarás |
|---|---|
| [01 · Visión general](01-vision-general.md) | Qué es la app, el stack, cómo funciona Firebase y la arquitectura completa |
| [02 · Estructura del proyecto](02-estructura-proyecto.md) | Layout del repo, organización de `src/` y `functions/`, rutas y comandos |
| [03 · Backend Firebase](03-backend-firebase.md) | Modelo de datos, Cloud Functions, reglas de seguridad y deploy |
| [04 · Flujos](04-flujos.md) | Los flujos end-to-end explicados con diagramas de secuencia |
| [features/auth](features/auth.md) | Sesión, login, store de autenticación |
| [features/lists](features/lists.md) | Creación y gestión de listas |
| [features/gifts](features/gifts.md) | CRUD de regalos, imágenes, extracción de metadatos |
| [features/reservations](features/reservations.md) | Reservas de visitantes anónimos (la parte más delicada) |
| [features/sharing](features/sharing.md) | Compartir lista y co-admins |

## Ruta de lectura recomendada (primer día)

1. **[01 · Visión general](01-vision-general.md)** — entiende qué hace la app y cómo piensa Firebase. Si nunca has usado Firebase, no te saltes el "primer de Firebase".
2. **[02 · Estructura del proyecto](02-estructura-proyecto.md)** — para saber dónde vive cada cosa antes de abrir archivos.
3. **[04 · Flujos](04-flujos.md)** — cómo se conectan las piezas. El flujo de reservas es el corazón de la app.
4. **[03 · Backend](03-backend-firebase.md)** y los docs de `features/` — como referencia cuando toques cada área.

## Arrancar en local

```bash
npm install
npm run dev          # Vite en http://localhost:5173
```

Necesitas un `.env` en la raíz con las credenciales de Firebase (`VITE_FIREBASE_*`). No está versionado: pídeselo a otro miembro del equipo.

> ⚠️ `npm run dev` conecta contra el proyecto Firebase **real** (`lista-bebes`). No hay entorno de staging configurado a día de hoy.
