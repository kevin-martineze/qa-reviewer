// Puertos (interfaces de gateway) que consumen las rutas.
// Las rutas dependen SOLO de estas interfaces, nunca de un adaptador concreto.
// Cada método refleja un endpoint de docs/architecture/api.md y devuelve Result<T>.
import type { Result } from './result';
import type {
  ActivityEvent,
  Anchor,
  ApiToken,
  AuditEvent,
  AuditType,
  Comment,
  CommentReply,
  CreatedToken,
  ElementRef,
  FollowUp,
  Invitation,
  InviteInfo,
  LoginResult,
  Membership,
  Notification,
  NotificationPrefs,
  Organization,
  OrgRole,
  PaginatedResponse,
  Priority,
  Project,
  ProjectMember,
  ProjectRole,
  RecoveryInfo,
  ReportFilters,
  ReportsOverview,
  Review,
  ReviewStatus,
  SessionUser,
  User,
  UserStatus,
  Verdict,
} from './types';

/* ── Revisiones ──────────────────────────────────────────────────────── */

export type ReviewSort = 'updated' | 'due' | 'priority';

export interface ReviewFilters {
  status?: ReviewStatus[];
  project?: string;
  author?: string;
  assignee?: string;
  priority?: Priority;
  overdue?: boolean;
  q?: string;
  sort?: ReviewSort;
  page?: number;
  limit?: number;
}

export interface ReviewsGateway {
  list(filters: ReviewFilters): Promise<Result<PaginatedResponse<Review>>>;
  get(id: string): Promise<Result<Review>>;
  activity(id: string): Promise<Result<ActivityEvent[]>>;
  assign(id: string, assignees: string[]): Promise<Result<Review>>;
  setPriority(id: string, priority: Priority): Promise<Result<Review>>;
  /** Anula el último envío y vuelve a `in_review` (`reviews:reopen`). */
  reopen(id: string, reason: string): Promise<Result<Review>>;
}

/* ── Feedback: veredictos y comentarios ──────────────────────────────── */

export interface NewComment {
  body: string;
  anchor: Anchor | null;
  el: ElementRef | null;
}

export interface FeedbackGateway {
  setVerdict(reviewId: string, screenKey: string, verdict: Verdict): Promise<Result<Review>>;
  submit(reviewId: string, body: string | null): Promise<Result<Review>>;
  /** Sin `screenKey`: todos los comentarios de la revisión. */
  comments(reviewId: string, screenKey?: string): Promise<Result<Comment[]>>;
  addComment(reviewId: string, screenKey: string, input: NewComment): Promise<Result<Comment>>;
  reply(commentId: string, body: string): Promise<Result<CommentReply>>;
  resolveComment(commentId: string, resolved: boolean): Promise<Result<Comment>>;
  /** Respuesta de diseño a «¿Quedó resuelto en esta ronda?». */
  setFollowUp(commentId: string, followUp: Exclude<FollowUp, null>): Promise<Result<Comment>>;
  deleteComment(commentId: string): Promise<Result<void>>;
}

/* ── Autenticación y cuenta propia ───────────────────────────────────── */

export interface AuthGateway {
  login(email: string, password: string): Promise<Result<LoginResult>>;
  logout(): Promise<Result<void>>;
  me(): Promise<Result<SessionUser>>;
  inviteInfo(token: string): Promise<Result<InviteInfo>>;
  acceptInvite(token: string, name: string, password: string): Promise<Result<LoginResult>>;
  requestRecovery(email: string): Promise<Result<void>>;
  recoveryInfo(token: string): Promise<Result<RecoveryInfo>>;
  resetPassword(token: string, password: string): Promise<Result<void>>;
  updateProfile(name: string): Promise<Result<SessionUser>>;
  changePassword(current: string, next: string): Promise<Result<void>>;
  /** Cierra la sesión en todos los dispositivos (revoca los refresh tokens). */
  logoutEverywhere(): Promise<Result<void>>;
}

/* ── Directorio: organización, usuarios, proyectos y miembros ────────── */

export interface NewInvitation {
  email: string;
  role: OrgRole;
  projects: Membership[];
}

export interface AuditFilters {
  type?: AuditType;
  actor?: string;
  page?: number;
  limit?: number;
}

export type ProjectPatch = Partial<
  Pick<
    Project,
    | 'name'
    | 'slaDays'
    | 'strategy'
    | 'moduleRules'
    | 'integrations'
    | 'maskSelectors'
    | 'designRules'
  >
>;

export interface DirectoryGateway {
  organization(): Promise<Result<Organization>>;
  listUsers(): Promise<Result<User[]>>;
  setUserStatus(userId: string, status: UserStatus): Promise<Result<User>>;
  setOrgRole(userId: string, role: OrgRole): Promise<Result<User>>;
  listInvitations(): Promise<Result<Invitation[]>>;
  invite(input: NewInvitation): Promise<Result<Invitation>>;
  revokeInvitation(id: string): Promise<Result<void>>;
  listProjects(): Promise<Result<Project[]>>;
  getProject(id: string): Promise<Result<Project>>;
  updateProject(id: string, patch: ProjectPatch): Promise<Result<Project>>;
  listMembers(projectId: string): Promise<Result<ProjectMember[]>>;
  addMember(projectId: string, userId: string, role: ProjectRole): Promise<Result<ProjectMember>>;
  setMemberRole(
    projectId: string,
    userId: string,
    role: ProjectRole,
  ): Promise<Result<ProjectMember>>;
  removeMember(projectId: string, userId: string): Promise<Result<void>>;
  audit(filters: AuditFilters): Promise<Result<PaginatedResponse<AuditEvent>>>;
}

/* ── Tokens personales de la skill ───────────────────────────────────── */

export interface TokensGateway {
  list(): Promise<Result<ApiToken[]>>;
  create(projectId: string, label: string): Promise<Result<CreatedToken>>;
  revoke(id: string): Promise<Result<void>>;
}

/* ── Notificaciones ──────────────────────────────────────────────────── */

export interface NotificationFilters {
  unread?: boolean;
  mentions?: boolean;
}

export interface NotificationsGateway {
  list(filters: NotificationFilters): Promise<Result<Notification[]>>;
  unreadCount(): Promise<Result<number>>;
  markRead(id: string): Promise<Result<void>>;
  markAllRead(): Promise<Result<void>>;
  prefs(): Promise<Result<NotificationPrefs>>;
  updatePrefs(prefs: NotificationPrefs): Promise<Result<NotificationPrefs>>;
}

/* ── Métricas ────────────────────────────────────────────────────────── */

export interface ReportsGateway {
  overview(filters: ReportFilters): Promise<Result<ReportsOverview>>;
}

export interface Gateways {
  reviews: ReviewsGateway;
  feedback: FeedbackGateway;
  auth: AuthGateway;
  directory: DirectoryGateway;
  tokens: TokensGateway;
  notifications: NotificationsGateway;
  reports: ReportsGateway;
}
