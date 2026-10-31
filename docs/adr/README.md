# Decisiones de arquitectura (ADR)

Cada decisión con su contexto y sus alternativas. Si cambia, se agrega un ADR nuevo que reemplaza al anterior; los viejos no se editan.

| #                                        | Decisión                                                      | Estado    |
| ---------------------------------------- | ------------------------------------------------------------- | --------- |
| [0001](0001-repos-y-contrato.md)         | Repos separados; el OpenAPI del API es el contrato            | Aceptada  |
| [0002](0002-frontend-sveltekit.md)       | Frontend en SvelteKit 5 con reglas duras propias              | Aceptada  |
| [0003](0003-backend-nestjs-mongo.md)     | Backend en NestJS 11 + Fastify + MongoDB                      | Aceptada  |
| [0004](0004-capturas-en-s3.md)           | Capturas fuera del API, con URLs firmadas                     | Aceptada  |
| [0005](0005-integraciones-por-outbox.md) | Integraciones (GitHub, Plane, correo) por outbox              | Aceptada  |
| [0006](0006-skill-como-cliente.md)       | La skill de Claude Code es el cliente que crea las revisiones | Aceptada  |
| [0007](0007-roles-predefinidos.md)       | Roles predefinidos (no editables en v1)                       | Aceptada  |
| [0008](0008-layouts-y-templates.md)      | La carpeta de rutas decide el chrome; templates puros         | Propuesta |
| [0009](0009-sesiones-opacas.md)          | Sesiones de la web con token opaco                            | Aceptada  |
| [0010](0010-ids-legibles.md)             | Ids legibles para revisiones y proyectos                      | Aceptada  |
