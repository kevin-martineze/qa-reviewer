# Layouts y templates

Cómo se arma la estructura visual del frontend. La meta es que **la carpeta de una ruta diga qué chrome tiene, qué datos comparte y quién puede entrar**, sin condiciones escondidas en el código.

## Tres piezas, tres responsabilidades

| Pieza              | Dónde                                            | Responsabilidad                                                                       | No hace                                                                   |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Layout de ruta** | `routes/**/+layout.svelte` + `+layout.server.ts` | Guard, datos compartidos por el segmento, elegir el template y llenarlo con organisms | Markup propio (más allá de llamar al template), condiciones sobre la URL  |
| **Template**       | `$lib/components/templates/*`                    | Estructura visual: regiones (snippets), espaciado, scroll, sticky, ancho              | Cargar datos, leer `page`, stores, tipos de dominio, organisms de negocio |
| **Página**         | `routes/**/+page.svelte` + `+page.server.ts`     | Datos de su vista, actions, `meta` (título, migas) y composición del contenido        | Tocar el chrome del padre, abrir su propio contenedor de scroll           |

Regla corta: **el layout decide, el template dibuja, la página llena.**

## Árbol de rutas

```
src/routes/
├── +layout.svelte                    raíz: <title> desde page.data.meta, Toaster. Sin chrome.
├── +error.svelte                     error sin shell (sin sesión o fallo del shell)
│
├── (public)/                         sin sesión
│   ├── +layout.server.ts             con sesión → redirect a /
│   ├── +layout.svelte                AuthTemplate
│   ├── login/
│   ├── invite/[token]/               aceptar invitación y definir contraseña
│   └── recover/[[token]]/            pedir enlace · definir contraseña nueva
│
└── (app)/                            con sesión
    ├── +layout.server.ts             user, permisos, proyectos, personas, no leídas · depends('app:session', 'app:notifications')
    ├── +layout.svelte                AppShell
    ├── +error.svelte                 error dentro del shell (la navegación sigue a mano)
    ├── +page.*                       Bandeja                                  ListTemplate
    ├── session/                      sin página: actions logout, project, switchUser (mock) que dispara el shell
    ├── notifications/                actions open, markAllRead (también las usa la campana)     ListTemplate
    ├── reviews/
    │   ├── +page.*                   Listado (filtros en la URL)              ListTemplate
    │   └── [id]/
    │       ├── +layout.server.ts     revisión, comentarios, diseñadores, permisos (data.can) · depends('review:<id>')
    │       ├── (detail)/             todo lo que lleva cabecera + tabs
    │       │   ├── +layout.svelte    DetailTemplate: cabecera, banner de ronda, tabs, barra de envío
    │       │   ├── +error.svelte     falla una tab sin perder la cabecera
    │       │   ├── +page.*           Pantallas            /reviews/QR-0012 · actions assign, priority, submit, reopen
    │       │   ├── summary/          Resumen
    │       │   ├── rounds/           Rondas
    │       │   ├── feedback/         Para Claude Code
    │       │   ├── activity/         Actividad
    │       │   └── branch/           Rama y PR
    │       └── screens/[key]/        Visor: ViewerTemplate. No está bajo (detail), así que no lleva tabs.
    │           └── +page.*           load de la pantalla · actions verdict, comment, reply, resolve, followUp, delete
    ├── metrics/                      guard reports:view                       DashboardTemplate
    ├── projects/[slug]/settings/
    │   ├── +layout.server.ts         guard projects:configure
    │   ├── +layout.svelte            SettingsTemplate (general, miembros, asignación, SLA, integraciones, reglas)
    │   └── members/ assignment/ sla/ integrations/ rules/
    ├── admin/                        organización
    │   ├── +layout.server.ts         guard users:invite
    │   ├── +layout.svelte            SettingsTemplate (usuarios, roles, auditoría)
    │   └── users/ roles/ audit/
    └── settings/                     cuenta propia
        ├── +layout.svelte            SettingsTemplate (perfil, notificaciones, tokens)
        └── profile/ notifications/ tokens/
```

Por qué así:

- **`(detail)` separa el visor de las tabs.** `/reviews/[id]` y `/reviews/[id]/screens/[key]` comparten los datos de la revisión (`[id]/+layout.server.ts`), pero solo las tabs llevan cabecera y navegación. Ninguna condición sobre `pathname`: lo decide la carpeta.
- **`[id]` no tiene `+layout.svelte`.** Solo comparte datos, no chrome. Un layout que solo hace `{@render children()}` sobra.
- **Un guard por segmento.** `admin/`, `metrics/` y `projects/[slug]/settings/` cortan en su `+layout.server.ts`; la página ni se intenta dibujar.

## Catálogo de templates

| Template            | Regiones (snippets)                                    | Props                                        | Lo usa                                          |
| ------------------- | ------------------------------------------------------ | -------------------------------------------- | ----------------------------------------------- |
| `AppShell`          | `sidebar(collapsed)`, `topbar`, `children`             | `crumbs`, `collapsed?`, `onToggle?`          | `(app)/+layout`                                 |
| `AuthTemplate`      | `children`, `footer?`                                  | `title`, `description?`                      | `(public)/+layout`                              |
| `ListTemplate`      | `actions?`, `filters?`, `children`, `pagination?`      | `title`, `description?`                      | bandeja, revisiones, notificaciones             |
| `DetailTemplate`    | `header`, `banner?`, `children`, `footer?`, `pending?` | `tabs`, `currentTab`, `loading?`             | `reviews/[id]/(detail)`                         |
| `ViewerTemplate`    | `toolbar`, `children` (lienzo), `aside?`, `footer?`    | —                                            | `screens/[key]`                                 |
| `SettingsTemplate`  | `children`, `actions?`                                 | `title`, `description?`, `nav`, `currentNav` | `admin`, `settings`, `projects/[slug]/settings` |
| `DashboardTemplate` | `filters?`, `kpis?`, `children`                        | `title`, `description?`                      | `metrics`                                       |

Dentro de `SettingsTemplate` y `DashboardTemplate`, cada bloque es un `SettingsSection` (molecule: título, descripción, `actions?`, `footer?` con el botón Guardar). No es un template: no maneja scroll ni regiones de página.

Un template nuevo se agrega solo si ninguno de estos sirve. Va con su caso en este archivo.

## Reglas

### 1. La carpeta decide el chrome, no un `if` sobre la URL

Si una ruta necesita otro chrome, va en otro grupo `(nombre)`. Un reset `+page@grupo.svelte` es el último recurso y se comenta por qué.

```svelte
<!-- ✗ Prohibido -->
{#if page.url.pathname.includes('/screens/')}
  {@render children()}
{:else}
  <DetailTemplate …>{@render children()}</DetailTemplate>
{/if}
```

El gate de ESLint bloquea `page.url.pathname` dentro de `+layout.svelte`.

### 2. El template es puro

- Recibe regiones como snippets y datos de presentación como props: strings, listas de links o `boolean`.
- No importa `$app/*`, `$lib/api`, `$lib/domain`, `$lib/stores` ni `organisms/`. ESLint lo bloquea con `no-restricted-imports` en `templates/**`.
- Puede usar atoms y molecules para su propio chrome (`PageHeader`, `NavTabs`).
- La tab activa llega como prop (`currentTab`). El template no la deduce de la URL.

```svelte
<!-- $lib/components/templates/DetailTemplate.svelte (markup) -->
<div class="flex h-full min-h-0 flex-col">
  <!-- Un solo scroll: la cabecera se va con el contenido y las pestañas quedan pegadas arriba. -->
  <div data-scroll class="min-h-0 flex-1 overflow-y-auto" aria-busy={loading}>
    <div class="space-y-4 px-6 pt-6">
      {@render header()}
      {@render banner?.()}
    </div>
    <div class="sticky top-0 z-10 bg-background px-6 pt-4">
      <NavTabs items={tabs} current={currentTab} />
    </div>
    <div class="px-6 py-5">
      {#if loading && pending}
        {@render pending()}
      {:else}
        {@render children()}
      {/if}
    </div>
  </div>
  {#if footer}
    <footer class="shrink-0 border-t bg-background px-6 py-3">{@render footer()}</footer>
  {/if}
</div>
```

La cabecera y el banner se desplazan con el contenido y las pestañas quedan fijas (`sticky top-0`) dentro del mismo scroll. Así, en una laptop de 720 px de alto, la grilla de pantallas no queda aplastada bajo una cabecera fija.

### 3. El layout llena el template con organisms

```svelte
<!-- routes/(app)/reviews/[id]/(detail)/+layout.svelte (resumido) -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { LayoutData } from './$types';

  import { resolve } from '$app/paths';
  import { navigating, page } from '$app/state';

  import ReviewHeader from '$lib/components/organisms/review/ReviewHeader.svelte';
  import RoundBanner from '$lib/components/organisms/review/RoundBanner.svelte';
  import SubmitReviewBar from '$lib/components/organisms/review/SubmitReviewBar.svelte';
  import DetailTemplate from '$lib/components/templates/DetailTemplate.svelte';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  const id = $derived(data.review.id);
  // El id de ruta incluye el grupo: resolve('/(app)/reviews/[id]/(detail)/summary', { id }).
  const tabs = $derived([
    {
      key: 'screens',
      label: `Pantallas (${data.review.screens.length})`,
      href: resolve('/(app)/reviews/[id]/(detail)', { id }),
    },
    {
      key: 'summary',
      label: 'Resumen',
      href: resolve('/(app)/reviews/[id]/(detail)/summary', { id }),
    },
    // … rounds, feedback, activity, branch
  ]);
  const currentTab = $derived(page.data.meta?.tab ?? 'screens');
  // Skeleton solo al cambiar de pestaña dentro de la misma revisión.
  const loading = $derived(
    navigating.to !== null &&
      navigating.to.params?.id === id &&
      (navigating.to.route.id ?? '').startsWith('/(app)/reviews/[id]/(detail)') &&
      navigating.to.route.id !== navigating.from?.route.id,
  );
</script>

{#snippet header()}<ReviewHeader review={data.review} … can={data.can} />{/snippet}
{#snippet banner()}<RoundBanner review={data.review} … canReopen={data.can.reopen} />{/snippet}
{#snippet footer()}<SubmitReviewBar review={data.review} />{/snippet}

<DetailTemplate
  {header}
  {banner}
  {tabs}
  {currentTab}
  {loading}
  footer={data.can.verdict ? footer : undefined}
>
  {@render children()}
</DetailTemplate>
```

### 4. Una hija no inyecta UI en el padre

Nada de stores singleton para que una página «registre» acciones, filtros o un rail en el layout. En SSR, un singleton de módulo lo comparten las peticiones concurrentes.

- Si la acción es de la página, va en el contenido de la página.
- Si es del segmento, va en el layout.
- Si de verdad hace falta comunicar hija → padre, el layout crea una clase `$state` y la expone con `setContext`. Así hay una instancia por árbol, no una por módulo.

### 5. Datos: en el layout solo lo que usa el chrome o varias hijas

- `[id]/+layout.server.ts` carga la cabecera, la lista de pantallas (para la grilla y para anterior/siguiente del visor), la ronda y los permisos sobre la revisión (`data.can`).
- Lo propio de cada tab va en su `+page.server.ts`: actividad, feedback generado, historial de rondas.
- Si una página necesita algo del padre, llama a `await parent()` **después** de lanzar sus propias peticiones, para no armar una cascada.
- Los `load` que otros pueden querer recargar declaran su llave: `depends('app:session', 'app:notifications')` en `(app)`, `depends('app:notifications')` en notificaciones y `depends('review:<id>')` en la revisión.
- Después de una form action con `use:enhance`, SvelteKit recarga todo (`invalidateAll`). Para refrescos sin action (p. ej. un polling futuro de notificaciones) se usa `invalidate('app:notifications')`.

### 6. El guard del layout es UX; el permiso se valida en cada action

SvelteKit **no** ejecuta los `load` de los layouts antes de una action. Un guard solo en el `+layout.server.ts` deja las actions abiertas.

- `hooks.server.ts`: sin sesión y `event.route.id` bajo `/(app)` → redirect a `/login`. Cubre loads y actions.
- `+layout.server.ts` del segmento: `requirePermission(locals, 'projects:configure', params.slug)` para cortar temprano y con un 403 claro.
- Cada action: `requirePermission(…)` otra vez, con el proyecto de la URL o de la revisión. En los ajustes del proyecto lo hace `saveProject()` (`$lib/server/project-settings.ts`). El API también lo valida; el front no es la última barrera.

### 7. `meta` sale del `load` de la página

Cada `+page.server.ts` devuelve `meta: { title, crumbs?, tab? }`, con el tipo `App.PageData` en `app.d.ts`.

- El layout raíz pinta `<title>{meta.title} · QA Reviewer</title>`.
- `AppShell` pinta las migas.
- `(detail)` marca la tab activa.

Ninguna página escribe su propio `<svelte:head>` ni deduce la tab de la URL.

### 8. El template es dueño del scroll

- Cada template define un solo contenedor con scroll (`min-h-0 flex-1 overflow-y-auto`).
- Las páginas no usan `h-screen`, `overflow-*` ni `sticky` para el chrome.
- `ViewerTemplate` es la excepción documentada: el lienzo y el aside tienen scroll propio; la página no.

### 9. Estado local que depende del parámetro → URL o `{#key}`

Al ir de `/reviews/QR-0012` a `/reviews/QR-0013`, SvelteKit **reusa** los componentes del layout. El `$state` local sobrevive y muestra datos de la revisión anterior.

- Lo que se puede compartir va en la URL: «Solo lo que cambió» (`?changed=1`), comparación del visor (`?compare=previous|base&mode=side|slider|toggle`), comentario abierto (`?comment=c1`), filtros de listas (`?view=…&q=…&page=…`), pestaña de notificaciones (`?tab=unread`) y periodo de métricas (`?range=30`).
- Lo efímero (pin en curso, capas del visor) se reinicia al cambiar de pantalla.
- Un formulario que edita una copia de los props (p. ej. las reglas de asignación) se monta dentro de `{#key data.project}`: la copia en `$state` se descarta sola cuando el server devuelve lo guardado.

### 10. Errores en el nivel donde se pueden mostrar

| Archivo                               | Cubre                                    | El usuario conserva                       |
| ------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| `+error.svelte` (raíz)                | fallo del shell o sin sesión             | nada (pantalla simple con link al inicio) |
| `(app)/+error.svelte`                 | revisión inexistente, 403 de un segmento | sidebar y topbar                          |
| `reviews/[id]/(detail)/+error.svelte` | falla una tab                            | cabecera de la revisión y las tabs        |

Un `+error.svelte` se dibuja **dentro** de los layouts superiores al segmento que falló. Si falla el `load` de `[id]`, se usa el de `(app)`.

### 11. Mutaciones y avisos

- SvelteKit no admite actions en un `+layout.server.ts`. Lo que dispara el chrome tiene su ruta: `/session` (cerrar sesión, cambiar de proyecto) y `/notifications` (abrir, marcar leídas). Las acciones de la revisión viven en `(detail)/+page.server.ts` y los formularios del header apuntan ahí con `action="{base}?/assign"`.
- Respuesta estándar: `{ message }` si salió bien y `fail(status, { error })` si no. Un solo `$effect` en `(app)/+layout.svelte` las convierte en toast (`formFeedback`).
- Errores por campo van aparte (`{ errors }`, `{ inviteErrors }`…) y se pintan junto al campo con `FormField`, no en un toast. Si el form vive en un diálogo, la página lo reabre cuando llegan errores.
- Confirmaciones destructivas: `ConfirmDialog` (molecule) con los inputs ocultos como snippet `fields`.

## Atajos que evitamos

| Atajo                                                               | Problema                                         | En qa-reviewer                                  |
| ------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| Un `if` sobre `pathname` en el layout decide si hay shell           | El chrome depende de una condición escondida     | Grupo propio con su layout (regla 1)            |
| Una lista de rutas que quitan cabecera o pestañas                   | Lo mismo, y la lista se desactualiza             | Grupo `(detail)` (regla 1)                      |
| Un store global donde cada página registra su menú lateral          | Estado de módulo compartido entre peticiones SSR | El layout pasa el snippet al template (regla 4) |
| Un template que importa tipos del dominio                           | El template solo sirve para una pantalla         | Template puro (regla 2)                         |
| Cabecera y pestañas escritas a mano dentro de cada `+layout.svelte` | El markup se duplica entre detalles              | `DetailTemplate` reutilizable (regla 3)         |

## Pruebas

- **Templates**: prueba de componente con snippets falsos (`createRawSnippet`). Verifica que las regiones opcionales no dejen huecos y que solo haya un contenedor con scroll.
- **Guards**: prueba de servidor que llama la action sin permiso → 403, aunque el layout no haya corrido.
- **E2E (Playwright)**, en `e2e/`: login y errores, shell, listas, detalle, visor y ajustes. Corren contra el mock en un servidor propio (`pnpm test:e2e`, puerto 4317) y en serie, porque el mock guarda el estado en memoria.

## Checklist para un PR con rutas nuevas

- [ ] ¿El `+layout` comparte chrome, datos o guard? Si no, no existe.
- [ ] ¿El chrome distinto sale de un grupo y no de un `if` sobre la URL?
- [ ] ¿La página usa un template del catálogo? Si es uno nuevo, ¿está agregado aquí?
- [ ] ¿El template no importa `$app/*`, api, domain, stores ni organisms?
- [ ] ¿Cada action valida su permiso, además del guard del layout?
- [ ] ¿El `load` devuelve `meta.title` y declara su `depends`?
- [ ] ¿Hay un solo contenedor de scroll, el del template?
- [ ] ¿El `+error.svelte` está en el nivel que conserva el chrome correcto?
