// Adapter mock: implementa los puertos con el store en memoria, la matriz de
// permisos y las reglas de negocio (403/409, el autor no da veredicto).
import { err, ok, type Result } from '$lib/api/result';
import type { Gateways, ReviewFilters } from '$lib/api/ports';
import type {
  Anchor,
  Comment,
  InviteStatus,
  RecoveryStatus,
  Review,
  SessionUser,
  User,
  Verdict,
} from '$lib/api/types';
import type { Permission } from '$lib/domain/permissions';
import { DEMO_PASSWORD, MEMBERSHIPS, ORG, PROJECTS, SEED_TOKENS } from './seeds';
import type { InviteSeed } from './seeds';
import { store } from './store';

function requireUser(locals: App.Locals): Result<SessionUser> {
  if (!locals.user) return err(401, 'auth.required', 'Inicia sesión.');
  return ok(locals.user);
}

function requireAuthz(locals: App.Locals, perm: Permission): Result<string> {
  const user = requireUser(locals);
  if (!user.ok) return user;
  if (!locals.permissions.has(perm)) {
    return err(403, 'auth.forbidden', 'No tienes permiso para esta acción.');
  }
  return ok(user.data.id);
}

function findReview(id: string): Result<Review> {
  const review = store.reviews.find((r) => r.id === id);
  if (!review) return err(404, 'reviews.not_found', 'Revisión no encontrada.');
  return ok(review);
}

function inviteStatus(invite: InviteSeed): InviteStatus {
  if (invite.revoked) return 'revoked';
  if (invite.used) return 'used';
  if (new Date(invite.expiresAt).getTime() < Date.now()) return 'expired';
  return 'valid';
}

function projectNames(ids: string[]): string[] {
  return ids.map((id) => PROJECTS.find((p) => p.id === id)?.name ?? id);
}

function userName(id: string): string {
  return store.users[id]?.name ?? id;
}

export function mockGateway(locals: App.Locals): Gateways {
  return {
    reviews: {
      async list(filters: ReviewFilters) {
        const authz = requireAuthz(locals, 'reviews:read');
        if (!authz.ok) return authz;

        let items = store.reviews;
        if (filters.status) items = items.filter((r) => r.status === filters.status);
        if (filters.project) items = items.filter((r) => r.project === filters.project);
        if (filters.author) items = items.filter((r) => r.author === filters.author);
        const assignedToMe = filters.assignedToMe;
        if (assignedToMe) {
          items = items.filter((r) => r.assignees.includes(assignedToMe));
        }
        if (filters.q) {
          const q = filters.q.toLowerCase();
          items = items.filter((r) =>
            `${r.id} ${r.title} ${r.card} ${r.pr}`.toLowerCase().includes(q),
          );
        }

        const limit = filters.limit ?? 20;
        const page = filters.page ?? 1;
        const total = items.length;
        const start = (page - 1) * limit;
        return ok({ items: items.slice(start, start + limit), pagination: { page, limit, total } });
      },
      async get(id: string) {
        const authz = requireAuthz(locals, 'reviews:read');
        if (!authz.ok) return authz;
        return findReview(id);
      },
    },

    feedback: {
      async setVerdict(reviewId: string, screenKey: string, verdict: Verdict) {
        const authz = requireAuthz(locals, 'verdicts:set');
        if (!authz.ok) return authz;
        const review = findReview(reviewId);
        if (!review.ok) return review;
        if (review.data.status === 'closed') {
          return err(409, 'reviews.stale_status', 'La revisión está cerrada.');
        }
        if (review.data.author === authz.data) {
          return err(
            403,
            'verdicts.author_forbidden',
            'El autor no puede dar veredicto a su propia revisión.',
          );
        }
        const screen = review.data.screens.find((s) => s.key === screenKey);
        if (!screen) return err(404, 'screens.not_found', 'Pantalla no encontrada.');
        screen.verdict = verdict;
        if (review.data.status === 'open') review.data.status = 'in_review';
        return ok(review.data);
      },

      async submit(reviewId: string) {
        const authz = requireAuthz(locals, 'verdicts:set');
        if (!authz.ok) return authz;
        const review = findReview(reviewId);
        if (!review.ok) return review;
        if (review.data.status === 'closed') {
          return err(409, 'reviews.stale_status', 'La revisión está cerrada.');
        }
        if (review.data.author === authz.data) {
          return err(
            403,
            'verdicts.author_forbidden',
            'El autor no puede enviar su propia revisión.',
          );
        }
        const pending = review.data.screens.filter((s) => s.verdict === 'pending');
        if (pending.length) {
          return err(409, 'reviews.pending_screens', 'Quedan pantallas sin veredicto.');
        }
        const approved = review.data.screens.filter((s) => s.verdict === 'approved').length;
        const changes = review.data.screens.filter((s) => s.verdict === 'changes_requested').length;
        const result = changes > 0 ? 'changes_requested' : 'approved';
        review.data.status = result;
        const verdicts: Record<string, Verdict> = {};
        for (const s of review.data.screens) verdicts[s.key] = s.verdict;
        const current = review.data.rounds.find((r) => r.n === review.data.round);
        if (current) {
          current.submission = { by: authz.data, when: 'Ahora', result, approved, changes };
        } else {
          review.data.rounds.push({
            n: review.data.round,
            by: review.data.author,
            when: 'Ahora',
            verdicts,
            submission: { by: authz.data, when: 'Ahora', result, approved, changes },
          });
        }
        return ok(review.data);
      },

      async comments(reviewId: string, screenKey: string) {
        const authz = requireAuthz(locals, 'reviews:read');
        if (!authz.ok) return authz;
        return ok(store.comments.filter((c) => c.review === reviewId && c.screen === screenKey));
      },

      async addComment(reviewId: string, screenKey: string, body: string, anchor?: Anchor) {
        const authz = requireAuthz(locals, 'comments:create');
        if (!authz.ok) return authz;
        const review = findReview(reviewId);
        if (!review.ok) return review;
        if (review.data.status === 'closed') {
          return err(409, 'reviews.stale_status', 'La revisión está cerrada.');
        }
        const screen = review.data.screens.find((s) => s.key === screenKey);
        if (!screen) return err(404, 'screens.not_found', 'Pantalla no encontrada.');
        const comment: Comment = {
          id: `c${Date.now()}`,
          review: reviewId,
          screen: screenKey,
          round: review.data.round,
          author: authz.data,
          when: 'Ahora',
          body,
          anchor: anchor ?? null,
          el: null,
          resolved: false,
          followUp: null,
          replies: [],
        };
        store.comments.push(comment);
        if (review.data.status === 'open') review.data.status = 'in_review';
        return ok(comment);
      },

      async resolveComment(commentId: string, resolved: boolean) {
        const user = requireUser(locals);
        if (!user.ok) return user;
        const comment = store.comments.find((c) => c.id === commentId);
        if (!comment) return err(404, 'comments.not_found', 'Comentario no encontrado.');
        const isAuthor = comment.author === user.data.id;
        const mayResolve = isAuthor || locals.permissions.has('comments:resolve');
        if (!mayResolve) {
          return err(403, 'comments.forbidden', 'No puedes resolver este comentario.');
        }
        comment.resolved = resolved;
        if (resolved) comment.followUp = 'resolved';
        return ok(comment);
      },
    },

    auth: {
      async login(email: string, password: string) {
        const user = Object.values(store.users).find((u) => u.email === email);
        if (!user || password !== DEMO_PASSWORD) {
          return err(401, 'auth.invalid', 'Correo o contraseña incorrectos.');
        }
        if (user.status !== 'active') {
          return err(403, 'auth.inactive', 'Usuario desactivado.');
        }
        return ok({
          id: user.id,
          name: user.name,
          email: user.email,
          orgRole: user.orgRole,
          status: user.status,
        });
      },
      async logout() {
        return ok(undefined);
      },
      async me() {
        return requireUser(locals);
      },
      async inviteInfo(token: string) {
        const invite = store.invites.find((i) => i.token === token);
        if (!invite) return err(404, 'invite.not_found', 'Invitación no encontrada.');
        return ok({
          status: inviteStatus(invite),
          org: ORG.name,
          inviter: userName(invite.inviter),
          role: invite.role,
          projects: projectNames(invite.projects),
        });
      },
      async acceptInvite(token: string, name: string, password: string) {
        void password;
        const invite = store.invites.find((i) => i.token === token);
        if (!invite) return err(404, 'invite.not_found', 'Invitación no encontrada.');
        const status = inviteStatus(invite);
        if (status === 'expired') return err(410, 'invite.expired', 'La invitación venció.');
        if (status === 'used') return err(410, 'invite.used', 'La invitación ya fue usada.');
        if (status === 'revoked') return err(410, 'invite.revoked', 'La invitación fue revocada.');
        const id = `u${Date.now()}`;
        const user: User = {
          id,
          name,
          email: invite.email,
          orgRole: invite.role,
          status: 'active',
        };
        store.users[id] = user;
        for (const projectId of invite.projects) {
          store.memberships.push({ userId: id, projectId, role: 'designer' });
        }
        invite.used = true;
        return ok({ id, name, email: user.email, orgRole: user.orgRole, status: user.status });
      },
      async requestRecovery(email: string) {
        void email;
        return ok(undefined);
      },
      async recoveryInfo(token: string) {
        const rec = store.recoveries.find((r) => r.token === token);
        if (!rec) return err(404, 'recovery.not_found', 'Enlace no válido.');
        let status: RecoveryStatus = 'valid';
        if (rec.used) status = 'used';
        else if (new Date(rec.expiresAt).getTime() < Date.now()) status = 'expired';
        return ok({ status });
      },
      async resetPassword(token: string, password: string) {
        void password;
        const rec = store.recoveries.find((r) => r.token === token);
        if (!rec) return err(404, 'recovery.not_found', 'Enlace no válido.');
        if (rec.used) return err(410, 'recovery.used', 'Este enlace ya fue usado.');
        if (new Date(rec.expiresAt).getTime() < Date.now()) {
          return err(410, 'recovery.expired', 'El enlace venció.');
        }
        rec.used = true;
        return ok(undefined);
      },
    },

    directory: {
      async listProjects() {
        return ok(PROJECTS);
      },
      async listMembers(projectId: string) {
        return ok(MEMBERSHIPS.filter((m) => m.projectId === projectId));
      },
      async listUsers() {
        return ok(Object.values(store.users));
      },
      async listTokens(projectId: string) {
        return ok(SEED_TOKENS.filter((t) => t.project === projectId));
      },
    },

    notifications: {
      async list() {
        const authz = requireUser(locals);
        if (!authz.ok) return authz;
        return ok(store.notifications);
      },
      async markAllRead() {
        const authz = requireUser(locals);
        if (!authz.ok) return authz;
        for (const n of store.notifications) n.unread = false;
        return ok(undefined);
      },
    },

    reports: {
      async overview() {
        const authz = requireAuthz(locals, 'reports:view');
        if (!authz.ok) return authz;
        const reviews = store.reviews;
        return ok({
          assigned: reviews.filter(
            (r) =>
              r.assignees.includes(authz.data) && (r.status === 'open' || r.status === 'in_review'),
          ).length,
          dueSoon: reviews.filter((r) => r.due.tone === 'soon').length,
          overdue: reviews.filter((r) => r.due.tone === 'late').length,
          approvedThisWeek: reviews.filter((r) => r.status === 'approved').length,
        });
      },
    },
  };
}
