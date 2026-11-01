# ADR 0010 — Ids legibles para revisiones y proyectos

Estado: Aceptada

## Contexto

La web usa el id de la revisión en la URL (`/reviews/QR-0012`) y el del proyecto en los ajustes (`/projects/lideris/settings`). Un serial por proyecto haría que dos proyectos tengan `QR-0001`.

## Decisión

- La revisión usa como `_id` un serial único en la organización: `QR-0001`, `QR-0002`… (`qa_counters`, nunca se reutiliza).
- El proyecto usa su slug como `_id` (minúsculas, números y guiones; no se cambia después de creado).
- El resto de documentos usa ids opacos (hex de ObjectId) guardados como string.

## Consecuencias

- Un link a una revisión se lee y se dicta.
- Renombrar un proyecto cambia su nombre, no su slug.
