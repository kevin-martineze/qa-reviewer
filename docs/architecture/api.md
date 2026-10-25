# Contrato del API (v1)

Base: `https://<host>/v1`. JSON en `camelCase`. La **fuente de verdad** es el OpenAPI que publica el API en `/docs-json`, generado desde el código como en micro-procurement. Este documento es la guía de diseño y el código manda.

## Convenciones

| Tema         | Regla                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Versionado   | Prefijo `/v1`. Un cambio incompatible crea `/v2`; `v1` se mantiene mientras haya skills viejas. El manifiesto tiene su propia versión (`manifestVersion`).   |
| Respuesta    | Envoltorio estándar `{ "messageKey": "reviews.created", "data": … }`.                                                                                        |
| Errores      | `{ "statusCode": 409, "messageKey": "reviews.stale_status", "message": "…", "details"?: … }`. Las claves i18n se documentan por endpoint.                    |
| Paginación   | `?page=1&limit=20`, con respuesta `{ items, pagination: { page, limit, total } }`.                                                                           |
| Idempotencia | `Idempotency-Key` obligatorio en `POST /reviews` y `POST /reviews/:id/rounds` (la skill reintenta). La misma clave devuelve la misma respuesta durante 24 h. |
| Concurrencia | Los comandos de estado se aplican con guarda de estado; si el estado cambió, responde `409`.                                                                 |
| Fechas       | ISO 8601 UTC.                                                                                                                                                |

## Autenticación

| Cliente                      | Mecanismo                                                                                                                                  | Alcance                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Skill (dev)                  | `Authorization: Bearer qa_pat_…`, token personal por proyecto                                                                              | Crear y publicar revisiones y rondas, leer el feedback de las suyas |
| Plataforma (reviewer, autor) | Sesión: el server de SvelteKit hace login contra el API y guarda el access token en una cookie `httpOnly`. El navegador nunca ve el token. | Según rol en el proyecto                                            |
| GitHub                       | Webhook firmado (`X-Hub-Signature-256`)                                                                                                    | `pull_request` closed/merged                                        |

Roles por proyecto: `admin` (gestiona miembros y tokens), `reviewer` (da veredictos) y `author` (crea revisiones y comenta).

## Endpoints

### Revisiones

| Método | Ruta                    | Quién      | Qué hace                                                                                                                               |
| ------ | ----------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/reviews`              | skill      | Crea la revisión (o la ronda 1) desde el manifiesto. Responde `draft` con `uploads[]`: `{ screenKey, kind, url, headers, expiresAt }`. |
| `POST` | `/reviews/:id/publish`  | skill      | Verifica que existan los objetos; `draft → open`. Emite `ReviewOpened`.                                                                |
| `POST` | `/reviews/:id/rounds`   | skill      | Nueva ronda con manifiesto (mismo PR). Devuelve `uploads[]` solo de las pantallas nuevas o recapturadas.                               |
| `GET`  | `/reviews`              | plataforma | Lista con filtros: `status`, `project`, `author`, `assignedToMe`, `q` (título, tarjeta, PR).                                           |
| `GET`  | `/reviews/:id`          | ambos      | Detalle: snapshot, resumen, pantallas de la ronda actual con veredicto y URLs firmadas de lectura (TTL 15 min).                        |
| `GET`  | `/reviews/:id/feedback` | skill      | Para `/design-review status`: veredictos y comentarios abiertos de la última ronda enviada, en texto listo para la sesión.             |

### Feedback

| Método  | Ruta                                       | Quién                | Qué hace                                                                                      |
| ------- | ------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------- |
| `PUT`   | `/reviews/:id/screens/:screenKey/verdict`  | reviewer             | `{ verdict }`. Pasa a `in_review` si estaba `open`.                                           |
| `GET`   | `/reviews/:id/screens/:screenKey/comments` | ambos                | Hilo de la pantalla (todas las rondas).                                                       |
| `POST`  | `/reviews/:id/screens/:screenKey/comments` | ambos                | `{ body, anchor?: { x, y, w, h } }`, con el ancla en fracciones 0–1 de la imagen `after`.     |
| `PATCH` | `/comments/:commentId`                     | autor del comentario | Editar o `resolved: true`.                                                                    |
| `POST`  | `/reviews/:id/submit`                      | reviewer             | Cierra los veredictos de la ronda: `approved` o `changes_requested`. Emite `ReviewSubmitted`. |

### Proyectos y acceso

| Método            | Ruta                                             | Qué hace                                                                   |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| `GET`             | `/projects`                                      | Proyectos del usuario                                                      |
| `GET/POST/DELETE` | `/projects/:id/members`                          | Gestión de miembros y roles (admin)                                        |
| `POST`            | `/tokens`                                        | Crea un token personal para la skill; el valor se muestra **una sola vez** |
| `GET` · `DELETE`  | `/tokens`, `/tokens/:id`                         | Listar y revocar                                                           |
| `POST`            | `/auth/login` · `/auth/refresh` · `/auth/logout` | Sesión de la plataforma                                                    |
| `POST`            | `/integrations/github/webhook`                   | Cierre de revisiones al cerrar el PR                                       |

### Salud

`GET /healthcheck`, `GET /healthcheck/readiness-probe` (Mongo + S3).

## Eventos (outbox)

| Evento            | Cuándo                  | Consumidores                                                                       |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `ReviewOpened`    | `publish` o nueva ronda | Comentario en el PR y la tarjeta: «Revisión de UI lista: QR-0007 (ronda 2)» + link |
| `ReviewSubmitted` | `submit`                | Comentario en el PR y la tarjeta con el resumen por pantalla                       |
| `ReviewClosed`    | PR cerrado              | Ninguno en el MVP (métricas después)                                               |

Cada evento lleva `eventId` (idempotencia), `occurredAt` y el snapshot que necesita el consumidor.
