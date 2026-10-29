# qa-reviewer

Plataforma para que **diseño (UI/UX) revise los cambios visuales del frontend** antes de que lleguen a producción.

El dev ejecuta la skill `/design-review` en su sesión de Claude Code. La skill captura las pantallas que tocó la feature (antes y después, a 1024 / 1280 / 1440 px), redacta qué mirar en cada una y sube el paquete. Diseño revisa cada pantalla, la aprueba o pide ajustes, y su feedback vuelve como comentario al PR de GitHub y a la tarjeta de Plane.

## Piezas

| Pieza                      | Repo                                                                    | Stack                                                                     |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Plataforma web (este repo) | `qa-reviewer`                                                           | SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind v4 + shadcn-svelte |
| API                        | [`qa-reviewer-api`](https://github.com/kevin-martineze/qa-reviewer-api) | NestJS 11 + Fastify + MongoDB (Mongoose) + S3                             |
| Skill de captura           | `qa-reviewer-api/skill` (en construcción)                               | Skill de Claude Code + Playwright                                         |

## Arrancar

```bash
pnpm install
pnpm dev                      # con el mock en memoria (sin API): http://localhost:5173
```

Contra el API real (ver [`qa-reviewer-api`](https://github.com/kevin-martineze/qa-reviewer-api)):

```bash
# en qa-reviewer-api
pnpm demo                     # API + Mongo en memoria + datos de demo en :3000
# en este repo
REVIEWS_SOURCE=api API_URL=http://localhost:3000 pnpm dev
```

Cuentas de demo (contraseña `demo1234`): `laura.rios@ejemplo.co` (admin y líder de diseño), `kevin@ejemplo.co` (developer), `andres.pena@ejemplo.co` (diseñador), `camila.torres@ejemplo.co` (lectora), `valentina.ruiz@ejemplo.co` (owner).

## Documentación

Lee la arquitectura antes de escribir código:

- [Requisitos del producto (PRD)](docs/product/prd.md)
- [Visión general y flujos](docs/architecture/README.md)
- [Dominio y manifiesto](docs/architecture/domain.md)
- [Contrato del API](docs/architecture/api.md)
- [Arquitectura del frontend](docs/architecture/frontend.md) · [layouts](docs/architecture/layouts.md) · [patrones](docs/architecture/patterns.md) · [algoritmos](docs/architecture/algorithms.md)
- [Arquitectura del backend](https://github.com/kevin-martineze/qa-reviewer-api/tree/main/docs) (en el repo del API)
- [Seguridad y privacidad](docs/architecture/security.md)
- [Decisiones (ADR)](docs/adr/)

> El repo es público: nunca subas capturas con datos reales, tokens ni archivos `.env`.
