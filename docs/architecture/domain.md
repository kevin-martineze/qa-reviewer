# Dominio

## Lenguaje común

| Término                   | Significado                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Proyecto**              | Un producto revisado (p. ej. Lideris). Conecta un repo de GitHub y un proyecto de Plane.                                                   |
| **Revisión** (`Review`)   | El paquete de una feature: PR, tarjeta, rama y sus pantallas. Una por PR.                                                                  |
| **Ronda** (`round`)       | Cada envío del dev dentro de la misma revisión. La ronda 1 es la primera; tras un pedido de ajustes, la siguiente sube solo lo que cambió. |
| **Pantalla** (`Screen`)   | Un estado visual a revisar: ruta + estado + tamaño (p. ej. «Modo edición, 1280×720»).                                                      |
| **Captura** (`Capture`)   | Imagen `before` (base del PR) o `after` (rama) de una pantalla. `before` es opcional (pantallas nuevas).                                   |
| **Notas**                 | Lo que la skill redacta por pantalla: `changes` (qué ver) y `questions` (preguntas para UI).                                               |
| **Veredicto** (`verdict`) | `pending`, `approved` o `changes_requested`, por pantalla y por ronda.                                                                     |
| **Comentario**            | Texto de un reviewer sobre una pantalla, opcionalmente anclado a una zona de la imagen.                                                    |
| **Envío** (`submission`)  | El acto de «Enviar revisión»: congela los veredictos de la ronda y notifica una sola vez.                                                  |
| **Estado no capturado**   | Estado descrito en texto que no se pudo capturar (guardando, error, toast…).                                                               |

## Agregados

```
Project 1───* Review 1───* Screen 1───* Capture
                 │            │
                 │            └──* Comment  (colección aparte; puede crecer)
                 └──* Submission (historial de envíos por ronda)
```

- **Review** es el agregado raíz. Las pantallas y sus veredictos van **embebidos**, porque siempre se leen y se cambian con la revisión. Los comentarios van en su propia colección (`qa_comments`) para que el documento no crezca sin límite.
- **Snapshots, no joins**: el PR (número, título, base, head, autor) y la tarjeta (clave, título) se copian en la revisión al crearla. Las notificaciones no consultan GitHub ni Plane para armar su texto.
- Número legible por proyecto: `QR-0001`, `QR-0002`… (`qa_counters`, nunca se reutiliza).

## Estados

### Revisión

```
          publish                 primer veredicto
 draft ───────────▶ open ───────────────────▶ in_review
   │                 ▲                           │
   │ (24 h sin       │ nueva ronda               │ submit
   │  publicar)      │                           ▼
   ▼                 └──────────── changes_requested
 expired                                         │
                     approved ◀──── submit ──────┘ (si todo aprobado)
                        │
   PR merged/closed     ▼
 (cualquiera) ───────▶ closed
```

| Transición                      | Quién               | Guarda                                                        |
| ------------------------------- | ------------------- | ------------------------------------------------------------- |
| `draft → open`                  | skill (`publish`)   | Todas las capturas declaradas existen en S3                   |
| `draft → expired`               | cron                | 24 h sin publicar; se borran los objetos subidos              |
| `open → in_review`              | reviewer            | Primer veredicto o comentario de la ronda                     |
| `in_review → approved`          | reviewer (`submit`) | Todas las pantallas de la ronda `approved`                    |
| `in_review → changes_requested` | reviewer (`submit`) | Al menos una pantalla `changes_requested` y ninguna `pending` |
| `changes_requested → open`      | skill (nueva ronda) | Manifiesto de la misma rama; `round + 1`                      |
| `approved → open`               | skill (nueva ronda) | El dev cambió UI después de la aprobación                     |
| `* → closed`                    | webhook de GitHub   | PR merged o closed                                            |

La tabla vive en código como **máquina de estados pura** (`review-state.machine.ts`). El servicio la aplica con `findOneAndUpdate({ _id, status })`: un comando con estado viejo recibe `409` en lugar de pisar el cambio de otro.

### Veredicto de pantalla (por ronda)

`pending → approved | changes_requested`, y se puede cambiar hasta el `submit`. En una ronda nueva:

- pantalla **recapturada** → vuelve a `pending`;
- pantalla **sin cambios** → hereda el veredicto de la ronda anterior (`carriedOver: true`).

## Reglas

1. Una revisión por PR (`projectId + pr.number` único). Volver a ejecutar la skill en la misma rama abre una ronda, no otra revisión.
2. `submit` requiere que no queden pantallas `pending` en la ronda.
3. Solo los reviewers del proyecto dan veredicto. El autor puede comentar y responder, pero no aprobar.
4. Los comentarios de una ronda vieja se ven, marcados con su ronda.
5. Un manifiesto sin `privacy.masked = true` se rechaza (ver [security.md](security.md)).

## Manifiesto v1

Es el **contrato** entre la skill y el API. Va versionado (`manifestVersion`): el API acepta las versiones soportadas y rechaza el resto con un error claro. Las imágenes no viajan en el manifiesto: cada captura declara `key`, tipo, tamaño y hash, y el API responde con URLs firmadas para subirlas.

```json
{
  "manifestVersion": 1,
  "project": "lideris",
  "card": { "key": "LIDER-628", "title": "Editar cantidades y eliminar ítems de la pre-orden" },
  "pr": {
    "number": 868,
    "url": "https://github.com/estudio-norte/lideris-v2/pull/868",
    "title": "feat(preorders): editar en bloque las cantidades aprobadas",
    "base": "develop",
    "head": "feature/LIDER-628-pre-order-items-edit-develop",
    "author": "kevin-martineze",
    "commit": "9f2c1e7a"
  },
  "title": "Edición en bloque de las cantidades aprobadas",
  "context": "Pre-orden · pestaña Productos / Servicios",
  "module": "Compras",
  "note": null,
  "summary": {
    "steps": [
      {
        "title": "Editar",
        "body": "El usuario pulsa «Editar cantidades». Todas las filas pasan a stepper a la vez."
      },
      { "title": "Guardar", "body": "Un solo «Guardar cambios» envía todo junto." }
    ],
    "rules": ["Rango permitido por fila: de 1 hasta la cantidad solicitada."]
  },
  "screens": [
    {
      "key": "edit-with-changes-1280",
      "title": "Filas modificadas",
      "lead": "Se bajó la primera fila de 10 a 7 y la segunda de 17 a 12.",
      "route": "/preorders/[id]/products-services",
      "viewport": { "width": 1280, "height": 720 },
      "captures": {
        "after": {
          "key": "c_cambios.png",
          "contentType": "image/png",
          "bytes": 182344,
          "sha256": "…"
        },
        "before": null
      },
      "elements": [
        {
          "name": "QuantityStepper",
          "file": "src/lib/components/QuantityStepper.svelte",
          "line": 42,
          "selector": "[data-qty-stepper]",
          "box": { "x": 0.61, "y": 0.42, "w": 0.12, "h": 0.05 }
        }
      ],
      "diff": [{ "x": 0.2, "y": 0.4, "w": 0.76, "h": 0.06 }],
      "note": null,
      "changes": ["Fila modificada: borde en color primario y «Antes: N» bajo el stepper."],
      "questions": ["¿El borde se distingue lo suficiente?"]
    }
  ],
  "notCaptured": [
    {
      "title": "Guardado",
      "body": "Toast «Cantidad aprobada actualizada» y se sale del modo edición."
    }
  ],
  "privacy": { "masked": true, "dataset": "qa-fixtures" },
  "generator": { "name": "design-review-skill", "version": "0.1.0" }
}
```

Reglas del manifiesto:

- `screens[].key` es estable entre rondas: así el API sabe qué pantalla se recapturó y cuál heredó su veredicto. Una pantalla cambió si es nueva o si su `captures.after.sha256` es distinto del de la ronda anterior.
- `module` es el nombre del módulo que se muestra en listas y métricas; si falta, el API usa el primer segmento de la ruta de la primera pantalla.
- `note` (de la revisión) explica la ronda; `screens[].note`, lo que cambió en esa pantalla. Los dos son opcionales y se ignoran en la ronda 1.
- `elements` son los componentes visibles con su caja en fracciones 0–1 de la captura: el visor ancla comentarios a ellos y el texto para Claude Code cita su archivo y línea. `diff` son las zonas que cambiaron respecto de la ronda anterior. Ambos son opcionales.
- `notCaptured` acepta textos o `{ title, body }` (se guarda como «título: cuerpo»).
- `viewport` va dentro del rango del proyecto (por defecto 1024–1920 de ancho).
- Límites (configurables por proyecto): 40 pantallas por ronda, 5 MB por imagen, solo `image/png` y `image/webp`.
- `pr.commit` es el SHA del head: el API publica ahí el estado del check en GitHub.
- El API valida con su propio esquema (Joi). El frontend genera sus tipos desde el OpenAPI del API (ver [frontend.md](frontend.md)).
