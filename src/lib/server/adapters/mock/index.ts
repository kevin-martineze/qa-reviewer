// Adaptador mock: implementa los puertos con el store en memoria y aplica las mismas
// reglas que aplicará el API (permisos por proyecto, 403/404/409/410, el autor no da
// veredicto). Con REVIEWS_SOURCE=api este archivo no se usa.
import { err, ok, type Result } from '$lib/api/result';
import type {
  AuditFilters,
  Gateways,
  NewComment,
  NewInvitation,
  NotificationFilters,
  ProjectPatch,
  ReviewFilters,
} from '$lib/api/ports';
import type {
  AcceptInviteInput,
  ActivityType,
  AuditType,
  Comment,
  InviteStatus,
  LoginResult,
  NotificationType,
  Priority,
  ProfileInput,
  Project,
  ReportFilters,
  ReportsOverview,
  Review,
  SessionUser,
  User,
  Verdict,
} from '$lib/api/types';
import { dueState } from '$lib/domain/due';
import { PRIORITY } from '$lib/domain/labels';
import { permissionsFor, visibleProjectIds, type Permission } from '$lib/domain/permissions';
import { DEMO_PASSWORD, ORG, type InviteSeed } from './seeds';
import { store } from './store';

const TOKEN_PREFIX = 'mock.';

export function mockToken(userId: string): string {
  return `${TOKEN_PREFIX}${userId}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function sessionOf(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    orgRole: user.orgRole,
    status: user.status,
    avatar: user.avatar,
    memberships: store.memberships
      .filter((m) => m.userId === user.id)
      .map((m) => ({ projectId: m.projectId, role: m.role })),
  };
}

function userByToken(token: string | undefined): User | undefined {
  if (!token?.startsWith(TOKEN_PREFIX)) return undefined;
  const id = token.slice(TOKEN_PREFIX.length);
  return store.users.find((u) => u.id === id && u.status === 'active');
}

function inviteStatus(invite: InviteSeed): InviteStatus {
  if (invite.revoked) return 'revoked';
  if (invite.used) return 'used';
  if (new Date(invite.expiresAt).getTime() < Date.now()) return 'expired';
  return 'valid';
}

function nameOf(id: string): string {
  return store.users.find((u) => u.id === id)?.name ?? id;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? (sorted[mid] ?? 0) : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
}

export function mockGateway(locals: App.Locals): Gateways {
  /* ── Sesión y permisos ─────────────────────────────────────────────── */

  function session(): Result<SessionUser> {
    const user = userByToken(locals.sessionToken);
    if (!user) return err(401, 'auth.required', 'Inicia sesión.');
    return ok(sessionOf(user));
  }

  function authorize(perm: Permission, projectId: string | null): Result<SessionUser> {
    const me = session();
    if (!me.ok) return me;
    if (!permissionsFor(me.data, projectId).has(perm)) {
      return err(403, 'auth.forbidden', 'No tienes permiso para esta acción.', {
        permission: perm,
      });
    }
    return me;
  }

  function visibleIds(me: SessionUser): Set<string> {
    return new Set(
      visibleProjectIds(
        me,
        store.projects.map((p) => p.id),
      ),
    );
  }

  function findReview(id: string): Result<Review> {
    const review = store.reviews.find((r) => r.id === id);
    if (!review) return err(404, 'reviews.not_found', 'Esta revisión no existe o fue eliminada.');
    return ok(review);
  }

  function reviewFor(id: string, perm: Permission): Result<{ me: SessionUser; review: Review }> {
    const review = findReview(id);
    if (!review.ok) return review;
    const me = authorize(perm, review.data.project);
    if (!me.ok) {
      // Sin acceso de lectura al proyecto, la revisión «no existe» (no se filtra su existencia).
      if (me.error.status === 403 && perm === 'reviews:read') {
        return err(404, 'reviews.not_found', 'Esta revisión no existe o fue eliminada.');
      }
      return me;
    }
    return ok({ me: me.data, review: review.data });
  }

  function openForFeedback(review: Review): Result<Review> {
    if (review.status === 'closed') {
      return err(409, 'reviews.stale_status', 'La revisión está cerrada.');
    }
    return ok(review);
  }

  function logActivity(type: ActivityType, actor: string, review: string, text: string): void {
    store.activity.unshift({
      id: store.nextId('a'),
      type,
      actor,
      review,
      text,
      createdAt: nowIso(),
    });
  }

  function notify(
    userId: string,
    type: NotificationType,
    actor: string | null,
    text: string,
    target: { review?: string; screen?: string; comment?: string } = {},
  ): void {
    if (actor === userId) return;
    store.notifications.unshift({
      id: store.nextId('n'),
      user: userId,
      type,
      actor,
      review: target.review ?? null,
      screen: target.screen ?? null,
      comment: target.comment ?? null,
      text,
      createdAt: nowIso(),
      readAt: null,
    });
  }

  function logAudit(type: AuditType, actor: string, target: string, text: string): void {
    store.audit.unshift({ id: store.nextId('au'), type, actor, target, text, createdAt: nowIso() });
  }

  function touch(review: Review): void {
    review.updatedAt = nowIso();
  }

  function findComment(id: string): Result<Comment> {
    const comment = store.comments.find((c) => c.id === id);
    if (!comment) return err(404, 'comments.not_found', 'Comentario no encontrado.');
    return ok(comment);
  }

  function findProject(id: string): Result<Project> {
    const project = store.projects.find((p) => p.id === id);
    if (!project) return err(404, 'projects.not_found', 'Proyecto no encontrado.');
    return ok(project);
  }

  return {
    /* ── Revisiones ──────────────────────────────────────────────────── */
    reviews: {
      async list(filters: ReviewFilters) {
        const me = session();
        if (!me.ok) return me;
        const visible = visibleIds(me.data);
        const now = new Date();
        const q = filters.q?.trim().toLowerCase();

        let items = store.reviews.filter((r) => visible.has(r.project));
        if (filters.status?.length) {
          const statuses = new Set(filters.status);
          items = items.filter((r) => statuses.has(r.status));
        }
        if (filters.project) items = items.filter((r) => r.project === filters.project);
        if (filters.author) items = items.filter((r) => r.author === filters.author);
        const assignee = filters.assignee;
        if (assignee) items = items.filter((r) => r.assignees.includes(assignee));
        if (filters.priority) items = items.filter((r) => r.priority === filters.priority);
        if (filters.overdue) items = items.filter((r) => dueState(r, now).overdue);
        if (q) {
          items = items.filter((r) =>
            `${r.id} ${r.title} ${r.card} ${r.pr.number} ${r.module}`.toLowerCase().includes(q),
          );
        }

        const sort = filters.sort ?? 'updated';
        items = [...items].sort((a, b) => {
          if (sort === 'priority') return PRIORITY[a.priority].rank - PRIORITY[b.priority].rank;
          if (sort === 'due') {
            const da = a.dueAt ? Date.parse(a.dueAt) : Number.POSITIVE_INFINITY;
            const db = b.dueAt ? Date.parse(b.dueAt) : Number.POSITIVE_INFINITY;
            return da - db;
          }
          return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
        });

        const limit = filters.limit ?? 20;
        const page = Math.max(1, filters.page ?? 1);
        const start = (page - 1) * limit;
        return ok({
          items: items.slice(start, start + limit),
          pagination: { page, limit, total: items.length },
        });
      },

      async get(id: string) {
        const found = reviewFor(id, 'reviews:read');
        if (!found.ok) return found;
        return ok(found.data.review);
      },

      async activity(id: string) {
        const found = reviewFor(id, 'reviews:read');
        if (!found.ok) return found;
        return ok(store.activity.filter((a) => a.review === id));
      },

      async assign(id: string, assignees: string[]) {
        const found = reviewFor(id, 'reviews:assign');
        if (!found.ok) return found;
        const { me, review } = found.data;
        const allowed = new Set(
          store.memberships
            .filter(
              (m) =>
                m.projectId === review.project &&
                (m.role === 'designer' || m.role === 'design_lead'),
            )
            .map((m) => m.userId),
        );
        if (!assignees.length || assignees.some((a) => !allowed.has(a))) {
          return err(400, 'reviews.invalid_assignees', 'Elige diseñadores del proyecto.');
        }
        const before = new Set(review.assignees);
        for (const a of review.assignees) {
          if (!assignees.includes(a)) {
            notify(a, 'review_assigned', me.id, `${me.name} te quitó de ${review.id}`, {
              review: review.id,
            });
          }
        }
        for (const a of assignees) {
          if (!before.has(a)) {
            notify(
              a,
              'review_assigned',
              me.id,
              `${me.name} te asignó ${review.id} · ${review.title}`,
              {
                review: review.id,
              },
            );
          }
        }
        review.assignees = assignees;
        touch(review);
        logActivity(
          'review_assigned',
          me.id,
          review.id,
          `asignó la revisión a ${assignees.map(nameOf).join(', ')}`,
        );
        return ok(review);
      },

      async setPriority(id: string, priority: Priority) {
        const found = reviewFor(id, 'reviews:assign');
        if (!found.ok) return found;
        found.data.review.priority = priority;
        touch(found.data.review);
        return ok(found.data.review);
      },

      async reopen(id: string, reason: string) {
        const found = reviewFor(id, 'reviews:reopen');
        if (!found.ok) return found;
        const { me, review } = found.data;
        if (review.status !== 'approved' && review.status !== 'changes_requested') {
          return err(409, 'reviews.stale_status', 'Solo se reabre una revisión ya enviada.');
        }
        const round = review.rounds.find((r) => r.n === review.round);
        if (round) round.submission = null;
        review.status = 'in_review';
        review.pr.check = 'pending';
        touch(review);
        logActivity('review_reopened', me.id, review.id, `anuló el envío: «${reason}»`);
        notify(review.author, 'review_submitted', me.id, `${me.name} reabrió ${review.id}`, {
          review: review.id,
        });
        return ok(review);
      },
    },

    /* ── Feedback ────────────────────────────────────────────────────── */
    feedback: {
      async setVerdict(reviewId: string, screenKey: string, verdict: Verdict) {
        const found = reviewFor(reviewId, 'verdicts:set');
        if (!found.ok) return found;
        const { me, review } = found.data;
        const open = openForFeedback(review);
        if (!open.ok) return open;
        if (review.author === me.id) {
          return err(
            403,
            'verdicts.author_forbidden',
            'El autor no puede dar veredicto a su propia revisión.',
          );
        }
        if (review.status === 'approved' || review.status === 'changes_requested') {
          return err(409, 'reviews.already_submitted', 'Esta ronda ya se envió.');
        }
        const screen = review.screens.find((s) => s.key === screenKey);
        if (!screen) return err(404, 'screens.not_found', 'Pantalla no encontrada.');
        screen.verdict = verdict;
        // Un veredicto dado en esta ronda reemplaza al heredado.
        screen.inherited = false;
        if (review.status === 'open') review.status = 'in_review';
        touch(review);
        return ok(review);
      },

      async submit(reviewId: string, body: string | null) {
        const found = reviewFor(reviewId, 'verdicts:set');
        if (!found.ok) return found;
        const { me, review } = found.data;
        const open = openForFeedback(review);
        if (!open.ok) return open;
        if (review.author === me.id) {
          return err(
            403,
            'verdicts.author_forbidden',
            'El autor no puede enviar su propia revisión.',
          );
        }
        if (review.status === 'approved' || review.status === 'changes_requested') {
          return err(409, 'reviews.already_submitted', 'Esta ronda ya se envió.');
        }
        if (review.screens.some((s) => s.verdict === 'pending')) {
          return err(409, 'reviews.pending_screens', 'Quedan pantallas sin veredicto.');
        }
        const approved = review.screens.filter((s) => s.verdict === 'approved').length;
        const changes = review.screens.length - approved;
        const result = changes > 0 ? 'changes_requested' : 'approved';
        const createdAt = nowIso();
        const verdicts: Record<string, Verdict> = {};
        for (const s of review.screens) verdicts[s.key] = s.verdict;
        const round = review.rounds.find((r) => r.n === review.round);
        const submission = { by: me.id, createdAt, result, approved, changes, body } as const;
        if (round) {
          round.verdicts = verdicts;
          round.submission = submission;
        }
        review.status = result;
        review.pr.check = result === 'approved' ? 'success' : 'failure';
        touch(review);
        const summary =
          result === 'approved'
            ? `aprobó la ronda ${review.round} (${approved} pantallas)`
            : `envió la ronda ${review.round}: ${approved} aprobadas, ${changes} con ajuste`;
        logActivity('review_submitted', me.id, review.id, summary);
        notify(review.author, 'review_submitted', me.id, `${me.name} ${summary} de ${review.id}`, {
          review: review.id,
        });
        return ok(review);
      },

      async comments(reviewId: string, screenKey?: string) {
        const found = reviewFor(reviewId, 'reviews:read');
        if (!found.ok) return found;
        return ok(
          store.comments.filter(
            (c) => c.review === reviewId && (screenKey === undefined || c.screen === screenKey),
          ),
        );
      },

      async addComment(reviewId: string, screenKey: string, input: NewComment) {
        const found = reviewFor(reviewId, 'comments:create');
        if (!found.ok) return found;
        const { me, review } = found.data;
        const open = openForFeedback(review);
        if (!open.ok) return open;
        const screen = review.screens.find((s) => s.key === screenKey);
        if (!screen) return err(404, 'screens.not_found', 'Pantalla no encontrada.');
        const comment: Comment = {
          id: store.nextId('c'),
          review: reviewId,
          screen: screenKey,
          round: review.round,
          author: me.id,
          createdAt: nowIso(),
          body: input.body,
          anchor: input.anchor,
          el: input.el,
          resolved: false,
          followUp: null,
          replies: [],
        };
        store.comments.push(comment);
        touch(review);
        logActivity('comment_created', me.id, review.id, `comentó en «${screen.title}»`);
        if (me.id !== review.author) {
          notify(review.author, 'reply', me.id, `${me.name} comentó en «${screen.title}»`, {
            review: review.id,
            screen: screenKey,
            comment: comment.id,
          });
        }
        return ok(comment);
      },

      async reply(commentId: string, body: string) {
        const comment = findComment(commentId);
        if (!comment.ok) return comment;
        const found = reviewFor(comment.data.review, 'comments:create');
        if (!found.ok) return found;
        const { me, review } = found.data;
        const reply = { id: store.nextId('r'), author: me.id, createdAt: nowIso(), body };
        comment.data.replies.push(reply);
        touch(review);
        logActivity('comment_replied', me.id, review.id, 'respondió un comentario');
        notify(comment.data.author, 'reply', me.id, `${me.name} respondió tu comentario`, {
          review: review.id,
          screen: comment.data.screen,
          comment: commentId,
        });
        return ok(reply);
      },

      async resolveComment(commentId: string, resolved: boolean) {
        const comment = findComment(commentId);
        if (!comment.ok) return comment;
        const me = session();
        if (!me.ok) return me;
        const review = findReview(comment.data.review);
        if (!review.ok) return review;
        const perms = permissionsFor(me.data, review.data.project);
        if (comment.data.author !== me.data.id && !perms.has('comments:resolve')) {
          return err(403, 'comments.forbidden', 'No puedes resolver este comentario.');
        }
        comment.data.resolved = resolved;
        if (resolved) {
          logActivity('comment_resolved', me.data.id, review.data.id, 'resolvió un comentario');
        }
        return ok(comment.data);
      },

      async setFollowUp(commentId: string, followUp) {
        const comment = findComment(commentId);
        if (!comment.ok) return comment;
        const found = reviewFor(comment.data.review, 'verdicts:set');
        if (!found.ok) return found;
        const { me, review } = found.data;
        if (comment.data.round >= review.round) {
          return err(409, 'comments.not_previous_round', 'El comentario es de esta ronda.');
        }
        comment.data.followUp = followUp;
        comment.data.resolved = followUp === 'resolved';
        logActivity(
          followUp === 'resolved' ? 'comment_resolved' : 'comment_replied',
          me.id,
          review.id,
          followUp === 'resolved'
            ? `confirmó que un comentario de la ronda ${comment.data.round} quedó resuelto`
            : `indicó que un comentario de la ronda ${comment.data.round} sigue igual`,
        );
        return ok(comment.data);
      },

      async deleteComment(commentId: string) {
        const comment = findComment(commentId);
        if (!comment.ok) return comment;
        const me = session();
        if (!me.ok) return me;
        const review = findReview(comment.data.review);
        if (!review.ok) return review;
        const perms = permissionsFor(me.data, review.data.project);
        if (comment.data.author !== me.data.id && !perms.has('comments:moderate')) {
          return err(403, 'comments.forbidden', 'No puedes borrar este comentario.');
        }
        store.comments = store.comments.filter((c) => c.id !== commentId);
        return ok(undefined);
      },
    },

    /* ── Autenticación ───────────────────────────────────────────────── */
    auth: {
      async login(email: string, password: string) {
        const user = store.users.find((u) => u.email === email.trim().toLowerCase());
        if (!user || password !== DEMO_PASSWORD) {
          return err(401, 'auth.invalid', 'Correo o contraseña incorrectos.');
        }
        if (user.status !== 'active') {
          return err(401, 'auth.invalid', 'Correo o contraseña incorrectos.');
        }
        user.lastSeenAt = nowIso();
        return ok<LoginResult>({ token: mockToken(user.id), user: sessionOf(user) });
      },

      async logout() {
        return ok(undefined);
      },

      async me() {
        return session();
      },

      async inviteInfo(token: string) {
        const invite = store.invites.find((i) => i.token === token);
        if (!invite) return err(404, 'invite.not_found', 'Esta invitación no existe.');
        return ok({
          status: inviteStatus(invite),
          email: invite.email,
          org: ORG.name,
          inviter: nameOf(invite.inviter),
          role: invite.role,
          projects: invite.projects.map(
            (p) => store.projects.find((x) => x.id === p.projectId)?.name ?? p.projectId,
          ),
        });
      },

      async acceptInvite(token: string, input: AcceptInviteInput) {
        const invite = store.invites.find((i) => i.token === token);
        if (!invite) return err(404, 'invite.not_found', 'Esta invitación no existe.');
        const status = inviteStatus(invite);
        if (status !== 'valid') {
          return err(410, `invite.${status}`, 'Esta invitación ya no está disponible.');
        }
        const created: User = {
          id: store.nextId('u'),
          name: input.name.trim(),
          email: invite.email,
          orgRole: invite.role,
          status: 'active',
          avatar: input.avatar,
          lastSeenAt: nowIso(),
          createdAt: nowIso(),
        };
        store.users.push(created);
        for (const p of invite.projects) {
          store.memberships.push({ userId: created.id, projectId: p.projectId, role: p.role });
        }
        invite.used = true;
        return ok<LoginResult>({ token: mockToken(created.id), user: sessionOf(created) });
      },

      async requestRecovery(email: string) {
        // Mismo resultado exista o no la cuenta: no se revela quién está registrado.
        void email;
        return ok(undefined);
      },

      async recoveryInfo(token: string) {
        const rec = store.recoveries.find((r) => r.token === token);
        if (!rec) return err(404, 'recovery.not_found', 'Este enlace no es válido.');
        if (rec.used) return ok({ status: 'used' as const });
        if (new Date(rec.expiresAt).getTime() < Date.now())
          return ok({ status: 'expired' as const });
        return ok({ status: 'valid' as const });
      },

      async resetPassword(token: string, password: string) {
        void password;
        const rec = store.recoveries.find((r) => r.token === token);
        if (!rec) return err(404, 'recovery.not_found', 'Este enlace no es válido.');
        if (rec.used || new Date(rec.expiresAt).getTime() < Date.now()) {
          return err(410, 'recovery.gone', 'Este enlace ya no está disponible.');
        }
        rec.used = true;
        return ok(undefined);
      },

      async updateProfile(input: ProfileInput) {
        const me = session();
        if (!me.ok) return me;
        const user = store.users.find((u) => u.id === me.data.id);
        if (!user) return err(404, 'users.not_found', 'Usuario no encontrado.');
        user.name = input.name.trim();
        user.avatar = input.avatar;
        return ok(sessionOf(user));
      },

      async changePassword(current: string, next: string) {
        void next;
        const me = session();
        if (!me.ok) return me;
        if (current !== DEMO_PASSWORD) {
          return err(400, 'auth.wrong_password', 'La contraseña actual no coincide.');
        }
        return ok(undefined);
      },

      async logoutEverywhere() {
        const me = session();
        if (!me.ok) return me;
        return ok(undefined);
      },
    },

    /* ── Directorio ──────────────────────────────────────────────────── */
    directory: {
      async organization() {
        const me = session();
        if (!me.ok) return me;
        return ok(ORG);
      },

      async listUsers() {
        const me = session();
        if (!me.ok) return me;
        return ok(store.users);
      },

      async setUserStatus(userId: string, status) {
        const me = authorize('users:invite', null);
        if (!me.ok) return me;
        const user = store.users.find((u) => u.id === userId);
        if (!user) return err(404, 'users.not_found', 'Usuario no encontrado.');
        if (user.id === me.data.id) {
          return err(409, 'users.self', 'No puedes desactivar tu propia cuenta.');
        }
        if (user.orgRole === 'owner') {
          return err(409, 'users.owner', 'El owner no se puede desactivar.');
        }
        user.status = status;
        if (status === 'inactive') store.tokens = store.tokens.filter((t) => t.owner !== userId);
        logAudit(
          status === 'inactive' ? 'user_deactivated' : 'user_reactivated',
          me.data.id,
          userId,
          `${status === 'inactive' ? 'desactivó' : 'reactivó'} a ${user.name}`,
        );
        return ok(user);
      },

      async setOrgRole(userId: string, role) {
        const me = authorize(role === 'owner' ? 'org:manage' : 'users:invite', null);
        if (!me.ok) return me;
        const user = store.users.find((u) => u.id === userId);
        if (!user) return err(404, 'users.not_found', 'Usuario no encontrado.');
        if (user.orgRole === 'owner' && me.data.orgRole !== 'owner') {
          return err(403, 'auth.forbidden', 'Solo el owner cambia el rol de otro owner.');
        }
        user.orgRole = role;
        logAudit('role_changed', me.data.id, userId, `cambió el rol de ${user.name} a ${role}`);
        return ok(user);
      },

      async listInvitations() {
        const me = authorize('users:invite', null);
        if (!me.ok) return me;
        return ok(
          store.invites.map((i) => ({
            id: i.id,
            email: i.email,
            role: i.role,
            projects: i.projects,
            invitedBy: i.inviter,
            createdAt: i.createdAt,
            expiresAt: i.expiresAt,
            status: inviteStatus(i),
          })),
        );
      },

      async invite(input: NewInvitation) {
        const me = authorize('users:invite', null);
        if (!me.ok) return me;
        const email = input.email.trim().toLowerCase();
        if (store.users.some((u) => u.email === email)) {
          return err(409, 'users.exists', 'Ya hay un usuario con ese correo.');
        }
        if (store.invites.some((i) => i.email === email && inviteStatus(i) === 'valid')) {
          return err(409, 'invite.pending', 'Ya hay una invitación vigente para ese correo.');
        }
        const createdAt = nowIso();
        const seed: InviteSeed = {
          id: store.nextId('i'),
          token: `invite-${store.nextId('t')}`,
          email,
          inviter: me.data.id,
          role: input.role,
          projects: input.projects,
          createdAt,
          expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
          used: false,
          revoked: false,
        };
        store.invites.unshift(seed);
        logAudit('user_invited', me.data.id, email, `invitó a ${email}`);
        return ok({
          id: seed.id,
          email,
          role: seed.role,
          projects: seed.projects,
          invitedBy: me.data.id,
          createdAt,
          expiresAt: seed.expiresAt,
          status: 'valid' as const,
        });
      },

      async revokeInvitation(id: string) {
        const me = authorize('users:invite', null);
        if (!me.ok) return me;
        const invite = store.invites.find((i) => i.id === id);
        if (!invite) return err(404, 'invite.not_found', 'Invitación no encontrada.');
        invite.revoked = true;
        return ok(undefined);
      },

      async listProjects() {
        const me = session();
        if (!me.ok) return me;
        const visible = visibleIds(me.data);
        return ok(
          store.projects
            .filter((p) => visible.has(p.id))
            .map((p) => ({
              ...p,
              reviewsCount: store.reviews.filter((r) => r.project === p.id).length,
            })),
        );
      },

      async getProject(id: string) {
        const me = authorize('reviews:read', id);
        if (!me.ok) return err(404, 'projects.not_found', 'Proyecto no encontrado.');
        return findProject(id);
      },

      async updateProject(id: string, patch: ProjectPatch) {
        const me = authorize('projects:configure', id);
        if (!me.ok) return me;
        const project = findProject(id);
        if (!project.ok) return project;
        Object.assign(project.data, patch);
        logAudit(
          'project_updated',
          me.data.id,
          id,
          `actualizó la configuración de ${project.data.name}`,
        );
        return ok(project.data);
      },

      async listMembers(projectId: string) {
        const me = authorize('reviews:read', projectId);
        if (!me.ok) return me;
        return ok(store.memberships.filter((m) => m.projectId === projectId));
      },

      async addMember(projectId: string, userId: string, role) {
        const me = authorize('members:manage', projectId);
        if (!me.ok) return me;
        if (store.memberships.some((m) => m.projectId === projectId && m.userId === userId)) {
          return err(409, 'members.exists', 'Ya es miembro del proyecto.');
        }
        const member = { projectId, userId, role };
        store.memberships.push(member);
        logAudit('member_added', me.data.id, userId, `agregó a ${nameOf(userId)} al proyecto`);
        return ok(member);
      },

      async setMemberRole(projectId: string, userId: string, role) {
        const me = authorize('members:manage', projectId);
        if (!me.ok) return me;
        const member = store.memberships.find(
          (m) => m.projectId === projectId && m.userId === userId,
        );
        if (!member) return err(404, 'members.not_found', 'No es miembro del proyecto.');
        member.role = role;
        logAudit(
          'role_changed',
          me.data.id,
          userId,
          `cambió el rol de ${nameOf(userId)} a ${role}`,
        );
        return ok(member);
      },

      async removeMember(projectId: string, userId: string) {
        const me = authorize('members:manage', projectId);
        if (!me.ok) return me;
        if (userId === me.data.id) {
          return err(409, 'members.self', 'No puedes quitarte a ti mismo.');
        }
        store.memberships = store.memberships.filter(
          (m) => !(m.projectId === projectId && m.userId === userId),
        );
        logAudit('member_removed', me.data.id, userId, `quitó a ${nameOf(userId)} del proyecto`);
        return ok(undefined);
      },

      async audit(filters: AuditFilters) {
        const me = authorize('users:invite', null);
        if (!me.ok) return me;
        let items = store.audit;
        if (filters.type) items = items.filter((e) => e.type === filters.type);
        if (filters.actor) items = items.filter((e) => e.actor === filters.actor);
        const limit = filters.limit ?? 20;
        const page = Math.max(1, filters.page ?? 1);
        return ok({
          items: items.slice((page - 1) * limit, page * limit),
          pagination: { page, limit, total: items.length },
        });
      },
    },

    /* ── Tokens ──────────────────────────────────────────────────────── */
    tokens: {
      async list() {
        const me = session();
        if (!me.ok) return me;
        return ok(
          store.tokens
            .filter((t) => t.owner === me.data.id)
            .map(({ owner, ...token }) => {
              void owner;
              return token;
            }),
        );
      },

      async create(projectId: string, label: string) {
        const me = authorize('tokens:own', projectId);
        if (!me.ok) return me;
        const random = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
          b.toString(16).padStart(2, '0'),
        ).join('');
        const secret = `qa_pat_${random}`;
        const token = {
          id: store.nextId('t'),
          label: label.trim(),
          prefix: secret.slice(0, 11),
          project: projectId,
          createdAt: nowIso(),
          lastUsedAt: null,
        };
        store.tokens.unshift({ ...token, owner: me.data.id });
        logAudit('token_created', me.data.id, token.prefix, `creó el token «${token.label}»`);
        return ok({ token, secret });
      },

      async revoke(id: string) {
        const me = session();
        if (!me.ok) return me;
        const token = store.tokens.find((t) => t.id === id && t.owner === me.data.id);
        if (!token) return err(404, 'tokens.not_found', 'Token no encontrado.');
        store.tokens = store.tokens.filter((t) => t.id !== id);
        logAudit('token_revoked', me.data.id, token.prefix, `revocó el token «${token.label}»`);
        return ok(undefined);
      },
    },

    /* ── Notificaciones ──────────────────────────────────────────────── */
    notifications: {
      async list(filters: NotificationFilters) {
        const me = session();
        if (!me.ok) return me;
        let items = store.notifications.filter((n) => n.user === me.data.id);
        if (filters.unread) items = items.filter((n) => n.readAt === null);
        if (filters.mentions) items = items.filter((n) => n.type === 'mention');
        return ok(
          [...items]
            .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
            .map(({ user, ...n }) => {
              void user;
              return n;
            }),
        );
      },

      async unreadCount() {
        const me = session();
        if (!me.ok) return me;
        return ok(
          store.notifications.filter((n) => n.user === me.data.id && n.readAt === null).length,
        );
      },

      async markRead(id: string) {
        const me = session();
        if (!me.ok) return me;
        const n = store.notifications.find((x) => x.id === id && x.user === me.data.id);
        if (!n) return err(404, 'notifications.not_found', 'Notificación no encontrada.');
        n.readAt ??= nowIso();
        return ok(undefined);
      },

      async markAllRead() {
        const me = session();
        if (!me.ok) return me;
        const now = nowIso();
        for (const n of store.notifications) {
          if (n.user === me.data.id && n.readAt === null) n.readAt = now;
        }
        return ok(undefined);
      },

      async prefs() {
        const me = session();
        if (!me.ok) return me;
        return ok(store.prefsOf(me.data.id));
      },

      async updatePrefs(prefs) {
        const me = session();
        if (!me.ok) return me;
        store.prefs.set(me.data.id, { ...prefs });
        return ok(store.prefsOf(me.data.id));
      },
    },

    /* ── Métricas ────────────────────────────────────────────────────── */
    reports: {
      async overview(filters: ReportFilters) {
        const me = authorize('reports:view', filters.project ?? null);
        if (!me.ok) return me;
        const now = new Date();
        const visible = visibleIds(me.data);
        const from = filters.from ? Date.parse(filters.from) : 0;
        const to = filters.to ? Date.parse(filters.to) : Number.POSITIVE_INFINITY;
        const reviews = store.reviews.filter(
          (r) =>
            visible.has(r.project) &&
            (!filters.project || r.project === filters.project) &&
            Date.parse(r.createdAt) >= from &&
            Date.parse(r.createdAt) <= to,
        );
        const HOUR = 3_600_000;
        const firstSubmissions = reviews.flatMap((r) => {
          const first = r.rounds.find((x) => x.submission)?.submission;
          return first ? [(Date.parse(first.createdAt) - Date.parse(r.createdAt)) / HOUR] : [];
        });
        const approvals = reviews.flatMap((r) => {
          const approved = r.rounds.find((x) => x.submission?.result === 'approved')?.submission;
          return approved
            ? [(Date.parse(approved.createdAt) - Date.parse(r.createdAt)) / HOUR]
            : [];
        });
        const submitted = reviews.filter((r) => r.rounds[0]?.submission);
        const firstRoundApproved = submitted.filter(
          (r) => r.rounds[0]?.submission?.result === 'approved',
        ).length;

        const designers = new Map<string, { pending: number; overdue: number }>();
        for (const r of reviews) {
          if (r.status !== 'open' && r.status !== 'in_review') continue;
          for (const a of r.assignees) {
            const row = designers.get(a) ?? { pending: 0, overdue: 0 };
            row.pending += 1;
            if (dueState(r, now).overdue) row.overdue += 1;
            designers.set(a, row);
          }
        }

        const modules = new Map<string, { changes: number; screens: number }>();
        for (const r of reviews) {
          const row = modules.get(r.module) ?? { changes: 0, screens: 0 };
          for (const round of r.rounds) {
            row.changes += Object.values(round.verdicts).filter(
              (v) => v === 'changes_requested',
            ).length;
          }
          row.screens += r.screens.length;
          modules.set(r.module, row);
        }

        const weekly = Array.from({ length: 6 }, (_, i) => {
          const end = now.getTime() - (5 - i) * 7 * 86_400_000;
          const start = end - 7 * 86_400_000;
          const inWeek = (iso: string) => Date.parse(iso) > start && Date.parse(iso) <= end;
          return {
            week: new Date(end).toISOString().slice(0, 10),
            opened: reviews.filter((r) => inWeek(r.createdAt)).length,
            approved: reviews.filter((r) =>
              r.rounds.some(
                (x) => x.submission?.result === 'approved' && inWeek(x.submission.createdAt),
              ),
            ).length,
          };
        });

        const overview: ReportsOverview = {
          open: reviews.filter((r) => r.status === 'open' || r.status === 'in_review').length,
          overdue: reviews.filter((r) => dueState(r, now).overdue).length,
          hoursToFirstReview: Math.round(median(firstSubmissions)),
          hoursToApproval: Math.round(median(approvals)),
          firstRoundApprovalRate: submitted.length ? firstRoundApproved / submitted.length : 0,
          avgRounds: reviews.length
            ? Math.round((reviews.reduce((n, r) => n + r.round, 0) / reviews.length) * 10) / 10
            : 0,
          pendingByDesigner: [...designers].map(([userId, row]) => ({ userId, ...row })),
          changesByModule: [...modules]
            .map(([module, row]) => ({ module, ...row }))
            .sort((a, b) => b.changes - a.changes),
          weekly,
        };
        return ok(overview);
      },
    },
  };
}
