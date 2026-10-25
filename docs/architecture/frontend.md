# Arquitectura del frontend

Stack: **SvelteKit 2 + Svelte 5 (runes) + TypeScript strict + Tailwind v4 + shadcn-svelte**, con las mismas reglas duras que `lideris-v2` (su `CLAUDE.md` es la referencia). Este documento fija lo propio de qa-reviewer. La estructura visual (layout de ruta, templates, guards y errores por segmento) está en [layouts.md](layouts.md).

## Principios

1. **El servidor es la fuente de verdad.** Los datos se cargan en `+page.server.ts` y las mutaciones van por form actions con `use:enhance`. El navegador no llama al API: solo el server de SvelteKit lo hace, con el token de la sesión.
2. **Puertos y adaptadores** para el API. Las rutas dependen de una interfaz (`ReviewsGateway`), no de `fetch`. Mientras no exista el API se usa el adaptador `mock` con paquetes de ejemplo; después, el adaptador `http`.
3. **Lógica de negocio en funciones puras** (`$lib/domain`), probadas con Vitest. Componentes y rutas solo orquestan.
4. **Estado de UI en la URL** (filtros, pantalla abierta, modo de comparación), para que un link lleve exactamente a lo que se está viendo.

## Capas

```
routes/            +page.server.ts (load/actions) · +page.svelte (composición)
   │  usa
   ▼
$lib/server/       gateway.ts  → elige el adaptador (REVIEWS_SOURCE=mock|api)
   │               adapters/http/*  (apiClient → Result<T>)
   │               adapters/mock/*  (fixtures en memoria)
   ▼  implementan
$lib/api/          ports.ts    (interfaces ReviewsGateway, FeedbackGateway, AuthGateway)
                   types.ts    (tipos del contrato; generados desde OpenAPI cuando exista)
$lib/domain/       funciones puras: progreso, permisos, agregación de veredictos, anclas
$lib/schemas/      zod de los formularios (comentario, veredicto, login, token)
$lib/components/   atoms → molecules → organisms → templates
$lib/stores/       estado de UI efímero (.svelte.ts); nunca hacen fetch
```

Reglas de dependencia:

- `routes` → `server`, `domain`, `components`, `schemas`.
- `server/adapters` → `api` (tipos y puertos), nunca → `components`.
- `domain` no importa nada de SvelteKit ni del API: recibe tipos y devuelve valores.
- `components` no importa `server`.
- `templates/` no importa `$app/*`, `$lib/api`, `$lib/domain`, `$lib/stores` ni `organisms/` (ESLint `no-restricted-imports`).

## Patrones

| Patrón                                   | Dónde                                                                             | Para qué                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Puertos y adaptadores**                | `$lib/api/ports.ts` + `$lib/server/adapters/{http,mock}`                          | Desarrollar y probar la UI sin API, y cambiar a `http` sin tocar rutas                 |
| **Result\<T\>**                          | `apiClient` y los adaptadores                                                     | Ningún adaptador lanza; cada caller hace `if (!result.ok)` (igual que lideris-v2)      |
| **Funciones puras de dominio**           | `$lib/domain/*`                                                                   | `reviewProgress`, `canSubmit`, `verdictSummary`, `nextPendingScreen`, `anchorToPixels` |
| **Strategy (modo de comparación)**       | `organisms/compare/` con `side-by-side`, `slider`, `toggle` registrados por clave | Agregar un modo (p. ej. diferencia) sin tocar el visor                                 |
| **Templates con regiones como snippets** | `$lib/components/templates/*`                                                     | Un layout llena las regiones de un template; ver [layouts.md](layouts.md)              |
| **Form actions + enhance**               | veredicto, comentario, envío                                                      | Funciona sin JS; con JS es optimista y sin recarga                                     |

## Rutas

| Ruta                          | Contenido                                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`                      | Login (form action → `AuthGateway.login` → cookie `httpOnly`)                                                                           |
| `/invite/[token]`             | Aceptar invitación y definir contraseña                                                                                                 |
| `/recover/[[token]]`          | Pedir enlace y definir contraseña nueva                                                                                                 |
| `/`                           | Bandeja: revisiones asignadas a mí y pendientes (reviewer) o mis revisiones (autor)                                                     |
| `/notifications`              | Notificaciones (no leídas)                                                                                                              |
| `/reviews`                    | Listado con filtros en la URL: estado, proyecto, autor, búsqueda                                                                        |
| `/reviews/[id]`               | Pantallas (tab por defecto): grilla de pantallas con veredicto, progreso y «Enviar revisión»; filtro «solo lo que cambió» (`?changed=`) |
| `/reviews/[id]/summary`       | Resumen del flujo                                                                                                                       |
| `/reviews/[id]/rounds`        | Historial de rondas                                                                                                                     |
| `/reviews/[id]/feedback`      | Feedback para Claude Code                                                                                                               |
| `/reviews/[id]/activity`      | Actividad                                                                                                                               |
| `/reviews/[id]/branch`        | Rama y PR                                                                                                                               |
| `/reviews/[id]/screens/[key]` | Visor: antes/después (`?compare=`, `?mode=`), ronda (`?round=`), veredicto y hilo con anclas                                            |
| `/metrics`                    | Métricas del equipo                                                                                                                     |
| `/projects/[slug]/settings/*` | Configuración del proyecto (miembros, asignación, SLA, integraciones, reglas)                                                           |
| `/admin/*`                    | Organización: usuarios, roles, auditoría                                                                                                |
| `/settings/*`                 | Cuenta propia: perfil, notificaciones, tokens                                                                                           |

## Estructura

```
src/
├── hooks.server.ts                 sesión → locals.user; refresh del token
├── lib/
│   ├── api/
│   │   ├── ports.ts                interfaces de los gateways
│   │   └── types.ts                contrato (→ generated/ cuando exista el OpenAPI)
│   ├── server/
│   │   ├── gateway.ts              factory por REVIEWS_SOURCE
│   │   ├── session.ts              cookie, refresh, guard
│   │   └── adapters/
│   │       ├── http/               client.ts, reviews.ts, feedback.ts, auth.ts
│   │       └── mock/               store en memoria + fixtures/lider-628/*
│   ├── domain/                     review-progress.ts, permissions.ts, anchors.ts (+ .test.ts)
│   ├── schemas/                    comment.ts, verdict.ts, login.ts, token.ts
│   ├── components/
│   │   ├── ui/                     shadcn-svelte (no editar)
│   │   ├── atoms/                  wrappers de marca
│   │   ├── molecules/              VerdictBadge, ViewportTag, ScreenThumb, CommentItem
│   │   ├── organisms/              ReviewCover, ScreenGrid, ReviewScreenViewer,
│   │   │                           compare/*, AnnotationLayer, CommentThread,
│   │   │                           VerdictControl, review/ReviewHeader,
│   │   │                           review/RoundBanner, review/SubmitReviewBar
│   │   └── templates/              AppShell, AuthTemplate, ListTemplate, DetailTemplate,
│   │                               ViewerTemplate, SettingsTemplate, DashboardTemplate
│   ├── stores/                     viewer.svelte.ts (zoom, ancla en curso)
│   └── utils/                      cn, fechas
└── routes/
    ├── +layout.svelte              <title> desde meta, Toaster (sin chrome)
    ├── +error.svelte               error sin shell
    ├── (public)/
    │   ├── +layout.svelte          AuthTemplate
    │   ├── login/
    │   ├── invite/[token]/
    │   └── recover/[[token]]/
    └── (app)/
        ├── +layout.server.ts       guard de sesión + datos del shell
        ├── +layout.svelte          AppShell
        ├── +page.svelte            bandeja
        ├── notifications/
        ├── reviews/
        │   ├── +page.svelte        listado (filtros en la URL)
        │   └── [id]/
        │       ├── +layout.server.ts   datos de la revisión
        │       ├── (detail)/           DetailTemplate (cabecera, tabs, envío)
        │       │   ├── +page.svelte    pantallas
        │       │   └── summary/ rounds/ feedback/ activity/ branch/
        │       └── screens/[key]/      ViewerTemplate (load + actions verdict, comment)
        ├── metrics/                DashboardTemplate
        ├── projects/[slug]/settings/   SettingsTemplate
        ├── admin/                  SettingsTemplate (usuarios, roles, auditoría)
        └── settings/               SettingsTemplate (perfil, notificaciones, tokens)
```

## Decisiones de UI

- **Rango objetivo 1280–1920**: el reviewer trabaja en escritorio. El visor prioriza el ancho de la imagen.
- **Imágenes**: URLs firmadas con TTL de 15 min. Si una expira, el visor vuelve a ejecutar `invalidate` en lugar de mostrar una imagen rota.
- **Anclas**: se guardan en fracciones 0–1 de la imagen `after` (independientes del zoom). `anchorToPixels` las proyecta.
- **Atajos de teclado**: `A` aprobar, `R` pedir ajuste, `J/K` siguiente/anterior pantalla, `C` comentar.
- **Accesibilidad**: el veredicto nunca se comunica solo con color (texto + ícono).

## Contrato de tipos

- Mientras no exista el API, `$lib/api/types.ts` refleja [api.md](api.md) a mano y los fixtures `mock` lo cumplen.
- Cuando el API publique `/docs-json`, los tipos se generan con `openapi-typescript` en `$lib/api/generated/` (script `pnpm gen:api`) y `types.ts` solo los reexporta. Prohibido duplicar tipos del contrato a mano después de eso.

## Pruebas

| Nivel    | Herramienta                          | Qué cubre                                                                           |
| -------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| Unidad   | Vitest                               | `$lib/domain/*`, schemas, adaptador `mock`                                          |
| Servidor | Vitest                               | `load` y actions con un gateway falso (permisos, 403/409)                           |
| E2E      | Playwright con `REVIEWS_SOURCE=mock` | Flujo completo: abrir, comparar, comentar con ancla, aprobar o pedir ajuste, enviar |

Gates (igual que lideris-v2): `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build`.
