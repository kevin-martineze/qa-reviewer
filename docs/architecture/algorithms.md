# Algoritmos del frontend

Los cálculos no triviales de la web, con su complejidad y por qué están hechos así. Todos son funciones puras en `$lib/domain` o `$lib/utils`, con pruebas.

## Recursión: dónde sí y dónde no

La web **no usa recursión**. Todos sus datos son planos o de un nivel (pantallas de una revisión, comentarios con respuestas, notificaciones), así que un recorrido lineal basta y no hay riesgo de desbordar la pila con datos grandes. Donde un problema es naturalmente recursivo (recorrer un árbol de carpetas o un JSON de profundidad desconocida), vive en el API; ver `qa-reviewer-api/docs/algorithms.md`.

Regla para el futuro: si aparece una estructura anidada sin límite (p. ej. hilos de respuestas de varios niveles), se resuelve con recursión solo si la profundidad está acotada por el dominio; si no, con una pila explícita.

## Anclas y componentes

### `elementAt(elements, point)` — el componente bajo el clic

- **Entrada:** los componentes de la pantalla, cada uno con su caja en fracciones 0–1, y el punto del clic.
- **Algoritmo:** recorre todas las cajas; de las que contienen el punto, se queda con la de **menor área** (la más específica: un botón dentro de una tarjeta gana sobre la tarjeta).
- **Complejidad:** O(n) en tiempo, O(1) en memoria. Con 20–60 componentes por pantalla, un índice espacial no se justifica.

### `pixelsToAnchor` y `anchorToPixels`

- El clic se guarda como fracción del tamaño de la imagen y se recorta a [0, 1]. Así el pin cae en el mismo lugar con cualquier zoom o ancho de pantalla, y en el modo lado a lado.

## Revisiones

### `nextRoundVerdicts(prev, keys, changed)` — herencia de veredictos

- Para cada pantalla de la ronda nueva: si cambió, `pending`; si no, el veredicto de la ronda anterior (o `pending` si no existía).
- **Complejidad:** O(n) con un `Set` para las cambiadas.
- Es la misma regla que aplica el API al publicar una ronda; aquí sirve para mostrar qué se heredó.

### `progressOf(screens)` y `verdictCounts`

- Un recorrido que cuenta aprobadas, con ajuste y pendientes. `done = approved + changes`.

### `dueState(review, now)` — plazo

- Árbol de decisión por estado: aprobada, cerrada o esperando al autor no tienen plazo que corra; sin `dueAt`, «Sin plazo»; si no, compara con `now`: vencida (rojo), menos de 24 h (ámbar) o normal.
- Recibe `now` como parámetro para que servidor y navegador calculen lo mismo y las pruebas no dependan del reloj.

### `awaitingFollowUp(comment, round)`

- Un comentario pide confirmación si es de una ronda anterior, sigue abierto y diseño no dijo ya «sigue igual».

### `feedbackText(review, comments, names, now)`

- Arma, en un solo recorrido por pantallas y otro por comentarios abiertos, el texto que `/design-review status` devuelve a Claude Code: estado, pantallas con ajuste y cada comentario con su archivo y línea, o con su punto en porcentaje si no hay componente.

## Permisos

### `permissionsOf(orgRole, projectRole)`

- Construye el conjunto de roles efectivos (el de proyecto más `owner`/`admin`, que además cuentan como `project_admin`) y recorre la matriz una vez: un permiso entra si alguno de sus roles está en el conjunto.
- **Complejidad:** O(P × R) con P = 15 permisos y R ≤ 7 roles; constante en la práctica.

## Listas y fechas

### `groupByDay(items, now)`

- Recibe la lista ya ordenada (más reciente primero) y corta un grupo nuevo cada vez que cambia el día en Bogotá. Un solo recorrido, O(n), sin ordenar ni usar un mapa.

### Fechas sin depender del texto de ICU

- `dates.ts` usa `Intl.DateTimeFormat` con zona America/Bogotá **solo para extraer números** (año, mes, día, hora, minuto con `formatToParts`) y arma el texto a mano («20 oct», «4:58 p. m.»). Cada versión de ICU escribe distinto («20 oct» o «20 de oct», espacios duros), y esa diferencia entre Node y el navegador rompería la hidratación.

### Query Objects: canonicalización

- `parse*Query` normaliza: valores desconocidos caen al default, números inválidos a 1, textos se recortan. `*QueryHref` escribe solo lo distinto del default, en orden fijo. Resultado: dos URLs con los mismos filtros son idénticas y el caché del navegador las reconoce.

## Gráficos

### `niceTicks(max, target)` — ejes legibles

- Paso crudo = `max / target`. Se toma su orden de magnitud (10^⌊log10⌋) y el primer múltiplo de {1, 2, 5, 10} que lo cubre. Los ticks van de 0 al primer múltiplo del paso que alcanza `max`.
- Ejemplo: `max = 37`, `target = 4` → paso crudo 9,25 → magnitud 1 → paso 10 → `[0, 10, 20, 30, 40]`.

### `columnPath` y `barPath`

- Generan el `d` de un `<path>` SVG con las esquinas del extremo de datos redondeadas y la base recta, con el radio limitado por el ancho y el alto de la barra para que una barra corta no se deforme.
