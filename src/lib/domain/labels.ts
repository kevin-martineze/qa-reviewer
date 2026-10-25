import type {
  ActivityType,
  AssignmentStrategy,
  AuditType,
  NotificationType,
  OrgRole,
  Priority,
  ProjectRole,
  ReviewStatus,
  Verdict,
} from '$lib/api/types';
import type { Tone } from './tone';

interface Label {
  label: string;
  tone: Tone;
}

export const REVIEW_STATUS: Record<ReviewStatus, Label> = {
  draft: { label: 'Borrador', tone: 'muted' },
  open: { label: 'Abierta', tone: 'info' },
  in_review: { label: 'En revisión', tone: 'info' },
  changes_requested: { label: 'Requiere ajustes', tone: 'warning' },
  approved: { label: 'Aprobada', tone: 'success' },
  closed: { label: 'Cerrada', tone: 'muted' },
};

export const VERDICT: Record<Verdict, Label> = {
  pending: { label: 'Sin veredicto', tone: 'muted' },
  approved: { label: 'Aprobada', tone: 'success' },
  changes_requested: { label: 'Requiere ajuste', tone: 'warning' },
};

export const PRIORITY: Record<Priority, Label & { rank: number }> = {
  urgent: { label: 'Urgente', tone: 'danger', rank: 0 },
  high: { label: 'Alta', tone: 'warning', rank: 1 },
  medium: { label: 'Media', tone: 'neutral', rank: 2 },
  low: { label: 'Baja', tone: 'muted', rank: 3 },
};

export const ORG_ROLE: Record<OrgRole, { label: string; description: string }> = {
  owner: { label: 'Owner', description: 'Todo, incluido transferir la propiedad.' },
  admin: { label: 'Admin', description: 'Invita usuarios, crea proyectos y ve todo.' },
  member: { label: 'Miembro', description: 'Solo los proyectos donde es miembro.' },
};

export const PROJECT_ROLE: Record<ProjectRole, { label: string; description: string }> = {
  project_admin: {
    label: 'Admin del proyecto',
    description: 'Configura el proyecto y gestiona miembros.',
  },
  design_lead: {
    label: 'Líder de diseño',
    description: 'Asigna, da veredicto y puede reabrir un envío.',
  },
  designer: { label: 'Diseñador', description: 'Da veredicto y comenta.' },
  developer: { label: 'Desarrollador', description: 'Sube revisiones con la skill y responde.' },
  viewer: { label: 'Lector', description: 'Solo lectura y comentarios.' },
};

export const STRATEGY: Record<AssignmentStrategy, { label: string; description: string }> = {
  manual: { label: 'Manual', description: 'El líder de diseño asigna cada revisión.' },
  round_robin: {
    label: 'Por turnos',
    description: 'Se reparte entre los diseñadores activos del proyecto.',
  },
  by_module: {
    label: 'Por módulo',
    description: 'Cada ruta del frontend tiene un diseñador responsable.',
  },
};

export const NOTIFICATION_TYPE: Record<NotificationType, { label: string; email: string }> = {
  review_assigned: { label: 'Revisión asignada', email: 'Cuando te asignan una revisión' },
  round_uploaded: { label: 'Nueva ronda', email: 'Cuando el autor sube una ronda nueva' },
  review_submitted: {
    label: 'Revisión enviada',
    email: 'Cuando diseño envía una revisión tuya',
  },
  mention: { label: 'Mención', email: 'Cuando alguien te menciona con @' },
  reply: { label: 'Respuesta', email: 'Cuando responden un comentario tuyo' },
  due_soon: { label: 'Por vencer', email: 'Cuando una revisión asignada vence en 24 h' },
  overdue: { label: 'Vencida', email: 'Cuando una revisión asignada se vence' },
};

export const ACTIVITY_TYPE: Record<ActivityType, Label> = {
  review_published: { label: 'Publicó', tone: 'info' },
  round_uploaded: { label: 'Nueva ronda', tone: 'info' },
  review_assigned: { label: 'Asignó', tone: 'muted' },
  verdict_set: { label: 'Veredicto', tone: 'muted' },
  comment_created: { label: 'Comentó', tone: 'muted' },
  comment_replied: { label: 'Respondió', tone: 'muted' },
  comment_resolved: { label: 'Resolvió', tone: 'success' },
  review_submitted: { label: 'Envió', tone: 'warning' },
  review_reopened: { label: 'Reabrió', tone: 'warning' },
  review_closed: { label: 'Cerró', tone: 'muted' },
};

export const AUDIT_TYPE: Record<AuditType, string> = {
  user_invited: 'Invitación',
  user_deactivated: 'Usuario desactivado',
  user_reactivated: 'Usuario reactivado',
  role_changed: 'Cambio de rol',
  member_added: 'Miembro agregado',
  member_removed: 'Miembro quitado',
  token_created: 'Token creado',
  token_revoked: 'Token revocado',
  project_updated: 'Proyecto actualizado',
};

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}
