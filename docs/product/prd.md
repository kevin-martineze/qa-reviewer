# PRD — QA Reviewer (plataforma web)

Documento de requisitos del producto. Describe **qué** resuelve la plataforma y **cuándo está bien hecha**. El **cómo** está en [`../architecture/`](../architecture/README.md); el contrato con el API, en [`api.md`](../architecture/api.md). El PRD del API (`qa-reviewer-api/docs/prd.md`) cubre lo que este documento le pide al servidor.

## 1. Problema

Los cambios visuales del frontend llegan a producción sin que diseño los haya visto. Diseño se entera tarde (en QA o cuando ya está publicado), y su feedback llega por chat, sin la pantalla, sin el componente y sin rastro de qué se corrigió. Armar a mano un documento de revisión le cuesta al dev más de lo que está dispuesto a invertir, así que no se hace.

## 2. Objetivos

| #   | Objetivo                                                               | Cómo se mide                                                         |
| --- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| O1  | Que toda feature con cambios de UI pase por diseño antes de fusionarse | % de PR con cambios de UI que tienen una revisión aprobada           |
| O2  | Que revisar sea rápido para diseño                                     | Mediana de horas desde que se abre la revisión hasta el primer envío |
| O3  | Que el feedback sea accionable para el dev sin una reunión             | Rondas promedio por revisión y % aprobadas en la primera ronda       |
| O4  | Que nadie arme documentos a mano                                       | Revisiones creadas por la skill / revisiones totales (meta: 100 %)   |

## 3. No objetivos (por ahora)

- Diff visual automático píxel a píxel.
- Bloquear el merge del PR hasta la aprobación (se publica un check; bloquear es decisión del repo).
- Tiempo real: quien revisa recarga. Más adelante, eventos del servidor.
- Login con Google o GitHub (hoy: usuario y contraseña con invitación).
- Móvil y tablet: la revisión se hace en escritorio.

## 4. Personas

| Persona                      | Rol típico        | Qué necesita                                                                        |
| ---------------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| **Dev frontend**             | `developer`       | Subir la revisión sin esfuerzo y recibir el feedback donde trabaja (PR y su sesión) |
| **Diseñador UI/UX**          | `designer`        | Una bandeja con lo que le toca, comparar antes/después y anotar sobre la pantalla   |
| **Líder de diseño**          | `design_lead`     | Repartir el trabajo, priorizar, ver lo vencido y corregir un envío equivocado       |
| **Líder del proyecto**       | `project_admin`   | Configurar el proyecto: miembros, SLA, reglas de asignación, integraciones          |
| **Admin de la organización** | `owner` / `admin` | Invitar y desactivar personas, ver todos los proyectos y las métricas               |
| **Observador**               | `viewer` (PM, QA) | Ver el estado y comentar sin poder aprobar                                          |

## 5. Recorridos principales

1. **Crear** (dev, fuera de la web): `/design-review` en Claude Code captura las pantallas, redacta qué mirar y publica. La web recibe una revisión `open` con su número (`QR-0012`) y la asigna según la regla del proyecto.
2. **Revisar** (diseño): abre la bandeja → la revisión → cada pantalla en el visor. Compara con la versión base o la ronda anterior, comenta anclado a un punto o a un componente, marca **Aprobada** o **Requiere ajuste** y al final **Envía la revisión**. El envío se notifica una sola vez.
3. **Corregir** (dev): recibe el resultado en el PR, en la tarjeta y con `/design-review status`. Corrige y vuelve a correr la skill: nace la ronda siguiente, solo con lo que cambió.
4. **Confirmar** (diseño): en la ronda nueva, la web le pregunta por cada comentario abierto de la ronda anterior si quedó resuelto.
5. **Cerrar**: al fusionar o cerrar el PR, la revisión pasa a `closed`.

## 6. Requisitos funcionales

Cada requisito tiene criterios de aceptación verificables. «Puede» significa que la acción existe solo con el permiso indicado (ver [users-and-roles.md](../architecture/users-and-roles.md)).

### 6.1 Acceso

- **RF-01 Login** con correo y contraseña. Un error no borra el correo escrito. Tras entrar, vuelve a la página que se pidió (`redirectTo`), nunca a un dominio externo.
- **RF-02 Sesión vencida**: cualquier petición con sesión inválida lleva al login con el aviso «tu sesión venció».
- **RF-03 Invitación**: el link muestra a quién se invita, quién invita y a qué proyectos. Estados: válida, vencida (7 días), usada, revocada. Aceptarla pide nombre, contraseña (12+ caracteres, confirmada) y avatar opcional, y deja la sesión abierta.
- **RF-04 Recuperación**: pedir el enlace siempre responde igual (no revela si el correo existe). El enlace dura 1 hora y sirve una vez.
- **RF-05 Cerrar sesión** en este dispositivo o en todos.

### 6.2 Bandeja y listado

- **RF-10 Bandeja** según permisos: asignadas a mí, vencidas del equipo (líderes), mis revisiones (devs).
- **RF-11 Listado** con filtros en la URL: estado, asignada, autor, prioridad, vencidas, búsqueda (número, título, tarjeta, PR, módulo), orden (actividad, vencimiento, prioridad) y paginación. Cambiar un filtro vuelve a la página 1. Atrás/adelante y recargar conservan la vista.
- **RF-12 Proyecto activo**: el selector cambia el proyecto de toda la app; desde una revisión, vuelve al listado.

### 6.3 Revisión

- **RF-20 Encabezado**: número, título, tarjeta, PR, ronda, estado, prioridad, plazo y asignados.
- **RF-21 Pantallas** con su veredicto y el progreso de la ronda; filtro «solo lo que cambió».
- **RF-22 Asignar y priorizar** (`reviews:assign`): solo diseñadores y líderes de diseño del proyecto. Al reasignar se avisa al que entra y al que sale.
- **RF-23 Enviar** (`verdicts:set`, no el autor): exige que ninguna pantalla quede pendiente. Resultado `approved` si todo está aprobado; si no, `changes_requested`.
- **RF-24 Reabrir** (`reviews:reopen`): anula el último envío con un motivo y vuelve a «En revisión».
- **RF-25 Pestañas**: resumen del flujo, rondas y envíos, feedback para Claude Code (copiable), actividad, rama y PR.

### 6.4 Visor

- **RF-30 Comparar** con la base o con la ronda anterior, en tres modos: lado a lado, deslizador y alternar.
- **RF-31 Comentar** anclado a un punto (fracciones de la imagen) y, si el punto cae sobre un componente conocido, con su archivo y línea. Responder, resolver y borrar (propios, o de otros con `comments:moderate`).
- **RF-32 Veredicto** por pantalla con atajos de teclado (`A`, `R`); pulsar el activo lo devuelve a pendiente.
- **RF-33 Seguimiento**: en una ronda nueva, cada comentario abierto de una ronda anterior pregunta «¿quedó resuelto?» (`resuelto` / `sigue igual`).
- **RF-34 Capas**: diff (zonas que cambiaron) e inspector de componentes.
- **RF-35 Navegación** entre pantallas con flechas o `J`/`K`, sin perder el modo de comparación.

### 6.5 Notificaciones

- **RF-40** Campana con no leídas y las últimas cinco; página con pestañas (todas, no leídas, menciones) agrupadas por día; marcar todas como leídas. Abrir una notificación la marca leída y lleva a su revisión.
- **RF-41** Eventos: asignación, ronda nueva, envío, mención `@persona`, respuesta a mi comentario, por vencer (24 h) y vencida.
- **RF-42** Preferencias de correo por tipo de evento; in-app siempre llega.

### 6.6 Proyecto (`projects:configure`)

- **RF-50** Nombre; SLA en días hábiles (1–15); estrategia de asignación (manual, round robin o por módulo con reglas `ruta → diseñador`, sin rutas repetidas).
- **RF-51** Integraciones: nombre del check en GitHub, comentar en el PR, comentar en la tarjeta.
- **RF-52** Reglas de diseño y selectores a enmascarar (máximo 30 cada uno).
- **RF-53** Miembros (`members:manage`): agregar, cambiar rol, quitar (nunca a uno mismo).
- **RF-54** Crear proyectos (`projects:create`): nombre y slug; el slug no cambia después.

### 6.7 Organización (`users:invite`)

- **RF-60** Usuarios con filtros por estado y búsqueda; desactivar y reactivar (nunca a uno mismo ni al owner); cambiar el rol de organización (solo el owner toca a otro owner).
- **RF-61** Invitaciones: crear (con proyectos y roles iniciales), ver su estado y revocar. Un correo ya registrado o con invitación vigente se marca en el campo.
- **RF-62** Matriz de roles (solo lectura) y auditoría filtrable por tipo y por actor.

### 6.8 Cuenta

- **RF-70** Perfil: nombre y avatar del banco (o iniciales).
- **RF-71** Contraseña: pide la actual; la nueva es distinta y tiene 12+ caracteres. Cambiarla cierra las demás sesiones.
- **RF-72** Tokens de la skill (`tokens:own`): crear por proyecto (el secreto se muestra una sola vez), ver el último uso y revocar.

### 6.9 Métricas (`reports:view`)

- **RF-80** Abiertas, vencidas, horas hasta el primer envío y hasta la aprobación (medianas), tasa de aprobación en primera ronda, rondas promedio; abiertas y aprobadas por semana; pendientes por diseñador; ajustes por módulo. Filtros por proyecto y periodo en la URL.

## 7. Requisitos no funcionales

| Área          | Requisito                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Pantallas     | 1280–1920 px garantizado; bajo 1024 px, aviso «disponible solo en computador»                              |
| Render        | Todo se pinta en el servidor; las acciones funcionan sin JavaScript                                        |
| Seguridad     | El token del API vive en una cookie `httpOnly`; el navegador nunca habla con el API                        |
| Permisos      | Se validan en el `load` (experiencia), en cada action y otra vez en el API                                 |
| Accesibilidad | El veredicto nunca se comunica solo con color; cada gráfico tiene su tabla; todo se opera con teclado      |
| Fechas        | Zona America/Bogotá, mismas en servidor y navegador                                                        |
| Privacidad    | Repo y demo públicos: ninguna captura con datos reales sin anonimizar                                      |
| Calidad       | `check`, `lint`, `format`, pruebas unitarias, build y e2e en verde contra el mock **y** contra el API real |

## 8. Alcance de la versión 1

Todo lo de la sección 6 más la skill `/design-review` y las integraciones con GitHub, Plane y correo. Lo de la sección 3 queda para después.

## 9. Riesgos

| Riesgo                                    | Mitigación                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| Capturas con datos sensibles              | Enmascarado obligatorio en la skill; el API rechaza manifiestos sin `masked`  |
| Diseño no revisa a tiempo                 | SLA por proyecto, avisos de por vencer y vencida, carga por diseñador visible |
| Rondas infinitas por comentarios ambiguos | Comentarios anclados a componente y archivo; seguimiento explícito por ronda  |
