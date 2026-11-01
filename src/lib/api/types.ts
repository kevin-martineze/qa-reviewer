// Contrato con el API (docs/architecture/domain.md, api.md y users-and-roles.md).
// Los tipos salen del OpenAPI del API (`generated/schema.ts`, `pnpm types:sync`); este archivo
// solo les da nombre para que el resto de la web no dependa del generador.
// Reglas para que el adaptador http sea un reemplazo directo del mock:
// - Fechas en ISO 8601 UTC (`...At`). La UI las formatea; el contrato nunca trae textos como «Hace 2 h».
// - Referencias a otras entidades por id (`author`, `assignees`, `project`, `actor`).
// - Nada de presentación (íconos, tonos, etiquetas): la UI los deriva del `type` o del estado.

import type { components } from './generated/schema';

type Schemas = components['schemas'];

/* ── Organización y usuarios ─────────────────────────────────────────── */

export type OrgRole = Schemas['OrgRole'];
export type UserStatus = Schemas['UserStatus'];
export type Organization = Schemas['Organization'];
export type User = Schemas['User'];
export type Membership = Schemas['Membership'];
/** `GET /me`: el usuario de la sesión con sus membresías. Los permisos se derivan en el front. */
export type SessionUser = Schemas['SessionUser'];
/** `PATCH /me`. */
export type ProfileInput = Schemas['ProfileInput'];
/** `POST /invitations/:token/accept`. */
export type AcceptInviteInput = Schemas['AcceptInviteInput'];
/** `POST /auth/login`: el server de SvelteKit guarda `token` en una cookie httpOnly. */
export type LoginResult = Schemas['LoginResult'];

/* ── Proyecto ────────────────────────────────────────────────────────── */

export type ProjectRole = Schemas['ProjectRole'];
export type AssignmentStrategy = Schemas['AssignmentStrategy'];
export type ModuleRule = Schemas['ModuleRule'];
export type ProjectIntegrations = Schemas['ProjectIntegrations'];
export type Project = Schemas['Project'];
export type ProjectMember = Schemas['ProjectMember'];

/* ── Invitación y recuperación ──────────────────────────────────────── */

export type InviteStatus = Schemas['InviteStatus'];
export type RecoveryStatus = Schemas['RecoveryStatus'];
export type InviteInfo = Schemas['InviteInfo'];
export type Invitation = Schemas['Invitation'];
/** `POST /invitations` y `POST /invitations/:id/link`: el enlace con el token se ve solo aquí. */
export type CreatedInvitation = Schemas['CreatedInvitation'];
export type RecoveryInfo = Schemas['RecoveryInfo'];

/* ── Revisión ────────────────────────────────────────────────────────── */

export type ReviewStatus = Schemas['ReviewStatus'];
export type Priority = Schemas['Priority'];
export type ReviewSummary = Schemas['ReviewSummary'];
export type PullRequest = Schemas['PullRequest'];
export type Review = Schemas['Review'];

/* ── Pantalla ────────────────────────────────────────────────────────── */

export type Verdict = Schemas['Verdict'];
export type Box = Schemas['Box'];
export type ElementRef = Schemas['ElementRef'];
export type ScreenElement = Schemas['ScreenElement'];
export type Screen = Schemas['Screen'];

/* ── Ronda ───────────────────────────────────────────────────────────── */

export type RoundSubmission = Schemas['RoundSubmission'];
export type Round = Schemas['Round'];

/* ── Comentario ──────────────────────────────────────────────────────── */

export type FollowUp = Schemas['FollowUp'];
export type Anchor = Schemas['Anchor'];
export type CommentReply = Schemas['CommentReply'];
export type Comment = Schemas['Comment'];

/* ── Notificaciones ──────────────────────────────────────────────────── */

export type NotificationType = Schemas['NotificationType'];
export type Notification = Schemas['Notification'];
/** Qué eventos llegan también por correo; in-app siempre llega. */
export type NotificationPrefs = Schemas['NotificationPrefs'];

/* ── Actividad y auditoría ───────────────────────────────────────────── */

export type ActivityType = Schemas['ActivityType'];
export type ActivityEvent = Schemas['ActivityEvent'];
export type AuditType = Schemas['AuditType'];
export type AuditEvent = Schemas['AuditEvent'];

/* ── Tokens de la skill ──────────────────────────────────────────────── */

export type ApiToken = Schemas['ApiToken'];
export type CreatedToken = Schemas['CreatedToken'];

/* ── Login de la skill por navegador (device flow) ───────────────────── */

export type DeviceStatus = Schemas['DeviceStatus'];
/** Equipo desde el que la skill pide acceso. Lo informa la skill: es texto, no prueba nada. */
export type DeviceClient = Schemas['DeviceClient'];
export type DeviceRequest = Schemas['DeviceRequest'];

/* ── Métricas ────────────────────────────────────────────────────────── */

export type ReportFilters = Schemas['ReportFilters'];
export type ReportsOverview = Schemas['ReportsOverview'];

/* ── Paginación ──────────────────────────────────────────────────────── */

export type Pagination = Schemas['Pagination'];
export type ReviewPage = Schemas['ReviewPage'];
export type AuditPage = Schemas['AuditPage'];
