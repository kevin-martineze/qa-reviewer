# Arquitectura — visión general

## Problema

En frontend se entregan cambios visuales sin que diseño los valide. Diseño se entera tarde (en QA o en producción) y el feedback llega por chat, sin contexto ni trazabilidad. Para el dev, armar a mano un documento de revisión es costoso, así que no se hace.

## Objetivo

1. **Generar la revisión sin trabajo manual.** La skill sale del contexto que ya tiene la sesión del dev: diff, tarjeta, PR, navegador con sesión y datos de prueba.
2. **Feedback estructurado por pantalla.** Cada pantalla se aprueba o pide ajuste, con comentarios y anotaciones sobre la imagen.
3. **El feedback vuelve a donde se trabaja:** comentario en el PR, comentario en la tarjeta de Plane y `/design-review status` dentro de la sesión del dev.

## Contexto del sistema

```
┌────────────────────────────┐          ┌──────────────────────────┐
│ Sesión del dev             │          │ Diseño (UI/UX)           │
│ Claude Code + skill        │          │ navegador                │
│ /design-review             │          └────────────┬─────────────┘
└──────┬──────────────▲──────┘                       │ HTTPS (sesión)
       │ HTTPS        │ feedback                     ▼
       │ (API token)  │                 ┌──────────────────────────┐
       │              │                 │ qa-reviewer (SvelteKit)  │
       │              │                 │ SSR + form actions       │
       │              │                 └────────────┬─────────────┘
       ▼              │                              │ HTTPS (server-side)
┌──────────────────────┴───────────────────────────────▼─────────────┐
│ qa-reviewer-api (NestJS)                                           │
│ reviews · feedback · assets · auth · integrations · outbox         │
└───────┬──────────────────────┬──────────────────────┬──────────────┘
        │                      │ URLs firmadas         │ outbox worker
        ▼                      ▼                       ▼
   MongoDB (qa_*)        S3 (bucket privado)     GitHub API · Plane API
                         capturas antes/después   (comentarios en PR y tarjeta)
```

- La skill y la plataforma **nunca** hablan entre sí: ambas usan el API.
- Las imágenes **no pasan por el API**: se suben y se leen con URLs firmadas de S3.
- Las integraciones (GitHub, Plane) se disparan por **eventos del outbox**, no desde el request.

## Flujos principales

### 1. Crear una revisión (skill)

```
skill                          API                           S3
  │ POST /v1/reviews           │                              │
  │ (manifiesto, Idempotency-Key)                             │
  │───────────────────────────▶│ valida (cadena) → Review     │
  │                            │ status=draft                 │
  │◀───────────────────────────│ uploads[]: URL PUT firmada   │
  │ PUT captura (una por imagen)─────────────────────────────▶│
  │ POST /v1/reviews/:id/publish                              │
  │───────────────────────────▶│ HEAD de cada objeto ────────▶│
  │                            │ draft → open + outbox        │
  │◀───────────────────────────│ ReviewOpened                 │
  │ link de la revisión        │ worker: comenta en el PR y la tarjeta
```

### 2. Revisar (diseño)

1. Abre la revisión: portada, resumen del flujo y lista de pantallas.
2. En cada pantalla compara antes y después (lado a lado, deslizador o alternar), anota sobre la imagen y marca **Aprobado** o **Requiere ajuste**.
3. Pulsa **Enviar revisión**. Igual que en GitHub, los veredictos se acumulan y se notifican una sola vez: `open|in_review → approved | changes_requested`, y el outbox lanza `ReviewSubmitted`.

### 3. Feedback de vuelta (dev)

- El worker del outbox comenta en el PR y en la tarjeta: resumen, pantallas con ajuste y link.
- `/design-review status` trae los comentarios a la sesión del dev para corregir.
- Tras corregir, `/design-review` sobre la misma rama crea una **nueva ronda** (`round + 1`). Solo se recapturan las pantallas que cambiaron y el resto conserva su veredicto.

## Documentos

| Documento | Contenido |
|---|---|
| [domain.md](domain.md) | Modelo, estados, reglas y manifiesto v1 |
| [api.md](api.md) | Endpoints, autenticación, errores y versionado |
| [frontend.md](frontend.md) | Capas, patrones y estructura de SvelteKit |
| [layouts.md](layouts.md) | Layouts de ruta, templates, guards y errores por segmento |
| [backend.md](backend.md) | Módulos, capas y patrones de NestJS |
| [security.md](security.md) | Datos sensibles, tokens, almacenamiento |
| [../adr/](../adr/) | Decisiones con sus alternativas |

## Fuera de alcance del MVP

- Tiempo real (los reviewers recargan; después SSE).
- Login con GitHub/Google (MVP: usuario y contraseña emitidos por un admin).
- Diff visual automático píxel a píxel.
- Bloquear el merge del PR hasta la aprobación (después: check de GitHub).
