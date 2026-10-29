# ADR 0008 — La carpeta de rutas decide el chrome; templates puros

Estado: Propuesta

## Contexto

qa-reviewer tiene pantallas con chromes muy distintos: el login centrado, el shell con barra lateral, el detalle de una revisión con cabecera y pestañas, y el visor, que necesita todo el ancho. Cuando una app crece, lo fácil es decidir el chrome con condiciones dentro de un layout:

- un `if` sobre `page.url.pathname` que quita la barra lateral en ciertas rutas;
- una lista de rutas «especiales» que esconden la cabecera o las pestañas;
- un store global donde cada página registra qué partes del chrome quiere;
- templates que importan tipos del dominio y quedan atados a una sola pantalla.

Esos atajos esconden qué chrome tiene cada ruta y fallan en SSR: un store de módulo lo comparten todas las peticiones del servidor.

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
