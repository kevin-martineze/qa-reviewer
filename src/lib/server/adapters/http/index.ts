// Esqueleto del adapter http. TODO: implementar contra el OpenAPI del API real
// (docs/architecture/api.md). Usará locals para el access token de la cookie.
import { err, type Result } from '$lib/api/result';
import type { Gateways } from '$lib/api/ports';

function notImplemented<T>(): Promise<Result<T>> {
  return Promise.resolve(err(501, 'api.not_implemented', 'Adapter http pendiente de implementar.'));
}

export function httpGateway(locals: App.Locals): Gateways {
  void locals;
  return {
    reviews: { list: () => notImplemented(), get: () => notImplemented() },
    feedback: {
      setVerdict: () => notImplemented(),
      submit: () => notImplemented(),
      comments: () => notImplemented(),
      addComment: () => notImplemented(),
      resolveComment: () => notImplemented(),
    },
    auth: {
      login: () => notImplemented(),
      logout: () => notImplemented(),
      me: () => notImplemented(),
    },
    directory: {
      listProjects: () => notImplemented(),
      listMembers: () => notImplemented(),
      listUsers: () => notImplemented(),
      listTokens: () => notImplemented(),
    },
    notifications: { list: () => notImplemented(), markAllRead: () => notImplemented() },
    reports: { overview: () => notImplemented() },
  };
}
