// Generado por scripts/openapi-types.mjs desde generated/openapi.json. No editar a mano:
// corre `pnpm types:sync` cuando cambie el contrato del API.

export interface paths {
  '/healthcheck': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** El proceso responde */
    get: operations['HealthController_live'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/healthcheck/readiness-probe': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Mongo y el storage responden */
    get: operations['HealthController_ready'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/audit': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Registro de auditoría, más reciente primero */
    get: operations['OrganizationController_audit_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/auth/login': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Iniciar sesión */
    post: operations['AuthController_login_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/auth/logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Cerrar esta sesión */
    post: operations['AuthController_logout_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/auth/logout-all': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Cerrar sesión en todos los dispositivos (no revoca los tokens de la skill) */
    post: operations['AuthController_logoutAll_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/auth/recovery': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Pedir enlace de recuperación
     * @description Siempre 204, exista o no el correo.
     */
    post: operations['AuthController_requestRecovery_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/auth/recovery/{token}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Estado de un enlace de recuperación */
    get: operations['AuthController_recoveryInfo_v1'];
    put?: never;
    /** Definir contraseña nueva con el enlace */
    post: operations['AuthController_resetPassword_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/comments/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * Borrar un comentario
     * @description Su autor o quien tenga `comments:moderate`.
     */
    delete: operations['CommentsController_remove_v1'];
    options?: never;
    head?: never;
    /**
     * Resolver o reabrir un comentario
     * @description Su autor o quien tenga `comments:resolve`.
     */
    patch: operations['CommentsController_resolve_v1'];
    trace?: never;
  };
  '/v1/comments/{id}/follow-up': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * ¿Quedó resuelto en esta ronda?
     * @description Solo comentarios de rondas anteriores. `resolved` lo marca resuelto; `still` lo deja abierto.
     */
    put: operations['CommentsController_followUp_v1'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/comments/{id}/replies': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Responder un comentario */
    post: operations['CommentsController_reply_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/device/{userCode}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Ver una solicitud de acceso
     * @description El código no distingue mayúsculas y el guion es opcional.
     */
    get: operations['DeviceController_get_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/device/{userCode}/approve': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Aprobar el acceso para un proyecto
     * @description Requiere `tokens:own` en el proyecto. El token se crea cuando la skill sondea; sin `label` se llama «Claude Code · <hostname>».
     */
    post: operations['DeviceController_approve_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/device/{userCode}/deny': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Rechazar el acceso */
    post: operations['DeviceController_deny_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/invitations': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Invitaciones con su estado calculado */
    get: operations['OrganizationController_listInvitations_v1'];
    put?: never;
    /**
     * Invitar a una persona
     * @description Envía el correo con el enlace (vence en 7 días). Invitar como owner exige `org:manage`.
     */
    post: operations['OrganizationController_invite_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/invitations/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /** Revocar una invitación */
    delete: operations['OrganizationController_revokeInvitation_v1'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/invitations/{token}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Datos de una invitación */
    get: operations['AuthController_inviteInfo_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/invitations/{token}/accept': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Aceptar una invitación y crear la cuenta */
    post: operations['AuthController_acceptInvite_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/me': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Usuario de la sesión con sus membresías */
    get: operations['AuthController_me_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** Actualizar nombre y avatar */
    patch: operations['AuthController_updateProfile_v1'];
    trace?: never;
  };
  '/v1/me/notification-prefs': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Qué avisos llegan también por correo
     * @description In-app siempre llega. Sin preferencias guardadas, valen las de fábrica.
     */
    get: operations['NotificationsController_prefs_v1'];
    /**
     * Guardar las preferencias de correo
     * @description El objeto completo, con todos los tipos.
     */
    put: operations['NotificationsController_updatePrefs_v1'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/me/password': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * Cambiar la contraseña
     * @description Cierra las demás sesiones.
     */
    put: operations['AuthController_changePassword_v1'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/notifications': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Bandeja de la persona, más recientes primero
     * @description Sin paginar: las 200 más recientes. `unread=true` solo no leídas; `mentions=true` solo menciones.
     */
    get: operations['NotificationsController_list_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/notifications/read-all': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Marcar todas como leídas */
    post: operations['NotificationsController_markAllRead_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/notifications/unread-count': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Cuántas no leídas */
    get: operations['NotificationsController_unreadCount_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/notifications/{id}/read': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Marcar una como leída */
    post: operations['NotificationsController_markRead_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/organization': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Organización de la instalación */
    get: operations['OrganizationController_organization_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/projects': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Proyectos visibles (todos para owner y admin) */
    get: operations['ProjectsController_list_v1'];
    put?: never;
    /**
     * Crear un proyecto
     * @description `id` es el slug: minúsculas, números y guiones. No cambia.
     */
    post: operations['ProjectsController_create_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/projects/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Un proyecto
     * @description 404 también si la persona no lo puede ver.
     */
    get: operations['ProjectsController_get_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /**
     * Configurar un proyecto
     * @description Parcial: `name`, `slaDays`, `strategy`, `moduleRules`, `integrations`, `maskSelectors`, `designRules`.
     */
    patch: operations['ProjectsController_update_v1'];
    trace?: never;
  };
  '/v1/projects/{id}/members': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Miembros del proyecto */
    get: operations['ProjectsController_listMembers_v1'];
    put?: never;
    /** Agregar un miembro */
    post: operations['ProjectsController_addMember_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/projects/{id}/members/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * Quitar un miembro
     * @description También quita sus reglas de asignación por módulo.
     */
    delete: operations['ProjectsController_removeMember_v1'];
    options?: never;
    head?: never;
    /** Cambiar el rol de un miembro */
    patch: operations['ProjectsController_setMemberRole_v1'];
    trace?: never;
  };
  '/v1/reports/overview': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Resumen de métricas de diseño
     * @description Con `project`, requiere `reports:view` en ese proyecto; sin él, owner o admin y todos los proyectos. `from` y `to` filtran por la fecha de publicación. Ver docs/algorithms.md, Métricas.
     */
    get: operations['ReportsController_overview_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Revisiones visibles, filtradas y paginadas
     * @description `status` se repite (`status=open&status=in_review`). `overdue=true`: en turno de diseño y con el plazo vencido. `q` busca en id, título, tarjeta, número de PR y módulo.
     */
    get: operations['ReviewsController_list_v1'];
    put?: never;
    /**
     * Crear una revisión desde el manifiesto (ronda 1, borrador)
     * @description Responde las URLs firmadas para subir cada captura (PUT, 15 min). Si el PR ya tiene un borrador propio, lo reemplaza; si tiene una revisión publicada, 409 `reviews.exists` con `details.reviewId`.
     */
    post: operations['SkillController_create_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Una revisión con pantallas, rondas y URLs firmadas (15 min) */
    get: operations['ReviewsController_get_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** Cambiar la prioridad */
    patch: operations['ReviewsController_setPriority_v1'];
    trace?: never;
  };
  '/v1/reviews/{id}/activity': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Línea de tiempo de la revisión, más reciente primero */
    get: operations['ReviewsController_activity_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/assignees': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * Asignar la revisión
     * @description Diseñadores o líderes de diseño activos del proyecto; nunca el autor.
     */
    put: operations['ReviewsController_assign_v1'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/comments': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Comentarios de la revisión, del más antiguo al más reciente */
    get: operations['ReviewFeedbackController_comments_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/feedback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Feedback de la última ronda enviada, en texto para la sesión */
    get: operations['SkillController_feedback_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/publish': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Publicar la ronda subida
     * @description Verifica que cada captura exista con el tipo y tamaño declarados, asigna según la estrategia del proyecto y fija el plazo. Repetirlo no tiene efectos.
     */
    post: operations['SkillController_publish_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/reopen': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Reabrir: anula el último envío y vuelve a in_review
     * @description Plazo nuevo desde ahora según el SLA del proyecto. Avisa al autor.
     */
    post: operations['ReviewsController_reopen_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/rounds': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Subir una ronda nueva (mismo PR)
     * @description Solo después de un envío de diseño. Pide subir solo las pantallas nuevas o con otro hash; las demás heredan su veredicto.
     */
    post: operations['SkillController_addRound_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/screens/{key}/comments': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Comentarios de una pantalla */
    get: operations['ReviewFeedbackController_screenComments_v1'];
    put?: never;
    /**
     * Comentar una pantalla
     * @description `anchor` en fracciones 0–1 de la captura; `el` es el elemento elegido. `@nombre` o `@usuario-del-correo` notifica a esa persona si ve el proyecto.
     */
    post: operations['ReviewFeedbackController_addComment_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/screens/{key}/verdict': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * Veredicto de una pantalla
     * @description Requiere `verdicts:set` y no ser el autor. El primer veredicto pasa la revisión de `open` a `in_review`. Reemplaza al heredado (`inherited: false`).
     */
    put: operations['ReviewFeedbackController_setVerdict_v1'];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/reviews/{id}/submit': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Enviar la ronda
     * @description Todas las pantallas con veredicto. Con alguna «con ajuste» queda `changes_requested`; si no, `approved`. Marca el check del PR, avisa al autor y publica `ReviewSubmitted`. Aplica desde `open` (veredictos heredados) o `in_review`.
     */
    post: operations['ReviewFeedbackController_submit_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/skill/device': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Pedir acceso desde la skill
     * @description Devuelve el código que la persona aprueba en `verificationUriComplete` y el `deviceCode` para sondear. Vence a los 10 min. Máximo 10 por minuto por IP.
     */
    post: operations['SkillDeviceController_start_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/skill/device/token': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Sondear hasta recibir el token
     * @description Cada `interval` segundos. Aprobado: crea el token y lo entrega una sola vez (`secret`). Los errores siguen el RFC 8628: `device.pending` sigue esperando, `device.slow_down` pide 5 s más.
     */
    post: operations['SkillDeviceController_poll_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/skill/project': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Configuración del proyecto del token para capturar
     * @description Selectores a tapar, reglas de diseño, límites del manifiesto y `minSkillVersion`. Solo con token `qa_pat_`.
     */
    get: operations['SkillLookupController_project_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/skill/reviews': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * La revisión vigente de un PR
     * @description La más reciente del PR en el proyecto del token, sin vencidas ni borradores de otra persona. Solo con token `qa_pat_`.
     */
    get: operations['SkillLookupController_byPr_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/tokens': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Mis tokens vigentes, más recientes primero
     * @description Solo el prefijo: el valor completo se entrega una vez, al crearlo.
     */
    get: operations['TokensController_list_v1'];
    put?: never;
    /**
     * Crear un token para un proyecto
     * @description Requiere `tokens:own` en el proyecto. `secret` no se vuelve a entregar.
     */
    post: operations['TokensController_create_v1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/tokens/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * Revocar uno de mis tokens
     * @description Deja de servir de inmediato.
     */
    delete: operations['TokensController_revoke_v1'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/users': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Personas de la organización
     * @description El shell de la web la pide en cada página para nombres y avatares.
     */
    get: operations['OrganizationController_listUsers_v1'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/users/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /**
     * Cambiar el estado o el rol de organización de una persona
     * @description Exactamente uno de `status` u `orgRole`. Desactivar cierra sus sesiones y revoca sus tokens. Dar el rol owner exige `org:manage`.
     */
    patch: operations['OrganizationController_updateUser_v1'];
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    AcceptInviteInput: {
      /** @enum {string|null} */
      avatar?:
        | 'a01'
        | 'a02'
        | 'a03'
        | 'a04'
        | 'a05'
        | 'a06'
        | 'a07'
        | 'a08'
        | 'a09'
        | 'a10'
        | 'a11'
        | 'a12'
        | null;
      name: string;
      password: string;
    };
    ActivityEvent: {
      actor: string;
      /** Format: date-time */
      createdAt: string;
      id: string;
      review: string;
      text: string;
      type: components['schemas']['ActivityType'];
    };
    /** @enum {string} */
    ActivityType:
      | 'review_published'
      | 'round_uploaded'
      | 'review_assigned'
      | 'verdict_set'
      | 'comment_created'
      | 'comment_replied'
      | 'comment_resolved'
      | 'review_submitted'
      | 'review_reopened'
      | 'review_closed';
    Anchor: {
      x: number;
      y: number;
    };
    ApiToken: {
      /** Format: date-time */
      createdAt: string;
      id: string;
      label: string;
      /** Format: date-time */
      lastUsedAt: string | null;
      /** @example qa_pat_7f3a */
      prefix: string;
      project: string;
    };
    /** @enum {string} */
    AssignmentStrategy: 'manual' | 'round_robin' | 'by_module';
    AuditEvent: {
      actor: string;
      /** Format: date-time */
      createdAt: string;
      id: string;
      target: string;
      text: string;
      type: components['schemas']['AuditType'];
    };
    AuditPage: {
      items: components['schemas']['AuditEvent'][];
      pagination: components['schemas']['Pagination'];
    };
    /** @enum {string} */
    AuditType:
      | 'user_invited'
      | 'user_deactivated'
      | 'user_reactivated'
      | 'role_changed'
      | 'member_added'
      | 'member_removed'
      | 'token_created'
      | 'token_revoked'
      | 'project_created'
      | 'project_updated';
    Box: {
      h: number;
      w: number;
      x: number;
      y: number;
    };
    Comment: {
      anchor: components['schemas']['Anchor'] | null;
      author: string;
      body: string;
      /** Format: date-time */
      createdAt: string;
      el: components['schemas']['ElementRef'] | null;
      followUp: components['schemas']['FollowUp'] | null;
      id: string;
      replies: components['schemas']['CommentReply'][];
      resolved: boolean;
      review: string;
      round: number;
      screen: string;
    };
    CommentReply: {
      author: string;
      body: string;
      /** Format: date-time */
      createdAt: string;
      id: string;
    };
    CreatedToken: {
      /**
       * @description Solo se entrega una vez
       * @example qa_pat_…
       */
      secret: string;
      token: components['schemas']['ApiToken'];
    };
    DesignerLoad: {
      overdue: number;
      pending: number;
      userId: string;
    };
    DeviceAuthorization: {
      /** @description Secreto de la skill para sondear */
      deviceCode: string;
      /** @example 600 */
      expiresIn: number;
      /** @example 5 */
      interval: number;
      /** @example ABCD-EFGH */
      userCode: string;
      /** @example http://localhost:5173/device */
      verificationUri: string;
      /** @example http://localhost:5173/device?code=ABCD-EFGH */
      verificationUriComplete: string;
    };
    DeviceClient: {
      /** @example macbook-kevin */
      hostname: string;
      /** @example design-review */
      name: string;
      /** @example 0.1.0 */
      version: string;
    };
    DeviceGrant: {
      project: components['schemas']['DeviceProject'];
      /**
       * @description Solo se entrega una vez
       * @example qa_pat_…
       */
      secret: string;
      token: components['schemas']['ApiToken'];
      user: components['schemas']['DeviceUser'];
    };
    DeviceProject: {
      id: string;
      name: string;
    };
    DeviceRequest: {
      client: components['schemas']['DeviceClient'];
      /** Format: date-time */
      expiresAt: string;
      /** @example estudio-norte/lideris-v2 */
      repo: string | null;
      status: components['schemas']['DeviceStatus'];
      suggestedProjectId: string | null;
      /** @example ABCD-EFGH */
      userCode: string;
    };
    /** @enum {string} */
    DeviceStatus: 'pending' | 'approved' | 'denied' | 'expired';
    DeviceUser: {
      email: string;
      id: string;
      name: string;
    };
    Draft: {
      /** @description Pantallas que cambiaron en esta ronda */
      changed: string[];
      /** @example QR-0013 */
      id: string;
      /** @example 1 */
      round: number;
      /** @enum {string} */
      status: 'draft' | 'open' | 'in_review' | 'changes_requested' | 'approved';
      uploads: components['schemas']['Upload'][];
      /** @example http://localhost:5173/reviews/QR-0013 */
      url: string;
    };
    ElementRef: {
      /** @example src/lib/components/QuantityStepper.svelte */
      file: string;
      /** @example 42 */
      line: number;
      /** @example QuantityStepper */
      name: string;
      /** @example [data-qty-stepper] */
      selector: string;
    };
    FeedbackStatus: {
      comments: components['schemas']['Comment'][];
      review: components['schemas']['Review'];
      /** @description Texto listo para la sesión de Claude Code */
      text: string;
    };
    /** @enum {string} */
    FollowUp: 'resolved' | 'still';
    GithubIntegration: {
      /** @example design-review */
      checkName: string;
      commentOnPr: boolean;
      connected: boolean;
      /** @example acme/web */
      repo: string;
    };
    Invitation: {
      /** Format: date-time */
      createdAt: string;
      email: string;
      /** Format: date-time */
      expiresAt: string;
      id: string;
      invitedBy: string;
      projects: components['schemas']['Membership'][];
      role: components['schemas']['OrgRole'];
      status: components['schemas']['InviteStatus'];
    };
    InviteInfo: {
      email: string;
      inviter: string;
      org: string;
      /** @description Nombres de los proyectos */
      projects: string[];
      role: components['schemas']['OrgRole'];
      status: components['schemas']['InviteStatus'];
    };
    /** @enum {string} */
    InviteStatus: 'valid' | 'expired' | 'used' | 'revoked';
    LoginResult: {
      /**
       * @description Se guarda en una cookie httpOnly
       * @example qa_sess_…
       */
      token: string;
      user: components['schemas']['SessionUser'];
    };
    Membership: {
      /** @example lideris */
      projectId: string;
      role: components['schemas']['ProjectRole'];
    };
    ModuleChanges: {
      changes: number;
      module: string;
      screens: number;
    };
    ModuleRule: {
      /** @example /preorders/* */
      pattern: string;
      userId: string;
    };
    NewComment: {
      anchor?: {
        /** Format: float */
        x: number;
        /** Format: float */
        y: number;
      } | null;
      body: string;
      el?: {
        file: string;
        line: number;
        name: string;
        selector: string;
      } | null;
    };
    NewInvitation: {
      /** Format: email */
      email: string;
      /** @default [] */
      projects: {
        projectId: string;
        /** @enum {string} */
        role: 'project_admin' | 'design_lead' | 'designer' | 'developer' | 'viewer';
      }[];
      /** @enum {string} */
      role: 'owner' | 'admin' | 'member';
    };
    NewProject: {
      id: string;
      name: string;
      planeKey?: string;
      repo?: string;
    };
    Notification: {
      actor: string | null;
      comment: string | null;
      /** Format: date-time */
      createdAt: string;
      id: string;
      /** Format: date-time */
      readAt: string | null;
      review: string | null;
      screen: string | null;
      text: string;
      type: components['schemas']['NotificationType'];
    };
    NotificationPrefs: {
      due_soon: boolean;
      mention: boolean;
      overdue: boolean;
      reply: boolean;
      review_assigned: boolean;
      review_submitted: boolean;
      round_uploaded: boolean;
    };
    /** @enum {string} */
    NotificationType:
      | 'review_assigned'
      | 'round_uploaded'
      | 'review_submitted'
      | 'mention'
      | 'reply'
      | 'due_soon'
      | 'overdue';
    /** @enum {string} */
    OrgRole: 'owner' | 'admin' | 'member';
    Organization: {
      /** @example acme */
      id: string;
      /** @example Acme */
      name: string;
    };
    Pagination: {
      limit: number;
      page: number;
      total: number;
    };
    PlaneIntegration: {
      commentOnCard: boolean;
      connected: boolean;
      /** @example WEB */
      projectKey: string;
    };
    /** @enum {string} */
    Priority: 'urgent' | 'high' | 'medium' | 'low';
    ProfileInput: {
      /** @enum {string|null} */
      avatar?:
        | 'a01'
        | 'a02'
        | 'a03'
        | 'a04'
        | 'a05'
        | 'a06'
        | 'a07'
        | 'a08'
        | 'a09'
        | 'a10'
        | 'a11'
        | 'a12'
        | null;
      name: string;
    };
    Project: {
      designRules: string[];
      /**
       * @description Slug; no cambia
       * @example lideris
       */
      id: string;
      integrations: components['schemas']['ProjectIntegrations'];
      maskSelectors: string[];
      moduleRules: components['schemas']['ModuleRule'][];
      name: string;
      planeKey: string;
      repo: string;
      reviewsCount: number;
      slaDays: number;
      strategy: components['schemas']['AssignmentStrategy'];
    };
    ProjectIntegrations: {
      github: components['schemas']['GithubIntegration'];
      plane: components['schemas']['PlaneIntegration'];
    };
    ProjectMember: {
      projectId: string;
      role: components['schemas']['ProjectRole'];
      userId: string;
    };
    ProjectPatch: {
      designRules?: string[];
      integrations?: {
        github: {
          checkName: string;
          commentOnPr: boolean;
          connected: boolean;
          repo: string;
        };
        plane: {
          commentOnCard: boolean;
          connected: boolean;
          projectKey: string;
        };
      };
      maskSelectors?: string[];
      moduleRules?: {
        pattern: string;
        userId: string;
      }[];
      name?: string;
      slaDays?: number;
      /** @enum {string} */
      strategy?: 'manual' | 'round_robin' | 'by_module';
    };
    /** @enum {string} */
    ProjectRole: 'project_admin' | 'design_lead' | 'designer' | 'developer' | 'viewer';
    PullRequest: {
      base: string;
      /** @enum {string|null} */
      check: 'pending' | 'success' | 'failure' | null;
      commit: string;
      head: string;
      number: number;
      /** @enum {string} */
      state: 'open' | 'merged' | 'closed';
      url: string;
    };
    RecoveryInfo: {
      status: components['schemas']['RecoveryStatus'];
    };
    /** @enum {string} */
    RecoveryStatus: 'valid' | 'expired' | 'used';
    ReportFilters: {
      /** Format: date-time */
      from?: string;
      project?: string;
      /** Format: date-time */
      to?: string;
    };
    ReportsOverview: {
      avgRounds: number;
      changesByModule: components['schemas']['ModuleChanges'][];
      firstRoundApprovalRate: number;
      hoursToApproval: number;
      hoursToFirstReview: number;
      open: number;
      overdue: number;
      pendingByDesigner: components['schemas']['DesignerLoad'][];
      weekly: components['schemas']['Weekly'][];
    };
    Review: {
      assignees: string[];
      author: string;
      /** @example LIDER-628 */
      card: string;
      context: string;
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      dueAt: string | null;
      /** @example QR-0012 */
      id: string;
      module: string;
      notCaptured: string[];
      pr: components['schemas']['PullRequest'];
      priority: components['schemas']['Priority'];
      project: string;
      round: number;
      rounds: components['schemas']['Round'][];
      screens: components['schemas']['Screen'][];
      status: components['schemas']['ReviewStatus'];
      summary: components['schemas']['ReviewSummary'];
      title: string;
      /** Format: date-time */
      updatedAt: string;
    };
    ReviewPage: {
      items: components['schemas']['Review'][];
      pagination: components['schemas']['Pagination'];
    };
    /** @enum {string} */
    ReviewStatus: 'draft' | 'open' | 'in_review' | 'changes_requested' | 'approved' | 'closed';
    ReviewSummary: {
      rules: string[];
      steps: components['schemas']['SummaryStep'][];
    };
    Round: {
      by: string;
      changed: string[];
      /** Format: date-time */
      createdAt: string;
      n: number;
      note: string | null;
      submission: components['schemas']['RoundSubmission'] | null;
      verdicts: {
        [key: string]: components['schemas']['Verdict'];
      };
    };
    RoundSubmission: {
      approved: number;
      body: string | null;
      by: string;
      changes: number;
      /** Format: date-time */
      createdAt: string;
      /** @enum {string} */
      result: 'approved' | 'changes_requested';
    };
    Screen: {
      before: string | null;
      changedIn: number;
      changes: string[];
      diff: components['schemas']['Box'][];
      elements: components['schemas']['ScreenElement'][];
      /** @description URL firmada (15 min) */
      img: string | null;
      inherited: boolean;
      /** @example edit-with-changes-1280 */
      key: string;
      lead: string;
      previous: string | null;
      questions: string[];
      roundNote: string | null;
      /** @example /preorders/[id] */
      route: string;
      title: string;
      verdict: components['schemas']['Verdict'];
      /** @example 1280 × 720 */
      viewport: string;
    };
    ScreenElement: {
      box: components['schemas']['Box'];
      /** @example src/lib/components/QuantityStepper.svelte */
      file: string;
      id: string;
      /** @example 42 */
      line: number;
      /** @example QuantityStepper */
      name: string;
      /** @example [data-qty-stepper] */
      selector: string;
    };
    SessionUser: {
      avatar: string | null;
      email: string;
      id: string;
      memberships: components['schemas']['Membership'][];
      name: string;
      orgRole: components['schemas']['OrgRole'];
      status: components['schemas']['UserStatus'];
    };
    SkillLimits: {
      /**
       * @example [
       *       "image/png",
       *       "image/webp"
       *     ]
       */
      contentTypes: string[];
      /** @example 5242880 */
      maxBytes: number;
      /** @example 40 */
      maxScreens: number;
      viewport: components['schemas']['SkillViewport'];
    };
    SkillProject: {
      designRules: string[];
      /** @example lideris */
      id: string;
      limits: components['schemas']['SkillLimits'];
      /**
       * @example [
       *       "[data-private]"
       *     ]
       */
      maskSelectors: string[];
      /** @example 0.1.0 */
      minSkillVersion: string;
      name: string;
    };
    SkillReviewRef: {
      /** @example QR-0012 */
      id: string;
      round: number;
      /** @enum {string} */
      status: 'draft' | 'open' | 'in_review' | 'changes_requested' | 'approved' | 'closed';
      /** @example http://localhost:5173/reviews/QR-0012 */
      url: string;
    };
    SkillViewport: {
      /** @example 1920 */
      max: number;
      /** @example 1024 */
      min: number;
    };
    SummaryStep: {
      body: string;
      title: string;
    };
    Upload: {
      /** Format: date-time */
      expiresAt: string;
      headers: {
        [key: string]: string;
      };
      /** @enum {string} */
      kind: 'after' | 'before';
      screenKey: string;
      /** @description URL PUT firmada */
      url: string;
    };
    User: {
      /** @example a01 */
      avatar: string | null;
      /** Format: date-time */
      createdAt: string;
      email: string;
      id: string;
      /** Format: date-time */
      lastSeenAt: string | null;
      name: string;
      orgRole: components['schemas']['OrgRole'];
      status: components['schemas']['UserStatus'];
    };
    /** @enum {string} */
    UserStatus: 'active' | 'inactive';
    /** @enum {string} */
    Verdict: 'pending' | 'approved' | 'changes_requested';
    Weekly: {
      approved: number;
      opened: number;
      /** @example 2026-10-26 */
      week: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  HealthController_live: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  HealthController_ready: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  OrganizationController_audit_v1: {
    parameters: {
      query?: {
        type?:
          | 'user_invited'
          | 'user_deactivated'
          | 'user_reactivated'
          | 'role_changed'
          | 'member_added'
          | 'member_removed'
          | 'token_created'
          | 'token_revoked'
          | 'project_created'
          | 'project_updated';
        actor?: string;
        page?: number;
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['AuditPage'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_login_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** Format: email */
          email: string;
          password: string;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['LoginResult'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.invalid */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.invalid
             * @enum {string}
             */
            messageKey: 'auth.invalid';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_logout_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_logoutAll_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_requestRecovery_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** Format: email */
          email: string;
        };
      };
    };
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_recoveryInfo_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        token: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['RecoveryInfo'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description recovery.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example recovery.not_found
             * @enum {string}
             */
            messageKey: 'recovery.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_resetPassword_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        token: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          password: string;
        };
      };
    };
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description recovery.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example recovery.not_found
             * @enum {string}
             */
            messageKey: 'recovery.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description recovery.gone */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example recovery.gone
             * @enum {string}
             */
            messageKey: 'recovery.gone';
            /** @example 410 */
            statusCode: number;
          };
        };
      };
    };
  };
  CommentsController_remove_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description comments.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example comments.forbidden
             * @enum {string}
             */
            messageKey: 'comments.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description comments.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example comments.not_found
             * @enum {string}
             */
            messageKey: 'comments.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  CommentsController_resolve_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          resolved: boolean;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Comment'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description comments.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example comments.forbidden
             * @enum {string}
             */
            messageKey: 'comments.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description comments.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example comments.not_found
             * @enum {string}
             */
            messageKey: 'comments.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  CommentsController_followUp_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          followUp: 'resolved' | 'still';
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Comment'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description comments.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example comments.not_found
             * @enum {string}
             */
            messageKey: 'comments.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description comments.not_previous_round */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example comments.not_previous_round
             * @enum {string}
             */
            messageKey: 'comments.not_previous_round';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  CommentsController_reply_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          body: string;
        };
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['CommentReply'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description comments.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example comments.not_found
             * @enum {string}
             */
            messageKey: 'comments.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey: 'reviews.stale_status';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  DeviceController_get_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userCode: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['DeviceRequest'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description device.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.not_found
             * @enum {string}
             */
            messageKey: 'device.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description device.rate_limited */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.rate_limited
             * @enum {string}
             */
            messageKey: 'device.rate_limited';
            /** @example 429 */
            statusCode: number;
          };
        };
      };
    };
  };
  DeviceController_approve_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userCode: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          label?: string;
          projectId: string;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['DeviceRequest'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description device.not_found · projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.not_found
             * @enum {string}
             */
            messageKey: 'device.not_found' | 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description device.used */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.used
             * @enum {string}
             */
            messageKey: 'device.used';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
      /** @description device.expired */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.expired
             * @enum {string}
             */
            messageKey: 'device.expired';
            /** @example 410 */
            statusCode: number;
          };
        };
      };
      /** @description device.rate_limited */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.rate_limited
             * @enum {string}
             */
            messageKey: 'device.rate_limited';
            /** @example 429 */
            statusCode: number;
          };
        };
      };
    };
  };
  DeviceController_deny_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        userCode: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description device.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.not_found
             * @enum {string}
             */
            messageKey: 'device.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description device.used */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.used
             * @enum {string}
             */
            messageKey: 'device.used';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
      /** @description device.expired */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.expired
             * @enum {string}
             */
            messageKey: 'device.expired';
            /** @example 410 */
            statusCode: number;
          };
        };
      };
      /** @description device.rate_limited */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.rate_limited
             * @enum {string}
             */
            messageKey: 'device.rate_limited';
            /** @example 429 */
            statusCode: number;
          };
        };
      };
    };
  };
  OrganizationController_listInvitations_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Invitation'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
    };
  };
  OrganizationController_invite_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['NewInvitation'];
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Invitation'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation · invite.invalid_projects */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'invite.invalid_projects';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description users.exists · invite.pending */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example users.exists
             * @enum {string}
             */
            messageKey: 'users.exists' | 'invite.pending';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  OrganizationController_revokeInvitation_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description invite.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example invite.not_found
             * @enum {string}
             */
            messageKey: 'invite.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_inviteInfo_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        token: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['InviteInfo'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description invite.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example invite.not_found
             * @enum {string}
             */
            messageKey: 'invite.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_acceptInvite_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        token: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['AcceptInviteInput'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['LoginResult'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description invite.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example invite.not_found
             * @enum {string}
             */
            messageKey: 'invite.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description users.exists */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example users.exists
             * @enum {string}
             */
            messageKey: 'users.exists';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
      /** @description invite.expired · invite.used · invite.revoked */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example invite.expired
             * @enum {string}
             */
            messageKey: 'invite.expired' | 'invite.used' | 'invite.revoked';
            /** @example 410 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_me_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['SessionUser'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_updateProfile_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ProfileInput'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['SessionUser'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  NotificationsController_prefs_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['NotificationPrefs'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  NotificationsController_updatePrefs_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          due_soon: boolean;
          mention: boolean;
          overdue: boolean;
          reply: boolean;
          review_assigned: boolean;
          review_submitted: boolean;
          round_uploaded: boolean;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['NotificationPrefs'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  AuthController_changePassword_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          current: string;
          next: string;
        };
      };
    };
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description common.validation · auth.wrong_password · auth.same_password */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'auth.wrong_password' | 'auth.same_password';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  NotificationsController_list_v1: {
    parameters: {
      query?: {
        unread?: boolean;
        mentions?: boolean;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Notification'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  NotificationsController_markAllRead_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  NotificationsController_unreadCount_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: number;
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  NotificationsController_markRead_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description notifications.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example notifications.not_found
             * @enum {string}
             */
            messageKey: 'notifications.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  OrganizationController_organization_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Organization'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_list_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Project'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_create_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['NewProject'];
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Project'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.exists */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.exists
             * @enum {string}
             */
            messageKey: 'projects.exists';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_get_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Project'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_update_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ProjectPatch'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Project'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation · projects.invalid_rules */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'projects.invalid_rules';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_listMembers_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['ProjectMember'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_addMember_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          role: 'project_admin' | 'design_lead' | 'designer' | 'developer' | 'viewer';
          userId: string;
        };
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['ProjectMember'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found · users.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found' | 'users.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description members.exists · users.inactive */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example members.exists
             * @enum {string}
             */
            messageKey: 'members.exists' | 'users.inactive';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_removeMember_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
        userId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found · members.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found' | 'members.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description members.self */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example members.self
             * @enum {string}
             */
            messageKey: 'members.self';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  ProjectsController_setMemberRole_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
        userId: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          role: 'project_admin' | 'design_lead' | 'designer' | 'developer' | 'viewer';
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['ProjectMember'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found · members.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found' | 'members.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReportsController_overview_v1: {
    parameters: {
      query?: {
        project?: string;
        from?: string;
        to?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['ReportsOverview'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewsController_list_v1: {
    parameters: {
      query?: {
        status?: ('draft' | 'open' | 'in_review' | 'changes_requested' | 'approved' | 'closed')[];
        project?: string;
        author?: string;
        assignee?: string;
        priority?: 'urgent' | 'high' | 'medium' | 'low';
        overdue?: boolean;
        q?: string;
        sort?: 'updated' | 'due' | 'priority';
        page?: number;
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['ReviewPage'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillController_create_v1: {
    parameters: {
      query?: never;
      header: {
        /** @description Una por intento lógico. Misma clave y mismo body → misma respuesta durante 24 h. */
        'Idempotency-Key': string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          card: {
            key: string;
            title: string;
          };
          context?: string;
          generator?: {
            name: string;
            version: string;
          } | null;
          manifestVersion: number;
          module?: string;
          /** @default [] */
          notCaptured?: (
            | string
            | {
                body: string;
                title: string;
              }
          )[];
          note?: string | null;
          pr: {
            author: string;
            base: string;
            commit: string;
            head: string;
            number: number;
            title: string;
            url: string;
          };
          privacy: {
            dataset: string;
            masked: boolean;
          };
          project: string;
          screens: {
            captures: {
              after: {
                bytes: number;
                contentType: string;
                key: string;
                sha256: string;
              };
              before?: {
                bytes: number;
                contentType: string;
                key: string;
                sha256: string;
              } | null;
            };
            /** @default [] */
            changes?: string[];
            /** @default [] */
            diff?: {
              /** Format: float */
              h: number;
              /** Format: float */
              w: number;
              /** Format: float */
              x: number;
              /** Format: float */
              y: number;
            }[];
            /** @default [] */
            elements?: {
              box: {
                /** Format: float */
                h: number;
                /** Format: float */
                w: number;
                /** Format: float */
                x: number;
                /** Format: float */
                y: number;
              };
              file: string;
              line: number;
              name: string;
              selector: string;
            }[];
            key: string;
            lead?: string;
            note?: string | null;
            /** @default [] */
            questions?: string[];
            route: string;
            title: string;
            viewport: {
              height: number;
              width: number;
            };
          }[];
          /**
           * @default {
           *       "rules": [],
           *       "steps": []
           *     }
           */
          summary?: {
            /** @default [] */
            rules?: string[];
            /** @default [] */
            steps?: {
              body: string;
              title: string;
            }[];
          };
          title: string;
        };
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Draft'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation · idempotency.required */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'idempotency.required';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden · manifest.project_mismatch */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden' | 'manifest.project_mismatch';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description idempotency.in_progress · reviews.exists */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example idempotency.in_progress
             * @enum {string}
             */
            messageKey: 'idempotency.in_progress' | 'reviews.exists';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
      /** @description idempotency.mismatch · manifest.version_unsupported · manifest.privacy_required · manifest.too_many_screens · manifest.invalid_capture · manifest.viewport · manifest.duplicate_screens */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example idempotency.mismatch
             * @enum {string}
             */
            messageKey:
              | 'idempotency.mismatch'
              | 'manifest.version_unsupported'
              | 'manifest.privacy_required'
              | 'manifest.too_many_screens'
              | 'manifest.invalid_capture'
              | 'manifest.viewport'
              | 'manifest.duplicate_screens';
            /** @example 422 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewsController_get_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Review'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewsController_setPriority_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          priority: 'urgent' | 'high' | 'medium' | 'low';
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Review'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey: 'reviews.stale_status';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewsController_activity_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['ActivityEvent'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewsController_assign_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          assignees: string[];
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Review'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation · reviews.invalid_assignees */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'reviews.invalid_assignees';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey: 'reviews.stale_status';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewFeedbackController_comments_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Comment'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillController_feedback_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['FeedbackStatus'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillController_publish_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Draft'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey: 'reviews.stale_status';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.missing_uploads */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.missing_uploads
             * @enum {string}
             */
            messageKey: 'reviews.missing_uploads';
            /** @example 422 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewsController_reopen_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          reason: string;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Review'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey: 'reviews.stale_status';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillController_addRound_v1: {
    parameters: {
      query?: never;
      header: {
        /** @description Una por intento lógico. Misma clave y mismo body → misma respuesta durante 24 h. */
        'Idempotency-Key': string;
      };
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          card: {
            key: string;
            title: string;
          };
          context?: string;
          generator?: {
            name: string;
            version: string;
          } | null;
          manifestVersion: number;
          module?: string;
          /** @default [] */
          notCaptured?: (
            | string
            | {
                body: string;
                title: string;
              }
          )[];
          note?: string | null;
          pr: {
            author: string;
            base: string;
            commit: string;
            head: string;
            number: number;
            title: string;
            url: string;
          };
          privacy: {
            dataset: string;
            masked: boolean;
          };
          project: string;
          screens: {
            captures: {
              after: {
                bytes: number;
                contentType: string;
                key: string;
                sha256: string;
              };
              before?: {
                bytes: number;
                contentType: string;
                key: string;
                sha256: string;
              } | null;
            };
            /** @default [] */
            changes?: string[];
            /** @default [] */
            diff?: {
              /** Format: float */
              h: number;
              /** Format: float */
              w: number;
              /** Format: float */
              x: number;
              /** Format: float */
              y: number;
            }[];
            /** @default [] */
            elements?: {
              box: {
                /** Format: float */
                h: number;
                /** Format: float */
                w: number;
                /** Format: float */
                x: number;
                /** Format: float */
                y: number;
              };
              file: string;
              line: number;
              name: string;
              selector: string;
            }[];
            key: string;
            lead?: string;
            note?: string | null;
            /** @default [] */
            questions?: string[];
            route: string;
            title: string;
            viewport: {
              height: number;
              width: number;
            };
          }[];
          /**
           * @default {
           *       "rules": [],
           *       "steps": []
           *     }
           */
          summary?: {
            /** @default [] */
            rules?: string[];
            /** @default [] */
            steps?: {
              body: string;
              title: string;
            }[];
          };
          title: string;
        };
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Draft'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation · idempotency.required */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'idempotency.required';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden · manifest.project_mismatch */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden' | 'manifest.project_mismatch';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description idempotency.in_progress · reviews.stale_status */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example idempotency.in_progress
             * @enum {string}
             */
            messageKey: 'idempotency.in_progress' | 'reviews.stale_status';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
      /** @description idempotency.mismatch · manifest.version_unsupported · manifest.privacy_required · manifest.too_many_screens · manifest.invalid_capture · manifest.viewport · manifest.duplicate_screens · manifest.pr_mismatch · manifest.review_mismatch · manifest.no_changes */
      422: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example idempotency.mismatch
             * @enum {string}
             */
            messageKey:
              | 'idempotency.mismatch'
              | 'manifest.version_unsupported'
              | 'manifest.privacy_required'
              | 'manifest.too_many_screens'
              | 'manifest.invalid_capture'
              | 'manifest.viewport'
              | 'manifest.duplicate_screens'
              | 'manifest.pr_mismatch'
              | 'manifest.review_mismatch'
              | 'manifest.no_changes';
            /** @example 422 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewFeedbackController_screenComments_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
        key: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Comment'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewFeedbackController_addComment_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
        key: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['NewComment'];
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Comment'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found · screens.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found' | 'screens.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey: 'reviews.stale_status';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewFeedbackController_setVerdict_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
        key: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          verdict: 'pending' | 'approved' | 'changes_requested';
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Review'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden · verdicts.author_forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden' | 'verdicts.author_forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found · screens.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found' | 'screens.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status · reviews.already_submitted */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey: 'reviews.stale_status' | 'reviews.already_submitted';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  ReviewFeedbackController_submit_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          body?: string | null;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['Review'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden · verdicts.author_forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden' | 'verdicts.author_forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found · screens.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found' | 'screens.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.stale_status · reviews.already_submitted · reviews.pending_screens */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.stale_status
             * @enum {string}
             */
            messageKey:
              'reviews.stale_status' | 'reviews.already_submitted' | 'reviews.pending_screens';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillDeviceController_start_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          client: {
            hostname: string;
            name: string;
            version: string;
          };
          repo?: string | null;
        };
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['DeviceAuthorization'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description device.rate_limited */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.rate_limited
             * @enum {string}
             */
            messageKey: 'device.rate_limited';
            /** @example 429 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillDeviceController_poll_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          deviceCode: string;
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['DeviceGrant'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation · device.pending */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'device.pending';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description device.denied */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.denied
             * @enum {string}
             */
            messageKey: 'device.denied';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description device.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.not_found
             * @enum {string}
             */
            messageKey: 'device.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description device.used */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.used
             * @enum {string}
             */
            messageKey: 'device.used';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
      /** @description device.expired */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.expired
             * @enum {string}
             */
            messageKey: 'device.expired';
            /** @example 410 */
            statusCode: number;
          };
        };
      };
      /** @description device.slow_down */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example device.slow_down
             * @enum {string}
             */
            messageKey: 'device.slow_down';
            /** @example 429 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillLookupController_project_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['SkillProject'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description skill.token_required */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example skill.token_required
             * @enum {string}
             */
            messageKey: 'skill.token_required';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  SkillLookupController_byPr_v1: {
    parameters: {
      query: {
        pr: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['SkillReviewRef'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation · skill.token_required */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation' | 'skill.token_required';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description reviews.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example reviews.not_found
             * @enum {string}
             */
            messageKey: 'reviews.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  TokensController_list_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['ApiToken'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  TokensController_create_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          label: string;
          projectId: string;
        };
      };
    };
    responses: {
      /** @description OK */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['CreatedToken'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description projects.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example projects.not_found
             * @enum {string}
             */
            messageKey: 'projects.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  TokensController_revoke_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Sin cuerpo */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description tokens.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example tokens.not_found
             * @enum {string}
             */
            messageKey: 'tokens.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
    };
  };
  OrganizationController_listUsers_v1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['User'][];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
    };
  };
  OrganizationController_updateUser_v1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @enum {string} */
          orgRole?: 'owner' | 'admin' | 'member';
          /** @enum {string} */
          status?: 'active' | 'inactive';
        };
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            data: components['schemas']['User'];
            /** @example ok */
            messageKey: string;
          };
        };
      };
      /** @description common.validation */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example common.validation
             * @enum {string}
             */
            messageKey: 'common.validation';
            /** @example 400 */
            statusCode: number;
          };
        };
      };
      /** @description auth.required · auth.session_expired */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.required
             * @enum {string}
             */
            messageKey: 'auth.required' | 'auth.session_expired';
            /** @example 401 */
            statusCode: number;
          };
        };
      };
      /** @description auth.forbidden */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example auth.forbidden
             * @enum {string}
             */
            messageKey: 'auth.forbidden';
            /** @example 403 */
            statusCode: number;
          };
        };
      };
      /** @description users.not_found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example users.not_found
             * @enum {string}
             */
            messageKey: 'users.not_found';
            /** @example 404 */
            statusCode: number;
          };
        };
      };
      /** @description users.self · users.owner · users.changed */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            details?: Record<string, never>;
            message: string;
            /**
             * @example users.self
             * @enum {string}
             */
            messageKey: 'users.self' | 'users.owner' | 'users.changed';
            /** @example 409 */
            statusCode: number;
          };
        };
      };
    };
  };
}
