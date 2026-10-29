# Arquitectura del backend

La arquitectura del API vive en su repo, junto al código que describe:

- [Arquitectura](https://github.com/kevin-martineze/qa-reviewer-api/blob/main/docs/architecture.md): módulos, capas, flujo de un request, eventos y jobs.
- [PRD del API](https://github.com/kevin-martineze/qa-reviewer-api/blob/main/docs/prd.md): capacidades, reglas que garantiza y requisitos no funcionales.
- [Patrones](https://github.com/kevin-martineze/qa-reviewer-api/blob/main/docs/patterns.md) y [algoritmos](https://github.com/kevin-martineze/qa-reviewer-api/blob/main/docs/algorithms.md).
- [Modelo de datos](https://github.com/kevin-martineze/qa-reviewer-api/blob/main/docs/data-model.md) y [operación](https://github.com/kevin-martineze/qa-reviewer-api/blob/main/docs/operations.md).

Resumen: NestJS 11 sobre Fastify, MongoDB con Mongoose, validación Joi, OpenAPI generado desde el código (`/docs-json`), capturas en S3 o disco local con URLs firmadas, outbox para GitHub, Plane y correo. Las decisiones compartidas con este repo están en los [ADR](../adr/README.md).
