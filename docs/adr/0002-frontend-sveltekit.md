# ADR 0002 — Frontend en SvelteKit 5 con reglas duras propias

Estado: Aceptada

## Contexto

La web es SSR casi por completo: listas, detalle y visor se cargan en el servidor con el token de la sesión, y las escrituras son formularios. Hace falta un framework que haga eso sin una capa de API propia en el navegador.

## Decisión

- SvelteKit 2 con Svelte 5 (runes), TypeScript estricto, Tailwind v4 y shadcn-svelte.
- Datos en `load` del servidor y escrituras con form actions; el navegador no llama al API.
- Las reglas de código viven en el `CLAUDE.md` del repo y las hacen cumplir ESLint, `svelte-check`, un hook de pre-commit y CI.

## Alternativas descartadas

| Alternativa   | Por qué no                                                              |
| ------------- | ----------------------------------------------------------------------- |
| SPA con React | Obliga a exponer el token al navegador o a montar un BFF aparte         |
| Next.js       | Resuelve lo mismo con más peso; el equipo trabaja más cómodo con Svelte |

## Consecuencias

- El token del API vive en una cookie `httpOnly`; solo el servidor de SvelteKit lo usa.
- Todo funciona sin JavaScript; con JavaScript, sin recargas (`use:enhance`).
