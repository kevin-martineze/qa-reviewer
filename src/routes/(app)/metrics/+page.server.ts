import { resolve } from '$app/paths';
import type { PageServerLoad } from './$types';
import { parseMetricsQuery } from '$lib/domain/metrics-query';
import { permissionsFor } from '$lib/domain/permissions';
import { gateway } from '$lib/server/gateway';
import { requirePermission, unwrap } from '$lib/server/guards';

const DAY = 86_400_000;

export const load: PageServerLoad = async ({ locals, fetch, url, parent }) => {
  const user = requirePermission(locals, 'reports:view');
  const { projects } = await parent();
  // Solo los proyectos donde la persona puede ver métricas.
  const visible = projects.filter((p) => permissionsFor(user, p.id).has('reports:view'));
  const query = parseMetricsQuery(
    url.searchParams,
    visible.map((p) => p.id),
  );
  const overview = unwrap(
    await gateway(locals, fetch).reports.overview({
      project: query.project || undefined,
      from: new Date(Date.now() - query.range * DAY).toISOString(),
    }),
    url,
  );
  return {
    meta: {
      title: 'Métricas',
      crumbs: [{ label: 'Inicio', href: resolve('/') }, { label: 'Métricas' }],
    },
    overview,
    query,
    projectOptions: visible.map((p) => ({ value: p.id, label: p.name })),
  };
};
