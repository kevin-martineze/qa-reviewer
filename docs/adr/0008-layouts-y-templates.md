# ADR 0008 — La carpeta de rutas decide el chrome; templates puros

Estado: Propuesta

## Contexto

En lideris-v2, la estructura visual creció con atajos que mezclan la URL con el chrome:

- `(app)/+layout.svelte` usa `isTurner` para decidir si pinta el `AppShell`.
- `preorders/[id]/+layout.svelte` usa `isQuoteWizardRoute` para quitar cabecera y tabs.
- El store singleton `moduleSidebar` con `MAIN_VIEWS` registra el rail y lo oculta por ruta.
- `DetailWithSidePanel` importa DTOs clínicos, atando el template a un dominio.

Estos atajos ponen condiciones sobre `pathname` y singletons de módulo en la capa visual. Cuestan de leer (qué chrome tiene cada ruta) y rompen en SSR: un singleton de módulo lo comparten las peticiones concurrentes.

## Decisión

- **La carpeta de la ruta decide** el chrome, los datos compartidos y el guard. Un chrome distinto va en otro grupo `(nombre)`, no en un `if` sobre la URL.
- **Un catálogo de templates puros** define la estructura visual: `AppShell`, `AuthTemplate`, `ListTemplate`, `DetailTemplate`, `ViewerTemplate`, `SettingsTemplate`, `DashboardTemplate`. Cada uno recibe regiones como snippets y datos de presentación como props (strings, listas de links, `boolean`).
- **El layout de ruta elige el template y lo llena con organisms.** La página llena su contenido y devuelve `meta` desde su `load`.

## Alternativas descartadas

| Alternativa                                           | Por qué se descarta                                                                           |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Condiciones sobre `pathname` en el layout             | El chrome depende de un `if` escondido; difícil de leer y de probar                           |
| `+page@grupo.svelte` generalizado para cada excepción | Un reset es el último recurso; para chrome distinto, un grupo propio es más claro             |
| Markup inline en cada `+layout.svelte`                | Duplica cabecera y tabs entre detalles; el template lo centraliza                             |
| Store singleton para el chrome                        | Un singleton de módulo se comparte entre peticiones en SSR; además acopla la página al layout |

## Consecuencias

- Más carpetas de grupo `(nombre)` para aislar chromes distintos.
- Gates de ESLint para sostener la decisión:
  - `no-restricted-imports` en `templates/**`: bloquea `$app/*`, `$lib/api`, `$lib/domain`, `$lib/stores` y `organisms/`.
  - `no-restricted-syntax` contra `page.url.pathname` en `+layout.svelte`.
