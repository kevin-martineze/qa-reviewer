# Contrato del API (v1)

Base: `https://<host>/v1`. JSON en `camelCase`. La **fuente de verdad** es el OpenAPI que publica el API en `/docs-json`, generado desde el código. Este documento es la guía de diseño y el código manda.

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

| Cliente                      | Mecanismo                                                                                                                                                                                                               | Alcance                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Skill (dev)                  | `Authorization: Bearer qa_pat_…`, token personal por proyecto                                                                                                                                                           | Crear y publicar revisiones y rondas, leer el feedback de las suyas |
| Plataforma (reviewer, autor) | Sesión: el server de SvelteKit hace login contra el API y guarda el token opaco (`qa_sess_…`, 7 días deslizantes, [ADR 0009](../adr/0009-sesiones-opacas.md)) en una cookie `httpOnly`. El navegador nunca ve el token. | Según rol en el proyecto                                            |
| GitHub                       | Webhook firmado (`X-Hub-Signature-256`)                                                                                                                                                                                 | `pull_request` closed/merged                                        |

Roles y permisos: ver [users-and-roles.md](users-and-roles.md). Cada endpoint de la plataforma exige el permiso de la columna «Permiso»; el front lo verifica antes (UX) y el API lo vuelve a validar.

## Endpoints

La columna «Puerto» es el método de `$lib/api/ports.ts` que lo consume; el adaptador `http` (`$lib/server/adapters/http`) hace la llamada y el `mock` reproduce las mismas reglas. Un endpoint sin puerto lo usa solo la skill.

### Skill

| Método | Ruta                    | Permiso          | Qué hace                                                                                                                               |
| ------ | ----------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/reviews`              | `reviews:create` | Crea la revisión (o la ronda 1) desde el manifiesto. Responde `draft` con `uploads[]`: `{ screenKey, kind, url, headers, expiresAt }`. |
| `POST` | `/reviews/:id/publish`  | `reviews:create` | Verifica que existan los objetos; `draft → open`. Emite `ReviewOpened`.                                                                |
| `POST` | `/reviews/:id/rounds`   | `reviews:create` | Nueva ronda con manifiesto (mismo PR). Devuelve `uploads[]` solo de las pantallas nuevas o recapturadas.                               |
| `GET`  | `/reviews/:id/feedback` | autor            | Para `/design-review status`: veredictos y comentarios abiertos de la última ronda enviada, en texto listo para la sesión.             |

### Revisiones

| Método  | Ruta                     | Permiso          | Puerto                | Qué hace                                                                                                                                                                                                   |
| ------- | ------------------------ | ---------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`   | `/reviews`               | `reviews:read`   | `reviews.list`        | `?status&project&author&assignee&priority&overdue&q&sort=updated\|due\|priority&page&limit` → `PaginatedResponse<Review>`. `status` se repite (`status=open&status=in_review`); `overdue=true` o se omite. |
| `GET`   | `/reviews/:id`           | `reviews:read`   | `reviews.get`         | Revisión con pantallas, rondas y URLs firmadas de lectura (TTL 15 min).                                                                                                                                    |
| `GET`   | `/reviews/:id/activity`  | `reviews:read`   | `reviews.activity`    | `ActivityEvent[]`, más reciente primero.                                                                                                                                                                   |
| `PUT`   | `/reviews/:id/assignees` | `reviews:assign` | `reviews.assign`      | `{ assignees: userId[] }`. Solo diseñadores y líderes del proyecto.                                                                                                                                        |
| `PATCH` | `/reviews/:id`           | `reviews:assign` | `reviews.setPriority` | `{ priority }`.                                                                                                                                                                                            |
| `POST`  | `/reviews/:id/reopen`    | `reviews:reopen` | `reviews.reopen`      | `{ reason }`. Anula el último envío y vuelve a `in_review`; avisa al autor.                                                                                                                                |

### Feedback

| Método   | Ruta                                       | Permiso                                    | Puerto                    | Qué hace                                                                                                                 |
| -------- | ------------------------------------------ | ------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `PUT`    | `/reviews/:id/screens/:screenKey/verdict`  | `verdicts:set` (no el autor)               | `feedback.setVerdict`     | `{ verdict: pending\|approved\|changes_requested }`. Pasa a `in_review` si estaba `open`. `409` si la ronda ya se envió. |
| `POST`   | `/reviews/:id/submit`                      | `verdicts:set` (no el autor)               | `feedback.submit`         | `{ body? }`. Cierra la ronda: `approved` si todo está aprobado, si no `changes_requested`. Emite `ReviewSubmitted`.      |
| `GET`    | `/reviews/:id/comments`                    | `reviews:read`                             | `feedback.comments`       | Todos los comentarios de la revisión (todas las rondas).                                                                 |
| `GET`    | `/reviews/:id/screens/:screenKey/comments` | `reviews:read`                             | `feedback.comments`       | Hilo de una pantalla.                                                                                                    |
| `POST`   | `/reviews/:id/screens/:screenKey/comments` | `comments:create`                          | `feedback.addComment`     | `{ body, anchor: { x, y } \| null, el: ElementRef \| null }`, ancla en fracciones 0–1 de la captura.                     |
| `POST`   | `/comments/:id/replies`                    | `comments:create`                          | `feedback.reply`          | `{ body }`.                                                                                                              |
| `PATCH`  | `/comments/:id`                            | `comments:resolve`                         | `feedback.resolveComment` | `{ resolved }`.                                                                                                          |
| `PUT`    | `/comments/:id/follow-up`                  | `verdicts:set`                             | `feedback.setFollowUp`    | `{ followUp: resolved\|still }`: respuesta a «¿Quedó resuelto en la ronda N?».                                           |
| `DELETE` | `/comments/:id`                            | autor del comentario o `comments:moderate` | `feedback.deleteComment`  | `204`.                                                                                                                   |

### Sesión y cuenta

| Método  | Ruta                         | Permiso | Puerto                      | Qué hace                                                                                                    |
| ------- | ---------------------------- | ------- | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `POST`  | `/auth/login`                | —       | `auth.login`                | `{ email, password }` → `{ token, user }`. El server de SvelteKit guarda el token en una cookie `httpOnly`. |
| `POST`  | `/auth/logout`               | sesión  | `auth.logout`               | Revoca la sesión actual.                                                                                    |
| `POST`  | `/auth/logout-all`           | sesión  | `auth.logoutEverywhere`     | Revoca todas las sesiones del usuario (no los tokens de la skill).                                          |
| `POST`  | `/auth/recovery`             | —       | `auth.requestRecovery`      | `{ email }`. Siempre `204`, exista o no el correo.                                                          |
| `GET`   | `/auth/recovery/:token`      | —       | `auth.recoveryInfo`         | `{ status: valid\|expired\|used }`.                                                                         |
| `POST`  | `/auth/recovery/:token`      | —       | `auth.resetPassword`        | `{ password }`. `410` si venció o se usó.                                                                   |
| `GET`   | `/invitations/:token`        | —       | `auth.inviteInfo`           | `InviteInfo` con `status: valid\|expired\|used\|revoked`.                                                   |
| `POST`  | `/invitations/:token/accept` | —       | `auth.acceptInvite`         | `{ name, password, avatar }` → `{ token, user }`. `avatar`: id del banco (`a01`…`a12`) o `null`.            |
| `GET`   | `/me`                        | sesión  | `auth.me`                   | `SessionUser` con membresías. Los permisos se derivan en el front.                                          |
| `PATCH` | `/me`                        | sesión  | `auth.updateProfile`        | `{ name, avatar }`. `avatar`: id del banco o `null` (iniciales).                                            |
| `PUT`   | `/me/password`               | sesión  | `auth.changePassword`       | `{ current, next }`. `400 auth.wrong_password` si la actual no coincide; cierra las demás sesiones.         |
| `GET`   | `/me/notification-prefs`     | sesión  | `notifications.prefs`       | `NotificationPrefs`: qué llega también por correo.                                                          |
| `PUT`   | `/me/notification-prefs`     | sesión  | `notifications.updatePrefs` | El objeto completo.                                                                                         |

### Notificaciones

| Método | Ruta                          | Puerto                      | Qué hace                                  |
| ------ | ----------------------------- | --------------------------- | ----------------------------------------- |
| `GET`  | `/notifications`              | `notifications.list`        | `?unread&mentions`, más reciente primero. |
| `GET`  | `/notifications/unread-count` | `notifications.unreadCount` | Número para la campana.                   |
| `POST` | `/notifications/:id/read`     | `notifications.markRead`    | `204`.                                    |
| `POST` | `/notifications/read-all`     | `notifications.markAllRead` | `204`.                                    |

### Organización, proyectos y miembros

| Método   | Ruta                            | Permiso                                  | Puerto                       | Qué hace                                                                                                                                                                                                             |
| -------- | ------------------------------- | ---------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/organization`                 | sesión                                   | `directory.organization`     | `{ id, name }`.                                                                                                                                                                                                      |
| `GET`    | `/users`                        | sesión                                   | `directory.listUsers`        | Usuarios de la organización (el shell los usa para mostrar nombres y avatares).                                                                                                                                      |
| `PATCH`  | `/users/:id`                    | `users:invite`                           | `directory.setUserStatus`    | `{ status }`. Exactamente uno de `status` u `orgRole`. Desactivar cierra sus sesiones y revoca sus tokens. `409 users.self` sobre uno mismo, `409 users.owner` sobre el owner.                                       |
| `PATCH`  | `/users/:id`                    | `users:invite` · `org:manage` para owner | `directory.setOrgRole`       | `{ orgRole }`. `409 users.self` sobre uno mismo.                                                                                                                                                                     |
| `GET`    | `/invitations`                  | `users:invite`                           | `directory.listInvitations`  | Con `status` calculado.                                                                                                                                                                                              |
| `POST`   | `/invitations`                  | `users:invite`                           | `directory.invite`           | `{ email, role, projects: Membership[] }`. `role: owner` exige `org:manage`. `409 users.exists` o `409 invite.pending`; `400 invite.invalid_projects` si un proyecto no existe. Envía el correo (7 días).            |
| `DELETE` | `/invitations/:id`              | `users:invite`                           | `directory.revokeInvitation` | `204`.                                                                                                                                                                                                               |
| `POST`   | `/projects`                     | `projects:create`                        | `directory.createProject`    | `{ id, name, repo?, planeKey? }`. `id` es el slug (minúsculas, números y guiones; no cambia). `409 projects.exists`. Audita `project_created`.                                                                       |
| `GET`    | `/projects`                     | sesión                                   | `directory.listProjects`     | Proyectos visibles (todos para owner y admin).                                                                                                                                                                       |
| `GET`    | `/projects/:id`                 | `reviews:read`                           | `directory.getProject`       | `404` si no lo ve.                                                                                                                                                                                                   |
| `PATCH`  | `/projects/:id`                 | `projects:configure`                     | `directory.updateProject`    | `ProjectPatch`: `name`, `slaDays`, `strategy`, `moduleRules`, `integrations` (completo), `maskSelectors`, `designRules`. `400 projects.invalid_rules` si una regla apunta a quien no es miembro (`details.userIds`). |
| `GET`    | `/projects/:id/members`         | `reviews:read`                           | `directory.listMembers`      | `ProjectMember[]`. `404 projects.not_found` si no lo ve.                                                                                                                                                             |
| `POST`   | `/projects/:id/members`         | `members:manage`                         | `directory.addMember`        | `{ userId, role }`. `409 members.exists` si ya es miembro; `404 users.not_found`; `409 users.inactive` si la cuenta está desactivada.                                                                                |
| `PATCH`  | `/projects/:id/members/:userId` | `members:manage`                         | `directory.setMemberRole`    | `{ role }`.                                                                                                                                                                                                          |
| `DELETE` | `/projects/:id/members/:userId` | `members:manage`                         | `directory.removeMember`     | `404 members.not_found` si no es miembro; `409 members.self` sobre uno mismo. Borra sus reglas por módulo en el proyecto.                                                                                            |
| `GET`    | `/audit`                        | `users:invite`                           | `directory.audit`            | `?type&actor&page&limit` → `PaginatedResponse<AuditEvent>`.                                                                                                                                                          |

### Tokens de la skill

| Método   | Ruta          | Permiso                     | Puerto          | Qué hace                                                                              |
| -------- | ------------- | --------------------------- | --------------- | ------------------------------------------------------------------------------------- |
| `GET`    | `/tokens`     | sesión                      | `tokens.list`   | Tokens propios, solo con `prefix`.                                                    |
| `POST`   | `/tokens`     | `tokens:own` en el proyecto | `tokens.create` | `{ projectId, label }` → `{ token, secret }`. El secreto se entrega **una sola vez**. |
| `DELETE` | `/tokens/:id` | dueño                       | `tokens.revoke` | `204`.                                                                                |

### Métricas e integraciones

| Método | Ruta                           | Permiso        | Puerto             | Qué hace                                                                                         |
| ------ | ------------------------------ | -------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `GET`  | `/reports/overview`            | `reports:view` | `reports.overview` | `?project&from&to` → `ReportsOverview` (KPIs, semanas, carga por diseñador, ajustes por módulo). |
| `POST` | `/integrations/github/webhook` | firma          | —                  | Cierre de revisiones al cerrar o fusionar el PR.                                                 |

### Salud

`GET /healthcheck`, `GET /healthcheck/readiness-probe` (Mongo + S3).

## Eventos (outbox)

| Evento            | Cuándo                  | Consumidores                                                                       |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `ReviewOpened`    | `publish` o nueva ronda | Comentario en el PR y la tarjeta: «Revisión de UI lista: QR-0007 (ronda 2)» + link |
| `ReviewSubmitted` | `submit`                | Comentario en el PR y la tarjeta con el resumen por pantalla                       |
| `ReviewClosed`    | PR cerrado              | Ninguno en el MVP (métricas después)                                               |

Cada evento lleva `eventId` (idempotencia), `occurredAt` y el snapshot que necesita el consumidor.
