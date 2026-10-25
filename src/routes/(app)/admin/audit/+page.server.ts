import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';
import { AUDIT_PAGE_SIZE, parseAuditQuery } from '$lib/domain/audit-query';
import { gateway } from '$lib/server/gateway';
import { requirePermission, unwrap } from '$lib/server/guards';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  requirePermission(locals, 'users:invite');
  const query = parseAuditQuery(url.searchParams);
  const result = await gateway(locals, fetch).directory.audit({
    type: query.type || undefined,
    actor: query.actor || undefined,
    page: query.page,
    limit: AUDIT_PAGE_SIZE,
  });
  const { items, pagination } = unwrap(result, url);
  return {
    meta: {
      title: 'Auditoría',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Auditoría' }],
      tab: 'audit',
    },
    events: items,
    pagination,
    query,
  };
};
