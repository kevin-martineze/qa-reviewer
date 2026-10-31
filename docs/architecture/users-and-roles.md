# Usuarios, roles y permisos

## Niveles

```
Organización
 ├── Usuarios          rol de organización: owner · admin · member
 └── Proyectos (p. ej. Lideris)
      └── Miembros     rol de proyecto: project_admin · design_lead · designer · developer · viewer
```

- Un usuario pertenece a una organización y puede estar en varios proyectos con roles distintos (p. ej. `designer` en Lideris y `viewer` en Auralis).
- **Permisos de acceso por rol** y **autoridad por asignación**: un `designer` puede dar veredicto en cualquier revisión del proyecto, pero las revisiones le llegan a la bandeja solo si está asignado.

## Roles

### Organización

| Rol      | Para quién                     | Puede                                                                              |
| -------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `owner`  | Dueño de la cuenta (uno o dos) | Todo, incluido transferir la propiedad y borrar la organización                    |
| `admin`  | Líder técnico, líder de diseño | Invitar y desactivar usuarios, crear proyectos, ver todos los proyectos y métricas |
| `member` | Resto                          | Solo los proyectos donde es miembro                                                |

### Proyecto

| Rol             | Para quién           | Resumen                                                                                                    |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `project_admin` | Líder del proyecto   | Configura el proyecto (integraciones, SLA, límites, reglas de asignación, enmascarado) y gestiona miembros |
| `design_lead`   | Líder de UI/UX       | Asigna revisiones, reasigna, da veredicto, puede **anular** un envío y reabrir la revisión                 |
| `designer`      | Diseñador UI/UX      | Da veredicto y comenta en lo asignado (y en lo que abra del proyecto)                                      |
| `developer`     | Dev frontend         | Crea revisiones con la skill, sube rondas, comenta y responde, resuelve comentarios                        |
| `viewer`        | PM, QA, stakeholders | Solo lectura y comentarios                                                                                 |

## Matriz de permisos

Los permisos son claves fijas en código. Los roles son conjuntos de permisos predefinidos (no editables en v1; ver [ADR 0007](../adr/0007-roles-predefinidos.md)).

| Permiso                                        | owner | admin | project_admin | design_lead | designer | developer | viewer |
| ---------------------------------------------- | :---: | :---: | :-----------: | :---------: | :------: | :-------: | :----: |
| `org:manage` (nombre, borrar, propiedad)       |   ✓   |       |               |             |          |           |        |
| `users:invite` · `users:deactivate`            |   ✓   |   ✓   |               |             |          |           |        |
| `projects:create`                              |   ✓   |   ✓   |               |             |          |           |        |
| `projects:configure`                           |   ✓   |   ✓   |       ✓       |             |          |           |        |
| `members:manage`                               |   ✓   |   ✓   |       ✓       |             |          |           |        |
| `reviews:read`                                 |   ✓   |   ✓   |       ✓       |      ✓      |    ✓     |     ✓     |   ✓    |
| `reviews:create` (skill) · `rounds:create`     |       |       |       ✓       |             |          |     ✓     |        |
| `reviews:assign`                               |   ✓   |   ✓   |       ✓       |      ✓      |          |           |        |
| `verdicts:set` · `reviews:submit`              |       |       |               |      ✓      |    ✓     |           |        |
| `reviews:reopen` (anular envío)                |       |       |       ✓       |      ✓      |          |           |        |
| `comments:create`                              |   ✓   |   ✓   |       ✓       |      ✓      |    ✓     |     ✓     |   ✓    |
| `comments:resolve`                             |       |       |       ✓       |      ✓      |    ✓     |     ✓     |        |
| `comments:moderate` (editar o borrar de otros) |   ✓   |   ✓   |       ✓       |      ✓      |          |           |        |
| `tokens:own` (tokens personales de la skill)   |       |       |       ✓       |             |          |     ✓     |        |
| `reports:view`                                 |   ✓   |   ✓   |       ✓       |      ✓      |          |           |        |

Reglas adicionales (en el servicio, no en la matriz):

- El **autor** de una revisión no puede darle veredicto aunque tenga un rol que lo permita (separación de funciones).
- Un usuario desactivado conserva su autoría y sus comentarios, pero pierde la sesión y sus tokens quedan revocados.
- `owner` y `admin` de la organización ven todos los proyectos como `project_admin` implícito.

## Ciclo de vida de la cuenta

```
invitado ──acepta (define contraseña)──▶ activo ──desactivar──▶ inactivo
   │                                       ▲                       │
   └── vence (7 días) / se revoca          └────── reactivar ──────┘
```

- **Invitación** por correo con un token de un solo uso (7 días). Incluye la organización y, opcionalmente, proyectos y roles iniciales.
- **Contraseña**: mínimo 12 caracteres, hash con Argon2id. Recuperación por correo con un token de un solo uso (1 hora).
- **Sesión**: token opaco con vencimiento deslizante de 7 días ([ADR 0009](../adr/0009-sesiones-opacas.md)). Cerrar sesión lo revoca; se puede cerrar sesión en todos los dispositivos, y cambiar la contraseña cierra las demás sesiones.
- **SSO** con Google o GitHub: fase posterior; el modelo ya separa `credentials` del `user`.

## Gestión de las revisiones

### Asignación

- Cada proyecto define su **regla de asignación** (Strategy): `manual` (la asigna el `design_lead`), `round_robin` entre los `designer` activos, o `by_module` (mapa ruta → diseñador, p. ej. `/preorders/*` → diseñador de Compras).
- Una revisión puede tener varios asignados. Se considera revisada cuando un asignado envía.
- Al reasignar se notifica a los dos (el saliente y el entrante).

### Plazos y prioridad

- **SLA por proyecto** (p. ej. 2 días hábiles desde `open`). `dueAt` se calcula al publicar y se recalcula en cada ronda.
- **Prioridad** tomada de la tarjeta (urgente, alta, media o baja) o fijada por el `design_lead`.
- Revisiones **vencidas**: marca en la bandeja, notificación al asignado y al `design_lead`.

### Notificaciones

| Evento                                    | A quién                  | Canal                          |
| ----------------------------------------- | ------------------------ | ------------------------------ |
| Revisión asignada                         | asignados                | in-app + correo                |
| Nueva ronda                               | asignados                | in-app + correo                |
| Revisión enviada (aprobada o con ajustes) | autor                    | in-app + correo + PR + tarjeta |
| Mención `@usuario` en un comentario       | mencionado               | in-app + correo                |
| Respuesta a mi comentario                 | autor del comentario     | in-app                         |
| Por vencer (24 h) · vencida               | asignados, `design_lead` | in-app + correo                |
| Invitación · recuperación de contraseña   | invitado o usuario       | correo                         |

Cada usuario elige en sus preferencias qué recibe por correo; in-app siempre.

### Actividad (auditoría)

Línea de tiempo por revisión y registro global: quién creó, publicó, asignó, reasignó, dio veredicto, comentó, envió o reabrió, y cuándo. Los cambios de roles, invitaciones y revocación de tokens van al registro de la organización.

### Métricas (`reports:view`)

- Pendientes por diseñador y vencidas.
- Tiempo hasta la primera revisión y hasta la aprobación.
- Tasa de aprobación en la primera ronda y rondas promedio por revisión.
- Pantallas con más ajustes por módulo (ruta) y por tipo de pregunta.
- Filtros por proyecto, rango de fechas y autor.
