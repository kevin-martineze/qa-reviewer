# Arquitectura del backend (`qa-reviewer-api`)

Stack y estilo **iguales a los micros de Lideris** (referencia: `micro-procurement/docs/ARCHITECTURE.md`): NestJS 11 sobre Fastify, MongoDB con Mongoose, validación con Joi, Swagger generado desde el código y S3 con URLs firmadas. Así cualquier dev backend del equipo lo entiende sin curva.

> Este documento vive aquí mientras se crea el repo del API. Al crearlo, pasa a `qa-reviewer-api/docs/ARCHITECTURE.md`.

## Capas

| Capa | Dónde | Reglas |
|---|---|---|
| Controllers | `modules/<dominio>/controllers` | Ruta, versión (`@Version('1')`), validación Joi (`joi-validations.ts`), guard de auth/rol, `@Doc*`. **Sin lógica.** |
| Providers (servicios) | `modules/<dominio>/providers` | Toda la orquestación. Devuelven `{ messageKey, data }`. Lanzan `BadRequest`/`NotFound`/`Conflict`/`Forbidden` con clave i18n. |
| Funciones puras | `providers/*.ts` sin DI | Máquinas de estado, agregación de veredictos, diff de rondas, validadores. Se prueban en unidad. |
| Schemas | `shared/schemas` | Clases Mongoose con `@ApiProperty` en cada campo; enums en `shared/enums`. |
| Shared (global) | `modules/shared` | `StorageService` (S3), `ClockService`, `SerialService` (`QR-0001`), `IdempotencyService`. |
| Outbox (global) | `shared/outbox` | `OutboxService.publish()` dentro de la transacción; `OutboxWorker` entrega a los notificadores. |

## Módulos

| Módulo | Agregado / responsabilidad | Depende de |
|---|---|---|
| `auth` | Login de la plataforma (JWT access + refresh), tokens personales de la skill (hash SHA-256, prefijo `qa_pat_`, revocables) | shared |
| `projects` | `Project` (repo de GitHub, proyecto de Plane, límites, reviewers) y miembros con rol | auth |
| `reviews` | `Review` con pantallas y veredictos embebidos; creación desde el manifiesto, publicación, rondas, cierre | projects, assets, outbox |
| `assets` | URLs firmadas de subida y lectura, verificación (`HEAD`) y borrado de borradores vencidos | shared |
| `feedback` | Veredictos, comentarios (`qa_comments`) y `submit` | reviews, outbox |
| `integrations` | Notificadores de GitHub y Plane; webhook de GitHub (PR cerrado) | outbox |

## Patrones de diseño

| Patrón | Dónde | Cómo se extiende |
|---|---|---|
| **State** (por tabla y con guarda) | `reviews/providers/review-state.machine.ts`, `screen-verdict.machine.ts` | Agregar la transición a la tabla; el servicio aplica `findOneAndUpdate({ _id, status })` y responde `409` si el estado cambió |
| **Chain of Responsibility** | `reviews/providers/manifest-validations.ts` (`ManifestValidationChain`): versión soportada → privacidad → límites del proyecto → viewports → claves únicas → rama/PR coherentes con la revisión existente | Agregar un validador; cada uno lanza su clave i18n |
| **Strategy (registro por clave)** | `integrations/providers/notifiers.ts`: `Notifier` con `supports(event)` y `notify(event)`; `NOTIFIERS = [GithubPrCommentNotifier, PlaneCardCommentNotifier]` | Slack o correo = un notificador nuevo en el registro; el worker no cambia |
| **Adapter** | `integrations/clients/github.client.ts`, `plane.client.ts`; `assets/storage/s3.storage.ts` detrás de `StoragePort` | Otro proveedor de storage (MinIO, GCS) implementa `StoragePort` |
| **Transactional outbox** | `shared/outbox` | Publicar dentro de la transacción; consumidores idempotentes por `eventId` |
| **Snapshot** | `Review.pr`, `Review.card`, `Review.author` | Copiar al crear; los eventos llevan el snapshot |
| **Idempotency key** | `IdempotencyService` (`qa_idempotency`, TTL 24 h) | Reintentos de la skill devuelven la misma respuesta |
| **Diff de rondas** (función pura) | `reviews/providers/round-diff.ts` | Compara `screens[].key` + `sha256` para decidir qué se recaptura y qué hereda veredicto |

## Datos (MongoDB)

| Colección | Contenido | Índices |
|---|---|---|
| `qa_projects` | proyecto, integraciones, límites, miembros | `slug` único |
| `qa_reviews` | revisión + `screens[]` + `rounds[]` (capturas y veredictos por ronda) + `submissions[]` | `projectId+pr.number` único; `status`; `author`; `updatedAt` |
| `qa_comments` | `reviewId`, `screenKey`, `round`, `authorId`, `body`, `anchor`, `resolved` | `reviewId+screenKey+createdAt` |
| `qa_users` | usuarios de la plataforma | `email` único |
| `qa_api_tokens` | `hash`, `prefix`, `userId`, `projectId`, `lastUsedAt`, `revokedAt` | `hash` único |
| `qa_outbox` | eventos pendientes y entregados, intentos, próximo intento | `status+nextAttemptAt` |
| `qa_idempotency` | clave → respuesta | TTL 24 h |
| `qa_counters` | serial `QR-` por proyecto | `projectId` único |

Claves de objetos en S3: `projects/<projectId>/reviews/<reviewId>/r<round>/<screenKey>/<before|after>.<ext>`.

## Flujo de subida

1. `POST /v1/reviews` → cadena de validación → transacción: `Review(draft)` + entrada de idempotencia → responde con URLs `PUT` firmadas (TTL 15 min, `Content-Type` y `Content-Length` fijos).
2. La skill sube directo a S3.
3. `POST /v1/reviews/:id/publish` → `HEAD` de cada objeto (existe, tamaño y tipo correctos) → transacción: `draft → open` + outbox `ReviewOpened`.
4. `OutboxWorker` (cada 5 s, lotes, backoff exponencial, máximo 8 intentos y luego `dead`) → notificadores.
5. Cron diario: `draft` con más de 24 h → `expired` y borrado de sus objetos.

## Operación

- Configuración validada con Joi al arrancar (`MONGO_URI`, `S3_BUCKET`, `S3_REGION`, `JWT_SECRET`, `GITHUB_TOKEN`, `GITHUB_WEBHOOK_SECRET`, `PLANE_TOKEN`, `PUBLIC_WEB_URL`).
- Docker y `docker-compose` (Mongo + MinIO para desarrollo local).
- Logs estructurados con `requestId`; healthchecks para el balanceador.
- La documentación es código: el esquema Joi de cada request genera su body en OpenAPI, y una prueba falla si una ruta no documenta su respuesta (igual que micro-procurement).

## Pruebas

| Nivel | Qué cubre |
|---|---|
| Unidad | Máquinas de estado, cadena de validación, diff de rondas, agregación de veredictos, notificadores (con cliente falso) |
| Integración | Servicios contra Mongo en memoria y MinIO: crear → publicar → veredicto → submit → outbox |
| Contrato | El OpenAPI generado no rompe `v1` (snapshot del spec en CI) |
