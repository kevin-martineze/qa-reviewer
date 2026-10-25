# qa-reviewer

Plataforma para que **diseño (UI/UX) revise los cambios visuales del frontend** antes de que lleguen a producción.

El dev ejecuta la skill `/design-review` en su sesión de Claude Code. La skill captura las pantallas que tocó la feature (antes y después, a 1024 / 1280 / 1440 px), redacta qué mirar en cada una y sube el paquete. Diseño revisa cada pantalla, la aprueba o pide ajustes, y su feedback vuelve como comentario al PR de GitHub y a la tarjeta de Plane.

## Piezas

| Pieza                      | Repo                                                                    | Stack                                                                     |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Plataforma web (este repo) | `qa-reviewer`                                                           | SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind v4 + shadcn-svelte |
| API                        | [`qa-reviewer-api`](https://github.com/kevin-martineze/qa-reviewer-api) | NestJS 11 + Fastify + MongoDB (Mongoose) + S3                             |
| Skill de captura           | dentro de `qa-reviewer-api/skill` o repo propio (por decidir)           | Skill de Claude Code + Playwright                                         |

## Documentación

Lee la arquitectura antes de escribir código:

- [Visión general y flujos](docs/architecture/README.md)
- [Dominio y manifiesto](docs/architecture/domain.md)
- [Contrato del API](docs/architecture/api.md)
- [Arquitectura del frontend](docs/architecture/frontend.md)
- [Arquitectura del backend](docs/architecture/backend.md)
- [Seguridad y privacidad](docs/architecture/security.md)
- [Decisiones (ADR)](docs/adr/)

> El repo es público: nunca subas capturas con datos reales, tokens ni archivos `.env`.
