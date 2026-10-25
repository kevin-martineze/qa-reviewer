// Adaptador http: implementa los puertos contra el API real (docs/architecture/api.md).
// Cada método es una llamada; la forma de las respuestas es el contrato de $lib/api/types.
// Cuando el API publique su OpenAPI, los tipos se generan y este archivo no cambia de forma.
import type { Gateways } from '$lib/api/ports';
import { apiClient, toSearch } from './client';

const enc = encodeURIComponent;

export function httpGateway(locals: App.Locals, fetchFn?: typeof fetch): Gateways {
  const api = apiClient(locals, fetchFn);

  return {
    reviews: {
      list: (f) =>
        api.request(
          'GET',
          `/reviews${toSearch({
            status: f.status,
            project: f.project,
            author: f.author,
            assignee: f.assignee,
            priority: f.priority,
            overdue: f.overdue,
            q: f.q,
            sort: f.sort,
            page: f.page,
            limit: f.limit,
          })}`,
        ),
      get: (id) => api.request('GET', `/reviews/${enc(id)}`),
      activity: (id) => api.request('GET', `/reviews/${enc(id)}/activity`),
      assign: (id, assignees) => api.request('PUT', `/reviews/${enc(id)}/assignees`, { assignees }),
      setPriority: (id, priority) => api.request('PATCH', `/reviews/${enc(id)}`, { priority }),
      reopen: (id, reason) => api.request('POST', `/reviews/${enc(id)}/reopen`, { reason }),
    },

    feedback: {
      setVerdict: (id, key, verdict) =>
        api.request('PUT', `/reviews/${enc(id)}/screens/${enc(key)}/verdict`, { verdict }),
      submit: (id, body) => api.request('POST', `/reviews/${enc(id)}/submit`, { body }),
      comments: (id, key) =>
        api.request(
          'GET',
          key === undefined
            ? `/reviews/${enc(id)}/comments`
            : `/reviews/${enc(id)}/screens/${enc(key)}/comments`,
        ),
      addComment: (id, key, input) =>
        api.request('POST', `/reviews/${enc(id)}/screens/${enc(key)}/comments`, input),
      reply: (commentId, body) =>
        api.request('POST', `/comments/${enc(commentId)}/replies`, { body }),
      resolveComment: (commentId, resolved) =>
        api.request('PATCH', `/comments/${enc(commentId)}`, { resolved }),
      setFollowUp: (commentId, followUp) =>
        api.request('PUT', `/comments/${enc(commentId)}/follow-up`, { followUp }),
      deleteComment: (commentId) => api.send('DELETE', `/comments/${enc(commentId)}`),
    },

    auth: {
      login: (email, password) => api.request('POST', '/auth/login', { email, password }),
      logout: () => api.send('POST', '/auth/logout'),
      me: () => api.request('GET', '/me'),
      inviteInfo: (token) => api.request('GET', `/invitations/${enc(token)}`),
      acceptInvite: (token, input) =>
        api.request('POST', `/invitations/${enc(token)}/accept`, input),
      requestRecovery: (email) => api.send('POST', '/auth/recovery', { email }),
      recoveryInfo: (token) => api.request('GET', `/auth/recovery/${enc(token)}`),
      resetPassword: (token, password) =>
        api.send('POST', `/auth/recovery/${enc(token)}`, { password }),
      updateProfile: (input) => api.request('PATCH', '/me', input),
      changePassword: (current, next) => api.send('PUT', '/me/password', { current, next }),
      logoutEverywhere: () => api.send('POST', '/auth/logout-all'),
    },

    directory: {
      organization: () => api.request('GET', '/organization'),
      listUsers: () => api.request('GET', '/users'),
      setUserStatus: (id, status) => api.request('PATCH', `/users/${enc(id)}`, { status }),
      setOrgRole: (id, orgRole) => api.request('PATCH', `/users/${enc(id)}`, { orgRole }),
      listInvitations: () => api.request('GET', '/invitations'),
      invite: (input) => api.request('POST', '/invitations', input),
      revokeInvitation: (id) => api.send('DELETE', `/invitations/${enc(id)}`),
      listProjects: () => api.request('GET', '/projects'),
      getProject: (id) => api.request('GET', `/projects/${enc(id)}`),
      updateProject: (id, patch) => api.request('PATCH', `/projects/${enc(id)}`, patch),
      listMembers: (id) => api.request('GET', `/projects/${enc(id)}/members`),
      addMember: (id, userId, role) =>
        api.request('POST', `/projects/${enc(id)}/members`, { userId, role }),
      setMemberRole: (id, userId, role) =>
        api.request('PATCH', `/projects/${enc(id)}/members/${enc(userId)}`, { role }),
      removeMember: (id, userId) =>
        api.send('DELETE', `/projects/${enc(id)}/members/${enc(userId)}`),
      audit: (f) =>
        api.request(
          'GET',
          `/audit${toSearch({ type: f.type, actor: f.actor, page: f.page, limit: f.limit })}`,
        ),
    },

    tokens: {
      list: () => api.request('GET', '/tokens'),
      create: (projectId, label) => api.request('POST', '/tokens', { projectId, label }),
      revoke: (id) => api.send('DELETE', `/tokens/${enc(id)}`),
    },

    notifications: {
      list: (f) =>
        api.request('GET', `/notifications${toSearch({ unread: f.unread, mentions: f.mentions })}`),
      unreadCount: () => api.request('GET', '/notifications/unread-count'),
      markRead: (id) => api.send('POST', `/notifications/${enc(id)}/read`),
      markAllRead: () => api.send('POST', '/notifications/read-all'),
      prefs: () => api.request('GET', '/me/notification-prefs'),
      updatePrefs: (prefs) => api.request('PUT', '/me/notification-prefs', prefs),
    },

    reports: {
      overview: (f) =>
        api.request(
          'GET',
          `/reports/overview${toSearch({ project: f.project, from: f.from, to: f.to })}`,
        ),
    },
  };
}
