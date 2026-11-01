# ADR 0009 — Sesiones de la web con token opaco

Estado: Aceptada

## Contexto

La primera idea era JWT de 15 minutos con refresh rotativo de 7 días. La web guarda una sola cookie `httpOnly`, pide `GET /me` en cada request y necesita «cerrar sesión en todos los dispositivos» y desactivar usuarios al instante.

## Decisión

- El login devuelve un token aleatorio (`qa_sess_…`). El API guarda solo su hash SHA-256 en `qa_sessions`, con vencimiento deslizante de 7 días.
- Cerrar sesión revoca ese token; cerrar todas revoca todas las sesiones del usuario. Desactivar a alguien revoca sus sesiones y sus tokens de la skill.
- Los tokens de la skill (`qa_pat_…`) siguen el mismo esquema en `qa_api_tokens`, atados a un proyecto.

## Alternativas descartadas

| Alternativa   | Por qué no                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------ |
| JWT + refresh | La web tendría que rotar el refresh en cada request; revocar al instante exige lista negra igual |

## Consecuencias

- Cada request autenticado hace una lectura por índice en `qa_sessions` (hash único).
- El front no cambia: sigue guardando un solo token.
