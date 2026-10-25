import type { PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import {
  parseReviewQuery,
  toReviewFilters,
  VIEW_KEYS,
  type StatusView,
} from '$lib/domain/review-query';
import { gateway } from '$lib/server/gateway';
import { requireUser, unwrap } from '$lib/server/guards';

export const load: PageServerLoad = async ({ locals, fetch, url, parent }) => {
  const user = requireUser(locals);
  const { people } = await parent();
  const g = gateway(locals, fetch);
  const query = parseReviewQuery(url.searchParams);
  const ctx = { userId: user.id, projectId: locals.projectId };

  const [result, members, ...viewCounts] = await Promise.all([
    g.reviews.list(toReviewFilters(query, ctx)),
    locals.projectId ? g.directory.listMembers(locals.projectId) : Promise.resolve(null),
    // Conteos de las pestañas con los mismos filtros, sin paginar.
    ...VIEW_KEYS.map((view) =>
      g.reviews.list({ ...toReviewFilters({ ...query, view, page: 1 }, ctx), limit: 1 }),
    ),
  ]);

  const list = unwrap(result, url);
  const counts: Partial<Record<StatusView, number>> = {};
  VIEW_KEYS.forEach((view, i) => {
    const r = viewCounts[i];
    if (r?.ok) counts[view] = r.data.pagination.total;
  });

  const memberIds = members?.ok ? members.data.map((m) => m.userId) : Object.keys(people);
  const peopleOptions = memberIds
    .filter((id) => id !== user.id && people[id]?.active)
    .map((id) => ({ value: id, label: people[id]?.name ?? id }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));

  return {
    query,
    reviews: list.items,
    pagination: list.pagination,
    counts,
    peopleOptions,
    meta: {
      title: 'Revisiones',
      crumbs: [{ label: 'Bandeja', href: resolve('/') }, { label: 'Revisiones' }],
    },
  };
};
