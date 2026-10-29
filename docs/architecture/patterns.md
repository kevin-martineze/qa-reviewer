# Patrones de diseño del frontend

Catálogo de los patrones que usa la web: qué problema resuelven aquí, dónde viven y cómo se extienden sin romperlos. Cada uno existe por un motivo concreto. Si un cambio no encaja en ninguno, conviene discutirlo antes de inventar otro.

## Mapa

```
            ┌──────────── routes (load / actions) ────────────┐
            │  Command (form actions) · Query Object (URL)    │
            └───────┬───────────────────────────────┬─────────┘
                    │ Facade: gateway(locals)       │ Guard: requirePermission
                    ▼                               ▼
   Ports & Adapters ─▶ ports.ts ◀── adapters/http (Adapter)      $lib/domain (funciones puras,
                                 ◀── adapters/mock (Fake)         Specification, Mapper)
                    │
                    ▼ Result<T>
            components: Composite (atoms → templates) · Slots (snippets)
                        Strategy (modos de comparación) · Registry · Null Object
```

## Arquitectura

### Ports and Adapters (hexagonal)

- **Problema:** la UI tenía que construirse y probarse antes de que existiera el API, y el día que existiera no podía obligar a reescribir rutas.
- **Dónde:** `$lib/api/ports.ts` (puertos), `$lib/server/adapters/http` y `$lib/server/adapters/mock` (adaptadores).
- **Regla:** una ruta importa `gateway()` y tipos de `$lib/api`. Nunca un adaptador.
- **Extender:** un endpoint nuevo es un método en el puerto, su implementación en `http` y en `mock`, y una fila en [api.md](api.md).

### Facade: `gateway(locals, fetch)`

- **Problema:** cada `load` necesita siete gateways configurados con la sesión del request.
- **Dónde:** `$lib/server/gateway.ts`. Elige el adaptador según `REVIEWS_SOURCE` y le pasa `locals` (token) y el `fetch` de SvelteKit.
- **Consecuencia:** cambiar de mock a API es una variable de entorno.

### Fake (mock con reglas reales)

- **Problema:** un mock que devuelve datos fijos esconde errores de permisos y de estado.
- **Dónde:** `adapters/mock/index.ts` + `store.ts`. Aplica la misma matriz de permisos, los mismos 403/404/409/410 y las mismas transiciones que el API.
- **Regla:** si el API cambia una regla, el mock cambia igual. Las e2e corren contra los dos.

### Result\<T\> en lugar de excepciones

- **Problema:** las excepciones de un adaptador cruzan capas sin tipo y terminan en un 500 genérico.
- **Dónde:** `$lib/api/result.ts`. Todo método de puerto devuelve `{ ok: true, data } | { ok: false, error }`.
- **Uso:** en un `load`, `unwrap(result, url)` traduce el error a `error()` de SvelteKit (401 → login). En una action, `if (!result.ok) return apiFail(result.error)`.

## Rutas

### Command: form actions

- Cada escritura es una action con nombre (`?/assign`, `?/verdict`). Valida con zod, llama al puerto y responde `{ message }` o `fail(status, { error })`. Un único efecto en el layout de `(app)` convierte la respuesta en toast.
- Funciona sin JavaScript; con `use:enhance`, sin recargar.

### Query Object (estado en la URL)

- **Problema:** filtros en `$state` se pierden al recargar y no se pueden compartir.
- **Dónde:** `review-query`, `viewer-query`, `audit-query`, `metrics-query`, `user-filters` en `$lib/domain`.
- **Forma:** `parse*Query(params)` normaliza la URL (valores inválidos caen al default) y `*QueryHref(actual, cambio)` arma el link canónico (solo lo distinto del default; un filtro nuevo vuelve a la página 1).
- **Extender:** un filtro es un campo en la interfaz, su lectura en `parse` y su escritura en `href`. Las pruebas cubren la ida y vuelta.

### Guard

- `requireUser` y `requirePermission` en `$lib/server/guards.ts`. Se llaman en el `load` del segmento (para no pintar lo que no se puede usar) **y** en cada action (porque una action se puede invocar sin pasar por el `load`).

## Dominio

### Funciones puras como reglas

- `permissionsFor`, `reviewAbilities`, `dueState`, `progressOf`, `nextRoundVerdicts`, `awaitingFollowUp`, `feedbackText`, `elementAt`. Reciben datos y devuelven valores, sin SvelteKit ni red. Se prueban con Vitest sin montar nada.

### Specification: `reviewAbilities`

- Junta en un objeto qué puede hacer la persona en una revisión (`verdict`, `comment`, `resolve`, `moderate`, `assign`, `reopen`). Los componentes preguntan `can.verdict`, no repiten la condición (permiso + no autor + ronda abierta).

### Mapper de presentación

- El contrato no trae etiquetas ni colores. `labels.ts` y `tone.ts` traducen estados y tipos a texto y tono; `notification-icons.ts` y `activity-icons.ts`, a íconos. Agregar un estado es una entrada en cada mapa, y TypeScript avisa si falta.

## Componentes

### Composite + diseño atómico

- `atoms → molecules → organisms → templates`. Cada nivel compone los de abajo. Los átomos envuelven shadcn-svelte y son el único punto donde se ajusta la marca.

### Slots con snippets (templates puros)

- Un template define regiones (`header`, `toolbar`, `aside`…) que el layout llena con snippets. El template no sabe de datos ni de rutas; ver [layouts.md](layouts.md) y el [ADR 0008](../adr/0008-layouts-y-templates.md).

### Strategy: modos de comparación

- `organisms/compare/` exporta `COMPARE_MODES`: `side`, `slider` y `toggle` con las mismas props (`before`, `after`, etiquetas). El visor elige por `?mode=`. Un modo nuevo es un componente más en el registro.

### Registry

- Ilustraciones (`molecules/illustrations.ts`), íconos por tipo de notificación y de actividad, avatares (`domain/avatars.ts`). Un mapa tipado por clave evita `switch` repartidos por la UI.

### Null Object

- Un avatar desconocido o `null` muestra las iniciales; una comparación sin captura de base desactiva la opción en vez de mostrar una imagen rota.

## Pruebas

### Factory

- `$lib/testing/factories.ts` (`makeReview`, `makeScreen`, `makeRound`, `makeComment`) arma objetos válidos con lo mínimo, y cada prueba sobrescribe solo lo que le importa.
