// Contrato de dominio (docs/architecture/domain.md + api.md + users-and-roles.md).
// Tipos del read model de la plataforma. El read model que arma el API desde el
// manifiesto de la skill puede diferir (p. ej. `dueAt` ISO se calcula en el server).

/* ── Organización y usuarios ─────────────────────────────────────────── */

export type OrgRole = 'owner' | 'admin' | 'member';
export type UserStatus = 'active' | 'inactive';

export interface Organization {
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  orgRole: OrgRole;
  status: UserStatus;
  last?: string;
}

export type SessionUser = Pick<User, 'id' | 'name' | 'email' | 'orgRole' | 'status'>;

/* ── Proyecto ────────────────────────────────────────────────────────── */

export type ProjectRole = 'project_admin' | 'design_lead' | 'designer' | 'developer' | 'viewer';
export type AssignmentStrategy = 'manual' | 'round_robin' | 'by_module';

export interface Project {
  id: string;
  name: string;
  repo: string;
  plane: string;
  sla: number;
  strategy: AssignmentStrategy;
  reviews: number;
}

export interface ProjectMember {
  userId: string;
  projectId: string;
  role: ProjectRole;
}

/* ── Invitación y recuperación ──────────────────────────────────────── */

export type InviteStatus = 'valid' | 'expired' | 'used' | 'revoked';
export type RecoveryStatus = 'valid' | 'expired' | 'used';

export interface InviteInfo {
  status: InviteStatus;
  org: string;
  inviter: string;
  role: OrgRole;
  projects: string[];
}

export interface RecoveryInfo {
  status: RecoveryStatus;
}

/* ── Revisión ────────────────────────────────────────────────────────── */

export type ReviewStatus =
  'draft' | 'open' | 'in_review' | 'changes_requested' | 'approved' | 'closed';

export type Priority = 'urgente' | 'alta' | 'media' | 'baja';
export type DueTone = 'soon' | 'late' | 'ok' | 'muted';

export interface DueInfo {
  label: string;
  tone: DueTone;
}

export interface ReviewSummary {
  steps: Array<{ title: string; body: string }>;
  rules: string[];
}

export interface Review {
  id: string;
  title: string;
  context: string;
  card: string;
  pr: number;
  base: string;
  head: string;
  project: string;
  module: string;
  author: string;
  assignees: string[];
  status: ReviewStatus;
  round: number;
  priority: Priority;
  due: DueInfo;
  updated: string;
  screens: Screen[];
  rounds: Round[];
  summary: ReviewSummary;
  notCaptured: string[];
}

/* ── Pantalla ────────────────────────────────────────────────────────── */

export type Verdict = 'pending' | 'approved' | 'changes_requested';

export interface DiffBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ElementRef {
  name: string;
  file: string;
  line: number;
  selector: string;
}

export interface ScreenElement extends ElementRef {
  id: string;
  box: DiffBox;
}

export interface Screen {
  key: string;
  title: string;
  lead: string;
  vp: string;
  route: string;
  img: string | null;
  before: string | null;
  r1?: string | null;
  changedIn?: number;
  inherited?: boolean;
  roundNote?: string;
  diff?: DiffBox[];
  elements: ScreenElement[];
  changes: string[];
  questions: string[];
  verdict: Verdict;
}

/* ── Ronda ───────────────────────────────────────────────────────────── */

export interface RoundSubmission {
  by: string;
  when: string;
  result: ReviewStatus;
  approved: number;
  changes: number;
  body?: string;
}

export interface Round {
  n: number;
  by: string;
  when: string;
  note?: string;
  changed?: string[];
  verdicts?: Record<string, Verdict>;
  submission?: RoundSubmission;
}

/* ── Comentario ──────────────────────────────────────────────────────── */

export type FollowUp = 'resolved' | 'still' | null;

export interface Anchor {
  x: number;
  y: number;
}

export interface CommentReply {
  author: string;
  when: string;
  body: string;
}

export interface Comment {
  id: string;
  review: string;
  screen: string;
  round: number;
  author: string;
  when: string;
  body: string;
  anchor: Anchor | null;
  el: ElementRef | null;
  resolved: boolean;
  followUp: FollowUp;
  replies: CommentReply[];
}

/* ── Notificaciones, actividad y tokens ──────────────────────────────── */

export interface Notification {
  text: string;
  when: string;
  unread: boolean;
}

export type ActivityTone = 'info' | 'muted' | 'warning' | 'success';

export interface ActivityEvent {
  who: string;
  what: string;
  review: string;
  when: string;
  icon: string;
  tone: ActivityTone;
}

export interface ApiToken {
  id: string;
  label: string;
  prefix: string;
  project: string;
  createdAt: string;
  lastUsedAt: string | null;
}

/* ── Paginación ──────────────────────────────────────────────────────── */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
