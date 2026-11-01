# qa-reviewer · guía para escribir código

Guía para personas y asistentes de IA. Léela antes de tocar el código: describe cómo está construido el frontend y qué se rechaza en revisión. Si una regla estorba, se discute y se cambia aquí; no se salta en silencio.

- Stack: SvelteKit 2, Svelte 5 con runes, TypeScript estricto, Tailwind v4 y shadcn-svelte (estilo new-york sobre slate, con los tokens propios de `app.css`).
- Arquitectura y flujos: [`docs/architecture/`](docs/architecture/README.md). Decisiones con sus alternativas: [`docs/adr/`](docs/adr/README.md).
- API: [`qa-reviewer-api`](https://github.com/kevin-martineze/qa-reviewer-api). Este repo nunca habla con la base de datos ni con S3: solo con el API, y siempre desde el servidor.

---

## 1. Cómo se piensa este frontend

1. **El servidor manda.** Los datos se cargan en `+page.server.ts` o `+layout.server.ts` y las escrituras van por form actions. El navegador no llama al API.
2. **Las rutas dependen de interfaces.** `$lib/api/ports.ts` define los gateways; `$lib/server/gateway.ts` elige el adaptador (`mock` o `api`). Ninguna ruta conoce `fetch` ni la URL del API.
3. **La lógica vive en funciones puras** (`$lib/domain`), con pruebas. Rutas y componentes solo orquestan.
4. **Lo que se ve está en la URL.** Filtros, página, orden, pantalla abierta y modo de comparación van en `URLSearchParams`, así funcionan atrás/adelante, recargar y compartir el link.
5. **La carpeta de la ruta decide el chrome.** Ver [`docs/architecture/layouts.md`](docs/architecture/layouts.md).

## 2. TypeScript

| Regla                                  | Cómo se hace                                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Sin `any`                              | `unknown` y un type guard. ESLint: `@typescript-eslint/no-explicit-any`.                                        |
| Sin `as`                               | Solo en el borde con una librería sin tipos. Si hace falta castear, el tipo de origen está mal: arréglalo allá. |
| Sin `@ts-ignore` ni `@ts-expect-error` | ESLint: `@typescript-eslint/ban-ts-comment`.                                                                    |
| Sin `console.log`                      | `console.warn` / `console.error` solo para fallos reales y nunca con datos de personas.                         |

## 3. Svelte 5

- Solo runes: `$state`, `$derived`, `$props`, `$bindable`, `$effect`. Nada de `export let`, `$:`, `on:evento` ni `<slot>`; los eventos son atributos (`onclick={...}`) y el contenido se pasa con snippets y `{@render ...}`.
- Un valor calculado es `$derived`. `$effect` queda para efectos de verdad (DOM, timers, suscripciones, librerías externas), nunca para copiar un valor en otro `$state`.
- Las props se tipan con `interface Props` y no se mutan. Si un componente necesita un estado que arranca de una prop, la copia a `$state`.
- Un componente por archivo. Declarar un componente dentro de otro lo remonta en cada render y se pierde el foco.
- Todo `{#each}` lleva clave: `{#each items as item (item.id)}`.
- `window`, `document` y `localStorage` solo dentro de `$effect` o con un guard de navegador: el primer render es en el servidor.

## 4. Datos y estado

- **Lectura:** `load` en el servidor. Un fallo del API sale con `unwrap(result, url)` o `throwApiError` de `$lib/server/guards`, que traducen el status (401 → login, 403, 404, 410, 503) a `error()` de SvelteKit. Nunca `throw new Error(...)` en un `load`.
- **Escritura:** form action + `use:enhance`. Respuesta estándar: `{ message }` si salió bien, `fail(status, { error })` si no; el layout de `(app)` lo convierte en toast. Los errores por campo van aparte y se pintan junto al campo.
- **Gateways:** devuelven `Result<T>`. Quien llama hace `if (!result.ok)`. Un adaptador nunca lanza.
- **Sin stores globales que pidan datos.** El estado compartido sale del layout del servidor o de la URL. Lo efímero (un diálogo abierto, un pin a medio poner) es `$state` local.
- **Permisos dos veces:** el `load` del segmento corta con `requirePermission` (experiencia) y cada action lo vuelve a validar (seguridad). El API valida una tercera vez.

## 5. Componentes y estilos

- **Diseño atómico:** `atoms → molecules → organisms → templates`. Cada nivel importa solo de los de abajo.
- **shadcn-svelte vive en `components/ui/`** y no se edita a mano ni se importa desde fuera de `atoms/`. Cada primitiva tiene su átomo en `components/atoms/<nombre>/`, que la reexporta y concentra los ajustes de marca. Si falta el átomo, se crea antes de usar la primitiva. Si shadcn-svelte no trae un componente, el átomo se escribe con la misma API que tendría en shadcn.
- **Templates puros** (`components/templates/**`): no importan `$app/*`, `$lib/api`, `$lib/domain`, `$lib/stores` ni organisms. Reciben regiones como snippets y datos de presentación como props. ESLint lo bloquea.
- **Solo tokens de Tailwind:** `bg-background`, `text-muted-foreground`, `bg-success-soft`, `text-danger`… Sin colores (`bg-[#…]`) ni tamaños de texto arbitrarios (`text-[12px]`), y sin `style="..."` salvo un valor calculado que no tenga clase.
- **Clases condicionales con `cn()`**, nunca concatenando strings.
- **Íconos de `@lucide/svelte`.** Sin emojis en la interfaz.
- **`type="button"`** en todo botón que no envíe su formulario.

## 6. Formularios

- Un esquema zod por entidad en `$lib/schemas/`. El mismo esquema valida en la action.
- Formularios simples: action + `safeParse` + `fail(400, { errors })`. Formularios grandes: superforms.
- Todo botón de envío se deshabilita mientras envía.

## 7. Imports y nombres

- `$lib/...` para todo lo de `src/lib`; nada de `../../`.
- Orden, con una línea en blanco entre grupos (ESLint lo revisa): `import type` → `svelte` y `@sveltejs/*` → paquetes externos → `$app/*` y `$env/*` → `$lib/*` → relativos `./`.
- Componentes en `PascalCase.svelte`. Archivos TS en `kebab-case.ts` (o `camelCase.ts`, igual en toda la carpeta). Clases reactivas en `.svelte.ts`. Rutas con las convenciones de SvelteKit.

## 8. Pantallas

- Hoy se soporta escritorio de 1280 a 1920 px. Bajo 1024 px la app muestra el aviso «solo computador»; móvil y tablet son una fase posterior.
- Las clases base son para la pantalla más angosta y se amplía con `sm:`/`md:`/`lg:`/`xl:`. Nunca `max-*:`.
- Una tabla ancha hace scroll horizontal. No se convierte en tarjetas ni se esconden columnas.

## 9. Rutas y layouts

Antes de crear una ruta, un template o algo de navegación, lee [`layouts.md`](docs/architecture/layouts.md). Lo esencial:

- `(public)`: sin sesión (login, invitación, recuperación). `(app)`: con sesión; `hooks.server.ts` y `(app)/+layout.server.ts` mandan a `/login` a quien no la tenga.
- Un chrome distinto es otro grupo `(nombre)`, no un `if` sobre la URL. `page.url.pathname` está prohibido en `+layout.svelte` (ESLint): el ítem activo del menú se calcula en el servidor.
- Cada `+page.svelte` usa un template del catálogo (`AppShell`, `AuthTemplate`, `ListTemplate`, `DetailTemplate`, `ViewerTemplate`, `SettingsTemplate`, `DashboardTemplate`) y no repite su estructura.

## 10. Datos del API y del mock

- `$lib/api/types.ts` es el contrato; `ports.ts`, las operaciones. Cuando el API publique su OpenAPI, los tipos se generan y no se escriben a mano.
- `$lib/server/adapters/mock/` es un API en memoria con las mismas reglas que el real: permisos por proyecto, 403/404/409/410 y que el autor no pueda dar veredicto a su propio trabajo. Se reinicia con el servidor.
- `REVIEWS_SOURCE=api` y `API_URL` cambian al API real sin tocar rutas ni componentes.

## 11. Datos sensibles (el repo es público)

- Nada de capturas con datos reales. Las imágenes sintéticas van en `static/fixtures/`.
- Las capturas de productos reales para la demo pasan antes por `scripts/capture-lideris.mjs`, que las anonimiza (`static/demo/lideris/`), y se revisan a ojo antes de commitear.
- Sesiones, tokens y capturas sin anonimizar van en `fixtures-private/` (en la raíz e ignorado por git). Nunca bajo `static/`: todo lo de ahí se publica con el build.
- Las contraseñas de ejemplo existen solo en las semillas del mock, nunca en `.env`.

## 12. Gates

- **Pre-commit** (husky + lint-staged): Prettier, ESLint sin warnings, un grep que bloquea `console.log`, `any` y `@ts-ignore`, y `svelte-check` sin errores ni warnings.
- **CI:** `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test` y `pnpm build`. Antes de cerrar una fase, también `pnpm test:e2e`.
- Si un gate falla, se arregla la causa. Nunca `--no-verify`.

## 13. Antes de escribir

Busca una ruta o componente parecido y sigue su patrón. Si algo no encaja en estas reglas, pregunta antes de inventar una excepción.
