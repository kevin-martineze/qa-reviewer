# Arquitectura del frontend

Stack: **SvelteKit 2 + Svelte 5 (runes) + TypeScript strict + Tailwind v4 + shadcn-svelte**, con las mismas reglas duras que `lideris-v2` (su `CLAUDE.md` es la referencia). Este documento fija lo propio de qa-reviewer. La estructura visual (layout de ruta, templates, guards y errores por segmento) está en [layouts.md](layouts.md).

## Principios

1. **El servidor es la fuente de verdad.** Los datos se cargan en `+page.server.ts` y las mutaciones van por form actions con `use:enhance`. El navegador no llama al API: solo el server de SvelteKit lo hace, con el token de la sesión.
2. **Puertos y adaptadores** para el API. Las rutas dependen de una interfaz (`ReviewsGateway`), no de `fetch`. Mientras no exista el API se usa el adaptador `mock` con paquetes de ejemplo; después, el adaptador `http`.
3. **Lógica de negocio en funciones puras** (`$lib/domain`), probadas con Vitest. Componentes y rutas solo orquestan.
4. **Estado de UI en la URL** (filtros, pantalla abierta, modo de comparación, comentario abierto), para que un link lleve exactamente a lo que se está viendo.
5. **Listo para el API real.** Todas las vistas funcionan con el mock. Pasar a `REVIEWS_SOURCE=api` (con `API_URL`) solo cambia el adaptador; ninguna ruta ni componente se toca.

## Capas

```
routes/            +page.server.ts (load/actions) · +page.svelte (composición)
   │  usa
   ▼
$lib/server/       gateway.ts         elige el adaptador (REVIEWS_SOURCE=mock|api)
   │               guards.ts          requireUser, requirePermission, unwrap, throwApiError
   │               action-result.ts   toastResult, apiFail, field(s): respuesta estándar de actions
   │               project-settings.ts  projectMeta, saveProject (ajustes del proyecto)
   │               review-meta.ts     meta de las pestañas de una revisión
   │               session.ts         cookies de sesión y de proyecto
   │               adapters/http/*    apiClient → Result<T>
   │               adapters/mock/*    store en memoria con las mismas reglas del API
   ▼  implementan
$lib/api/          ports.ts    Reviews, Feedback, Auth, Directory, Tokens, Notifications, Reports
                   types.ts    tipos del contrato (generados desde OpenAPI cuando exista)
                   result.ts   Result<T>, ok, err
$lib/domain/       funciones puras: permisos, habilidades sobre una revisión, plazos, progreso,
                   veredictos, anclas, texto para Claude Code y las queries de cada URL
$lib/schemas/      zod de los formularios: auth, password, comment, admin, project, account, roles
$lib/components/   atoms → molecules → organisms → templates
$lib/utils/        cn, fechas (zona Bogotá, sin depender de ICU), group-by-day, form-feedback, chart
```

No hay `$lib/stores`: todo el estado sale del server (layout de `(app)`) o vive en la URL. El estado efímero (pin en curso, diálogos) es `$state` local.

Reglas de dependencia:

- `routes` → `server`, `domain`, `components`, `schemas`.
- `server/adapters` → `api` (tipos y puertos), nunca → `components`.
- `domain` no importa nada de SvelteKit ni del API: recibe tipos y devuelve valores.
- `components` no importa `server`.
- `templates/` no importa `$app/*`, `$lib/api`, `$lib/domain`, `$lib/stores` ni `organisms/` (ESLint `no-restricted-imports`).

## Patrones

| Patrón                                   | Dónde                                                                          | Para qué                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Puertos y adaptadores**                | `$lib/api/ports.ts` + `$lib/server/adapters/{http,mock}`                       | Desarrollar y probar la UI sin API, y cambiar a `http` sin tocar rutas                                              |
| **Result\<T\>**                          | `apiClient`, adaptadores, `unwrap` en los loads                                | Ningún adaptador lanza; cada caller hace `if (!result.ok)` o `unwrap()` (→ `error()` de SvelteKit)                  |
| **Funciones puras de dominio**           | `$lib/domain/*`                                                                | `permissionsFor`, `reviewAbilities`, `dueState`, `progressOf`, `awaitingFollowUp`, `feedbackText`, `anchorToPixels` |
| **Query en la URL**                      | `review-query`, `viewer-query`, `audit-query`, `metrics-query`, `user-filters` | `parse*Query(params)` y `*QueryHref(current, patch)`: un filtro nuevo vuelve a la página 1                          |
| **Strategy (modo de comparación)**       | `organisms/compare/` → `COMPARE_MODES`                                         | `side`, `slider` y `toggle` con las mismas props; agregar un modo no toca el visor                                  |
| **Templates con regiones como snippets** | `$lib/components/templates/*`                                                  | Un layout llena las regiones de un template; ver [layouts.md](layouts.md)                                           |
| **Form actions + enhance**               | todas las mutaciones                                                           | Funcionan sin JS; con JS, sin recarga. `{ message }` / `fail({ error })` → toast global                             |
| **Átomos como punto de override**        | `atoms/*`                                                                      | `Table` trae la sombra de scroll; las variantes `data-checked`… se mapean en `app.css` a `data-state` de bits-ui    |

## Rutas

| Ruta                          | Contenido                                                                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`                      | Login (form action → `auth.login` → cookie `httpOnly`); en mock, botones de cuentas demo                                                                                                                |
| `/invite/[token]`             | Aceptar invitación y definir contraseña; estados vencida, usada y revocada                                                                                                                              |
| `/recover/[[token]]`          | Pedir enlace y definir contraseña nueva                                                                                                                                                                 |
| `/`                           | Bandeja por permisos: asignadas a mí, vencidas del equipo, mis revisiones                                                                                                                               |
| `/notifications`              | Todas, no leídas y menciones (`?tab=`), agrupadas por día                                                                                                                                               |
| `/reviews`                    | Listado con filtros en la URL: estado, proyecto, asignada, autor, prioridad, vencidas, búsqueda, orden, página                                                                                          |
| `/reviews/[id]`               | Pantallas (pestaña por defecto) con veredicto y progreso; «solo lo que cambió» (`?changed=1`); asignar, prioridad, enviar, reabrir                                                                      |
| `/reviews/[id]/summary`       | Resumen del flujo y reglas                                                                                                                                                                              |
| `/reviews/[id]/rounds`        | Historial de rondas y envíos                                                                                                                                                                            |
| `/reviews/[id]/feedback`      | Texto para Claude Code, copiable                                                                                                                                                                        |
| `/reviews/[id]/activity`      | Actividad                                                                                                                                                                                               |
| `/reviews/[id]/branch`        | Rama, PR y check                                                                                                                                                                                        |
| `/reviews/[id]/screens/[key]` | Visor: comparar (`?compare=none\|previous\|base`, `?mode=side\|slider\|toggle`), comentario abierto (`?comment=`), capas de diff e inspector, veredicto, comentarios anclados, respuestas y seguimiento |
| `/metrics`                    | KPIs, revisiones por semana, pendientes por diseñador y ajustes por módulo (`?range=`, `?project=`)                                                                                                     |
| `/projects/[slug]/settings/*` | General, miembros, asignación (reglas por módulo), SLA, integraciones, reglas de diseño y datos sensibles                                                                                               |
| `/admin/*`                    | Organización: usuarios e invitaciones (`?status=`, `?q=`), matriz de roles, auditoría (`?type=`, `?actor=`)                                                                                             |
| `/settings/*`                 | Cuenta: perfil y contraseña, cerrar todas las sesiones, preferencias de correo, tokens de la skill                                                                                                      |
| `/session`                    | Sin página: actions del shell (cerrar sesión, cambiar de proyecto, cambiar de usuario en mock)                                                                                                          |

## Estructura

```
src/lib/components/
├── ui/              shadcn-svelte (no editar, no importar fuera de atoms/)
├── atoms/           re-export de ui/* con overrides de marca (Table con scroll-x-hint)
├── molecules/       AvatarStack, ChartLegend, ConfirmDialog, CopyButton, EmptyState, FilterSelect,
│                    FormField, FormSelect, AutoSubmitSelect, NavTabs, Notice, PageHeader, Pagination,
│                    PasswordInput, ProgressMeter, SettingsSection, StatTile, SwitchField, ToneBadge,
│                    UserAvatar
├── organisms/
│   ├── shell/       SidebarNav, ProjectSelector, NotificationBell, UserMenu
│   ├── reviews/     ReviewRow, ReviewsTable, ReviewFiltersBar
│   ├── review/      ReviewHeader, RoundBanner, SubmitReviewBar, ScreenCard
│   ├── viewer/      AnnotatedScreen, VerdictControl, CommentThread, CommentComposer
│   ├── compare/     SideBySide, Slider, Toggle (COMPARE_MODES)
│   ├── notifications/ NotificationItem
│   ├── admin/       UsersTable, InviteDialog, InvitationsList, PermissionMatrix, AuditLog
│   ├── project/     MembersTable, AddMemberDialog, AssignmentForm
│   ├── account/     TokensTable, CreateTokenDialog, TokenSecretDialog
│   ├── metrics/     WeeklyChart, DesignerLoad, ModuleChanges
│   └── ErrorState
└── templates/       AppShell, AuthTemplate, ListTemplate, DetailTemplate, ViewerTemplate,
                     SettingsTemplate, DashboardTemplate
```

El árbol de rutas está en [layouts.md](layouts.md#árbol-de-rutas).

## Decisiones de UI

- **Rango objetivo 1280–1920**: el reviewer trabaja en escritorio. El visor prioriza el ancho de la captura y limita el lienzo al ancho del viewport capturado.
- **Imágenes**: en el API, URLs firmadas con TTL de 15 min. Pendiente al integrar: si una expira, el visor debe volver a cargar con `invalidate('review:<id>')` en vez de mostrar una imagen rota.
- **Anclas**: fracciones 0–1 de la captura de la ronda actual (independientes del zoom). El componente se detecta en el server a partir de `screen.elements`, no lo manda el navegador.
- **Atajos del visor**: `A` aprobar, `R` pedir ajuste (pulsar el activo lo devuelve a pendiente), `C` comentar, `I` inspector, `D` diff, `←`/`→` o `J`/`K` pantallas, `T` alternar en modo «Alternar», `Esc` cancelar. Se ignoran dentro de inputs y con un diálogo abierto.
- **Fechas**: zona fija America/Bogotá y texto armado a mano («20 oct», «4:58 p. m.»), para que server y navegador pinten lo mismo. `now` llega del layout.
- **Gráficos**: paleta validada con la skill dataviz (categórica `viz-1`/`viz-2`, crítico `viz-critical`, en claro y oscuro), sin doble eje, tooltip en hover y foco, y tabla equivalente.
- **Accesibilidad**: el veredicto nunca se comunica solo con color (texto + ícono); cada gráfico tiene su tabla.

## Contrato de tipos

- Mientras no exista el API, `$lib/api/types.ts` refleja [api.md](api.md) a mano y el mock lo cumple.
- Cuando el API publique `/docs-json`, los tipos se generan con `openapi-typescript` en `$lib/api/generated/` (script `pnpm gen:api`) y `types.ts` solo los reexporta. Prohibido duplicar tipos del contrato a mano después de eso.

## Pruebas

| Nivel    | Herramienta                                     | Qué cubre                                                                                                                                        |
| -------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unidad   | Vitest                                          | `$lib/domain/*`, schemas, utils, templates, sesión                                                                                               |
| Servidor | Vitest                                          | Pendiente: `load` y actions con un gateway falso (permisos, 403/409)                                                                             |
| E2E      | Playwright (`pnpm test:e2e`, mock, puerto 4317) | Login y errores, shell, listas, detalle, visor (comparar, comentar con ancla, veredicto, seguimiento), organización, proyecto, cuenta y métricas |

Gates: `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build` y, antes de cada commit de fase, `pnpm test:e2e`.
