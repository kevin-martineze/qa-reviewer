# ADR 0003 — Backend en NestJS 11 + Fastify + MongoDB

Estado: Aceptada

## Contexto

El agregado central es la revisión: pantallas, rondas, veredictos y envíos que siempre se leen y se cambian juntos. Los comentarios crecen sin límite y se consultan por pantalla.

## Decisión

- NestJS 11 sobre Fastify, con módulos por dominio y validación Joi en cada endpoint.
- MongoDB con Mongoose. La revisión es un documento con sus pantallas y rondas embebidas; comentarios, notificaciones, actividad y auditoría van en colecciones propias.
- Swagger generado desde el código: el esquema Joi que valida un body es el que se documenta.

## Alternativas descartadas

| Alternativa           | Por qué no                                                               |
| --------------------- | ------------------------------------------------------------------------ |
| Postgres + ORM        | La revisión se partiría en cinco tablas que siempre se leen juntas       |
| Express sin framework | Habría que reinventar módulos, inyección de dependencias y documentación |

## Consecuencias

- Las transacciones necesitan un replica set (en desarrollo, Mongo en memoria lo levanta solo).
- Los cambios de estado usan `findOneAndUpdate({ _id, status })` para no pisar un cambio concurrente.
