# Decisiones de arquitectura (ADR)

Cada decisión con su contexto y sus alternativas. Si cambia, se agrega un ADR nuevo que reemplaza al anterior; los viejos no se editan.

| #                                        | Decisión                                                      | Estado    |
| ---------------------------------------- | ------------------------------------------------------------- | --------- |
| [0001](0001-repos-y-contrato.md)         | Repos separados; el OpenAPI del API es el contrato            | Propuesta |
| [0002](0002-frontend-sveltekit.md)       | Frontend en SvelteKit 5 con las reglas de lideris-v2          | Aceptada  |
| [0003](0003-backend-nestjs-mongo.md)     | Backend en NestJS 11 + Fastify + MongoDB                      | Propuesta |
| [0004](0004-capturas-en-s3.md)           | Capturas en S3 con URLs firmadas, fuera del API               | Propuesta |
| [0005](0005-integraciones-por-outbox.md) | Integraciones (GitHub, Plane) por outbox                      | Propuesta |
| [0006](0006-skill-como-cliente.md)       | La skill de Claude Code es el cliente que crea las revisiones | Aceptada  |
| [0007](0007-roles-predefinidos.md)       | Roles predefinidos (no editables en v1)                       | Propuesta |
| [0008](0008-layouts-y-templates.md)      | La carpeta de rutas decide el chrome; templates puros         | Propuesta |
