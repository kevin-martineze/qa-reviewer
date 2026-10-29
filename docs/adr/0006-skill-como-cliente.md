# ADR 0006 — La skill de Claude Code es el cliente que crea las revisiones

Estado: Aceptada

## Contexto

Armar a mano un documento de revisión cuesta tanto que no se hace. La sesión del dev ya tiene todo: el diff, la tarjeta, el PR, un navegador con sesión y datos de prueba.

## Decisión

- `/design-review` captura las pantallas tocadas, redacta qué mirar y llama al API con un token personal (`qa_pat_…`) que vive en `QA_REVIEWER_TOKEN`.
- Habla con el API por un manifiesto versionado (`manifestVersion`), nunca con la web.
- `/design-review status` trae el feedback de vuelta a la sesión en texto.

## Consecuencias

- El manifiesto es contrato público: un cambio incompatible es una versión nueva.
- La skill reintenta; por eso crear revisiones y rondas exige `Idempotency-Key`.
