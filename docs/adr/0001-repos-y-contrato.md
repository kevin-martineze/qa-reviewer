# ADR 0001 — Repos separados; el OpenAPI del API es el contrato

Estado: Aceptada

## Contexto

La plataforma tiene tres clientes del mismo modelo: la web de revisión (este repo), la skill que crea las revisiones desde Claude Code y las integraciones (GitHub, Plane). Si el modelo vive dentro de la web, la skill tendría que hablar con la base de datos o con rutas internas de SvelteKit.

## Decisión

- Dos repos: `qa-reviewer` (web) y `qa-reviewer-api` (API, worker e integraciones).
- El contrato es el OpenAPI que el API genera desde su código (`/docs-json`). La web toma sus tipos de ahí; mientras se construye, `$lib/api/types.ts` lo refleja a mano y el adaptador `mock` lo cumple.
- La web nunca toca la base de datos ni el storage: solo el API.

## Alternativas descartadas

| Alternativa                               | Por qué no                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| Monorepo con la API en rutas de SvelteKit | La skill dependería del ciclo de despliegue de la web y de su sesión por cookie |
| Contrato escrito a mano en los dos lados  | Se desincroniza; el OpenAPI generado no                                         |

## Consecuencias

- Un cambio de contrato se hace primero en el API y luego se regeneran los tipos del front.
- Las pruebas e2e del front corren contra el mock y contra el API real.
