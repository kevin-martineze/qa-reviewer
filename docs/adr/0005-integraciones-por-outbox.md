# ADR 0005 — Integraciones por outbox

Estado: Aceptada

## Contexto

Publicar o enviar una revisión dispara comentarios en el PR, en la tarjeta y correos. Si esas llamadas van dentro del request, una caída de GitHub tumba el envío del diseñador.

## Decisión

- El comando escribe el cambio de estado y el evento (`ReviewOpened`, `ReviewSubmitted`, `ReviewClosed`, `NotificationCreated`) en la misma transacción (`qa_outbox`).
- Un worker entrega los eventos a los notificadores (GitHub, Plane, correo) con reintentos y espera exponencial; tras 8 intentos el evento queda `dead`.
- Cada notificador decide si le interesa el evento (`supports`) y es idempotente por `eventId`.

## Consecuencias

- Los comentarios en el PR llegan unos segundos después, no en el mismo request.
- Agregar Slack u otro canal es un notificador más; el worker no cambia.
