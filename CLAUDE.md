# CLAUDE.md — Reglas del proyecto

> Este archivo lo leen Claude Code, Cursor, OpenCode, Codex y cualquier asistente. **Léelo entero antes de generar código.** No son sugerencias: son las convenciones del proyecto. Cualquier desviación requiere justificación explícita del usuario.
>
> Stack: **SvelteKit 2 + Svelte 5 (runes) + TypeScript strict + Tailwind v4 + shadcn-svelte** (new-york, base slate + tokens del prototipo).

---

## 1. Reglas duras — NO NEGOCIABLES

Cualquier PR que las viole debe ser rechazado. Pre-commit y CI las bloquean automáticamente.

### TypeScript

1. **PROHIBIDO `any`.** Usa `unknown` con narrowing por type guards. La regla ESLint `@typescript-eslint/no-explicit-any: error` está activa.
2. **PROHIBIDO `as`-casts.** Solo en bordes de librerías sin tipos. Si sientes que necesitas castear, primero generaliza el tipo en su origen.
3. **PROHIBIDO `// @ts-ignore` / `// @ts-expect-error`.** La regla `@typescript-eslint/ban-ts-comment: error` está activa.
4. **PROHIBIDO `console.log`.** Solo `console.warn` / `console.error` y solo para errores genuinos, nunca con datos del usuario.

### Svelte 5

5. **Runes únicamente.** Cero `$:`, cero `export let`, cero `on:click`, cero `<slot>`. Usa `$state`, `$derived`, `$props`, `$effect`, `$bindable`, snippets + `{@render}`, `onclick={...}`.
6. **`$derived` para cualquier cálculo derivado**, nunca `$effect` con `$state =`.
7. **`$effect` solo para side effects reales:** DOM, suscripciones, timers, integraciones externas. Nunca para sincronizar props con state.
8. **PROHIBIDO declarar subcomponentes dentro de otro componente.** Sácalos a su archivo. Causa remount y pérdida de foco.
9. **`{#each items as item (key)}` siempre con key.** Sin key, Svelte re-renderiza todo el `each` por cualquier cambio.
10. **Props con `interface Props` tipada.** Nunca desestructures `$props()` sin tipo.

### Data fetching

11. **Data en `+page.server.ts` / `+layout.server.ts`.** El cliente NO hace `fetch` a la API en el initial load. Las únicas excepciones permitidas son interacciones post-hydration que disparan `goto(url)`.
12. **Mutaciones vía form actions** + `use:enhance`. Cero `fetch` manual para escribir.
13. **Los gateways (`$lib/api/ports.ts`) retornan `Result<T>`.** Cada caller hace narrowing con `if (!result.ok)`. Nunca lances excepciones desde un adapter.
14. **Errores en load: `throw error(status, message)`** de `@sveltejs/kit`. El `+error.svelte` los renderiza. Nunca `throw new Error(...)` plano.

### Estado

15. **Stores NUNCA hacen fetch.** Se hidratan desde `+layout.server.ts`. La fuente de verdad es el servidor (mock o http).
16. **Filtros, paginación y ordering en `URLSearchParams`,** no en `$state`. Permite back/forward, refresh y compartir URL.
17. **PROHIBIDO mutar `$props()`.** Si necesitas estado local que parte de un prop, cópialo a `$state`.

### UI

18. **Primitivas shadcn-svelte vía átomos propios.** shadcn-svelte instala en `$lib/components/ui/*` (no editar a mano). Para CADA primitiva existe un átomo equivalente en `$lib/components/atoms/<name>/` que la re-exporta. **Los consumidores SIEMPRE importan del átomo, NUNCA de `ui/` directo.** Razón: centralizar overrides de marca (tokens, sizing, cursor, animaciones, hover) en un solo lugar. Si shadcn-svelte no expone el componente, sigue creando el átomo respetando la API de shadcn-react para que la migración futura sea solo cambiar imports.
19. **Atomic design para composiciones propias:** `atoms → molecules → organisms → templates`. Un componente solo importa de niveles inferiores. Los `atoms/` son las primitivas envueltas en el punto anterior.
20. **Tokens Tailwind v4 únicamente.** Usa `bg-background`, `text-foreground`, `bg-primary`, `border`, `text-muted-foreground`, `bg-success-soft`, `text-danger`, etc. CERO `bg-[#…]`, CERO `text-[12px]`.
21. **`cn()` para clases dinámicas.** Cero concatenación manual de strings de Tailwind.
22. **Iconos: solo `@lucide/svelte`.** Cero emojis en UI.
23. **`type="button"` explícito** en cualquier `<button>` o `<Button>` que NO sea el submit de un form. Sin esto se disparan submits accidentales.

### Forms

24. **Schemas zod en `$lib/schemas/`** una sola vez por entidad.
25. **Superforms para forms no triviales.** Para forms simples basta con form action + validación inline + `fail(400, {error})`.
26. **`disabled={$submitting}` en TODO botón submit.**

### Imports

27. **Path alias `$lib/`** para todo lo de `src/lib/`. Cero rutas relativas largas (`../../lib/...`).
28. **Orden de imports:**
    1. Tipos (`import type ...`)
    2. `svelte`, `svelte/*`, `@sveltejs/*`
    3. Librerías externas
    4. `$app/*`, `$env/*`
    5. `$lib/*`
    6. Relativos `./`

    Línea en blanco entre grupos. ESLint lo verifica.

### Naming

29. **Componentes Svelte:** `PascalCase.svelte`.
30. **Archivos TS:** `kebab-case.ts` o `camelCase.ts` consistente por carpeta. Stores siempre con extensión `.svelte.ts` (la requiere Svelte 5 para parsear runes).
31. **Rutas SvelteKit:** filesystem conventions (`+page.svelte`, `+page.server.ts`, `+layout.*`, `+server.ts`, `[param]`, `(group)`).

### Responsive

32. **Rango objetivo actual: 1280–1920px.** Móvil/tablet es fase futura: no garantices pantallas bajo 1280 todavía.
33. **Mobile-first.** Las clases base son para la pantalla más chica; se ensancha con `sm:`/`md:`/`lg:`/`xl:`. Nunca al revés (`max-*:`).
34. **No hardcodees tamaños de texto** (refuerza la regla 20): usa tokens y la escala del prototipo.
35. **Tablas: scroll horizontal** cuando el contenido lo requiera. No inventes vista tarjeta ni ocultamiento de columnas por página.

---

## 2. Reglas específicas de qa-reviewer

### Layouts y templates

La estructura de rutas, los templates y las reglas de navegación están definidas en `docs/architecture/layouts.md`. **Antes de crear una ruta, un template o un componente de navegación, lee ese documento.** Resumen de las reglas que se aplican en código:

1. **Grupos `(public)` y `(app)`:** las rutas públicas (login, etc.) van en `(public)`, las autenticadas en `(app)`.
2. **Todo lo que está dentro de `(app)` requiere sesión.** El guard vive en `(app)/+layout.server.ts` (`requirePermission`), que redirige a `/login` sin sesión.
3. **Templates:** AppShell (sidebar + contenido), AuthTemplate (centrado), ListTemplate, DetailTemplate (tabs), ViewerTemplate (visor de pantallas), SettingsTemplate, DashboardTemplate. Un `+page.svelte` usa su template, no repite el layout.
4. **Los templates son puros:** `src/lib/components/templates/**` NO puede importar `$app/*`, `$lib/api`, `$lib/domain`, `$lib/stores`, ni `organisms`. ESLint lo bloquea (`no-restricted-imports`).
5. **Prohibido `page.url.pathname` en `+layout.svelte`.** La selección de item activo del sidebar se calcula en el servidor (`+layout.server.ts`) y se pasa como prop. ESLint lo bloquea (`no-restricted-syntax`).
6. **Fuera de `(app)` sin sesión → redirect a `/login`** en `hooks.server.ts` o en el layout raíz.

### Arquitectura de datos (ports & adapters)

- `$lib/api/ports.ts` define las **interfaces de gateway** (Reviews, Feedback, Auth, Directory, Notifications, Reports). Las rutas dependen solo de estas interfaces, nunca de un adapter concreto.
- `$lib/server/gateway.ts` selecciona el adapter según `REVIEWS_SOURCE` (env): `mock` por defecto, `http` (esqueleto con TODO) para el backend real.
- `$lib/server/adapters/mock/` es el adapter en memoria: seeds tipados desde el prototipo, reset al reiniciar el servidor, implementa todos los ports y respeta la matriz de permisos de `docs/architecture/users-and-roles.md` (403/409 incluidos).
- **El autor no puede emitir veredicto sobre su propio trabajo** (regla de negocio del mock).
- Los permisos se resuelven en `$lib/domain/permissions.ts` (matriz + `can()`); los guards de sesión viven en `$lib/server/guards.ts`.

### Datos sensibles (repo público)

- **NO metas capturas reales de Lideris en el repo.** Usa imágenes sintéticas en `static/fixtures/`.
- Si necesitas probar con capturas reales, ponlas en `fixtures-private/` en la raíz (está en `.gitignore`). Nunca bajo `static/`: se copia al build y queda público.
- Las contraseñas semilla son solo de mock: van en un archivo de seeds, nunca en `.env`.

---

## 3. Estructura del proyecto

```
src/
├── app.css                      Tokens shadcn (slate) + tokens del prototipo (Tailwind v4 @theme)
├── app.d.ts                     App.Locals (user, permissions), App.PageData (meta)
├── app.html                     Shell HTML mínimo
├── hooks.server.ts              Lee cookie de sesión, hidrata locals.user
│
├── lib/
│   ├── api/
│   │   ├── types.ts             Contrato de dominio (Organization, Review, Screen, …)
│   │   └── ports.ts             Interfaces de gateway (Promise<Result<T>>)
│   ├── components/
│   │   ├── ui/                  shadcn-svelte primitives (no editar, no importar directo)
│   │   ├── atoms/               Wrappers de marca sobre ui/* — únicos importables
│   │   ├── molecules/           Composiciones de ui/ sin estado de negocio
│   │   ├── organisms/           Composiciones con stores, form actions
│   │   └── templates/           Layouts de página (AppShell, AuthTemplate, …)
│   ├── domain/                  Lógica pura: permissions, review-progress, verdicts, follow-ups, anchors
│   ├── server/
│   │   ├── adapters/mock/       Adapter en memoria (seeds, store, ports)
│   │   ├── gateway.ts           Selección mock/http
│   │   ├── session.ts           Sesión mock (login/logout)
│   │   └── guards.ts            requirePermission()
│   ├── stores/                  Reactive classes (.svelte.ts)
│   └── utils/                   Funciones puras (cn, result, fechas…)
│
└── routes/
    ├── +layout.server.ts        Hidrata user
    ├── +layout.svelte           Toaster global, hidrata stores
    ├── +error.svelte            Boundary global
    │
    ├── (public)/                login, recovery…
    └── (app)/                   Autenticado (AppShell)
        ├── +layout.server.ts    Guard: redirect a /login sin user
        ├── +layout.svelte       AppShell con sidebar
        └── …                    Pantallas del producto
```

---

## 4. Patrones objetivo (cómo hacerlo bien)

### 4.1 Página de lectura simple

```ts
// src/routes/(app)/reviews/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { gateway } from '$lib/server/gateway';

export const load: PageServerLoad = async ({ locals }) => {
  const result = await gateway(locals).reviews.list({});
  if (!result.ok) throw error(result.error.status || 500, result.error.message);
  return { reviews: result.data };
};
```

### 4.2 Form con mutación

```ts
// +page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { commentSchema } from '$lib/schemas/comment';
import { gateway } from '$lib/server/gateway';

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(commentSchema));
    if (!form.valid) return fail(400, { form });
    const result = await gateway(locals).feedback.addComment(form.data);
    if (!result.ok) return fail(result.error.status || 400, { form, error: result.error.message });
    throw redirect(303, `/reviews/${form.data.reviewId}`);
  },
};
```

### 4.3 Filtros en URLSearchParams

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  let q = $state(page.url.searchParams.get('q') ?? '');

  function apply() {
    const url = new URL(page.url);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    goto(url, { keepFocus: true, noScroll: true });
  }
</script>
```

---

## 5. Antipatrones explícitos (prohibidos)

1. `export let` / `$:` / `on:click` / `<slot>` / `bind:value` sin `$bindable` — Svelte 4 legacy.
2. `$effect` para computed — usar `$derived`.
3. `fetch` manual desde `+page.svelte` — usar form actions o re-trigger via `goto`.
4. Rutas relativas largas (`../../components/...`) — usar `$lib/*`.
5. Hex/rgb hardcoded en componentes — usar tokens (`text-primary`, `bg-success-soft`).
6. Emojis en UI — usar `@lucide/svelte`.
7. Inline `style="..."` salvo cálculo dinámico ineludible.
8. `any` sin justificación.
9. Importar de un nivel superior en atomic design.
10. Stores que hacen `fetch`.
11. Lógica de negocio en `+page.svelte` — delegar a organisms.
12. Concatenar clases Tailwind manualmente — usar `cn()`.
13. `{#each}` sin key.
14. Acceder a `window`/`document`/`localStorage` sin SSR guard.
15. Editar archivos en `src/lib/components/ui/` a mano. Si necesitas un cambio, sobreescribe en una composición de nivel superior o ejecuta `shadcn-svelte add` con el flag de overwrite.
16. Capturas reales de Lideris en el repo — usar `static/fixtures/` (sintético) o `fixtures-private/` (raíz, gitignored).

---

## 6. Gates automáticos

- **Pre-commit (husky + lint-staged):** ESLint con `--max-warnings 0`, grep que bloquea `console.log` / `: any` / `as any` / `@ts-ignore`, `svelte-check --threshold error --fail-on-warnings`.
- **CI (GitHub Actions):** `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build`. Branch protection requiere los 5 verdes.

Si un gate falla, NO uses `--no-verify`. Arregla la causa raíz.

---

## 7. Recordatorio final para asistentes de IA

Si estás a punto de escribir:

- `export let prop` → **STOP**, usar `let { prop } = $props()`.
- `$: doubled = count * 2` → **STOP**, usar `$derived`.
- `on:click={fn}` → **STOP**, usar `onclick={fn}`.
- `<slot />` → **STOP**, usar snippets + `{@render children()}`.
- `fetch('/api/...')` en `+page.svelte` → **STOP**, hacerlo en `+page.server.ts` o usar form action.
- `style="color: #1c3d99"` → **STOP**, usar `class="text-primary"`.
- `console.log(...)` → **STOP**, quitar antes de mergear.
- `any` → **STOP**, usar `unknown` o un tipo concreto.
- Importar `../../components/...` → **STOP**, usar `$lib/components/...`.
- Crear un Button/Input/Card propio → **STOP**, usar el átomo de `$lib/components/atoms/`.
- `import { Button } from '$lib/components/ui/button'` → **STOP**, importar desde `$lib/components/atoms/button`. La carpeta `ui/` solo la consumen los átomos. Si la primitiva no tiene átomo aún, créalo antes de importar.
- Importar `$app/*` o `$lib/api` en `$lib/components/templates/**` → **STOP**, los templates son puros.
- `page.url.pathname` en un `+layout.svelte` → **STOP**, calcular el item activo en el servidor.

Antes de crear cualquier ruta o componente, **lee uno similar existente** y replica el patrón. Si dudas, pregunta.
