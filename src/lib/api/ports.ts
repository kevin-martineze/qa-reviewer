// Puertos (interfaces de gateway) que consumen las rutas.
// Las rutas dependen SOLO de estas interfaces, nunca de un adapter concreto.
import type { Result } from './result';
import type {
  Anchor,
  ApiToken,
  Comment,
  InviteInfo,
  Notification,
  PaginatedResponse,
  Project,
  ProjectMember,
  RecoveryInfo,
  Review,
  ReviewStatus,
  SessionUser,
  User,
  Verdict,
} from './types';

export interface ReviewFilters {
  status?: ReviewStatus;
  project?: string;
  author?: string;
  assignedToMe?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ReviewsGateway {
  list(filters: ReviewFilters): Promise<Result<PaginatedResponse<Review>>>;
  get(id: string): Promise<Result<Review>>;
}

export interface FeedbackGateway {
  setVerdict(reviewId: string, screenKey: string, verdict: Verdict): Promise<Result<Review>>;
  submit(reviewId: string): Promise<Result<Review>>;
  comments(reviewId: string, screenKey: string): Promise<Result<Comment[]>>;
  addComment(
    reviewId: string,
    screenKey: string,
    body: string,
    anchor?: Anchor,
  ): Promise<Result<Comment>>;
  resolveComment(commentId: string, resolved: boolean): Promise<Result<Comment>>;
}

export interface AuthGateway {
  login(email: string, password: string): Promise<Result<SessionUser>>;
  logout(): Promise<Result<void>>;
  me(): Promise<Result<SessionUser>>;
  inviteInfo(token: string): Promise<Result<InviteInfo>>;
  acceptInvite(token: string, name: string, password: string): Promise<Result<SessionUser>>;
  requestRecovery(email: string): Promise<Result<void>>;
  recoveryInfo(token: string): Promise<Result<RecoveryInfo>>;
  resetPassword(token: string, password: string): Promise<Result<void>>;
}

export interface DirectoryGateway {
  listProjects(): Promise<Result<Project[]>>;
  listMembers(projectId: string): Promise<Result<ProjectMember[]>>;
  listUsers(): Promise<Result<User[]>>;
  listTokens(projectId: string): Promise<Result<ApiToken[]>>;
}

export interface NotificationsGateway {
  list(): Promise<Result<Notification[]>>;
  markAllRead(): Promise<Result<void>>;
}

export interface ReportOverview {
  assigned: number;
  dueSoon: number;
  overdue: number;
  approvedThisWeek: number;
}

export interface ReportsGateway {
  overview(): Promise<Result<ReportOverview>>;
}

export interface Gateways {
  reviews: ReviewsGateway;
  feedback: FeedbackGateway;
  auth: AuthGateway;
  directory: DirectoryGateway;
  notifications: NotificationsGateway;
  reports: ReportsGateway;
}
