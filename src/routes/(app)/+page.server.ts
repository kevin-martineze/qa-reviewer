import type { PageServerLoad } from './$types';
import type { ReviewFilters } from '$lib/api/ports';
import type { Review } from '$lib/api/types';
import { gateway } from '$lib/server/gateway';
import { requireUser, unwrap } from '$lib/server/guards';

interface SectionDef {
  key: 'mine' | 'team' | 'authored' | 'recent';
  title: string;
  description: string;
  empty: string;
  filters: ReviewFilters;
  /** Query del listado completo (`/reviews?…`). */
  more: string;
}

export interface InboxSection extends Omit<SectionDef, 'filters'> {
  items: Review[];
  total: number;
}

const PENDING = ['open', 'in_review'] as const;
const LIMIT = 5;

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  const user = requireUser(locals);
  const perms = locals.permissions;
  const project = locals.projectId ?? undefined;
  const g = gateway(locals, fetch);

  // Lo que ve cada rol (users-and-roles.md): diseño trabaja lo asignado, el líder
  // vigila lo vencido del equipo y quien desarrolla sigue lo que subió.
  const defs: SectionDef[] = [];
  if (perms.has('verdicts:set')) {
    defs.push({
      key: 'mine',
      title: 'Te toca revisar',
      description: 'Asignadas a ti y esperando veredicto. La que vence primero va arriba.',
      empty: 'No tienes revisiones pendientes.',
      filters: { assignee: user.id, status: [...PENDING], sort: 'due' },
      more: '?assignee=me&sort=due',
    });
  }
  if (perms.has('reviews:assign')) {
    defs.push({
      key: 'team',
      title: 'Vencidas del equipo',
      description: 'Pasaron el plazo del proyecto sin envío. Reasigna o pide prioridad.',
      empty: 'Ninguna revisión vencida.',
      filters: { overdue: true, status: [...PENDING], sort: 'due' },
      more: '?overdue=1&sort=due',
    });
  }
  if (perms.has('reviews:create')) {
    defs.push({
      key: 'authored',
      title: 'Tus revisiones',
      description: 'Lo que subiste con /design-review y sigue abierto.',
      empty: 'No tienes revisiones abiertas.',
      filters: { author: user.id, status: [...PENDING, 'changes_requested'], sort: 'updated' },
      more: '?author=me&view=all',
    });
  }
  if (defs.length === 0) {
    defs.push({
      key: 'recent',
      title: 'En curso en el proyecto',
      description: 'Revisiones abiertas, las más recientes primero.',
      empty: 'No hay revisiones abiertas.',
      filters: { status: [...PENDING], sort: 'updated' },
      more: '',
    });
  }

  const [results, waiting] = await Promise.all([
    Promise.all(defs.map((d) => g.reviews.list({ ...d.filters, project, limit: LIMIT }))),
    perms.has('reviews:create')
      ? g.reviews.list({ author: user.id, status: ['changes_requested'], project, limit: 1 })
      : Promise.resolve(null),
  ]);

  const sections: InboxSection[] = defs.map(({ filters, ...def }, i) => {
    void filters;
    const page = unwrap(
      results[i] ?? {
        ok: true,
        data: { items: [], pagination: { page: 1, limit: LIMIT, total: 0 } },
      },
      url,
    );
    return { ...def, items: page.items, total: page.pagination.total };
  });

  return {
    // «Tus revisiones» vacía es ruido para quien no suele subir cambios (p. ej. un admin).
    sections: sections.filter((s) => s.key !== 'authored' || s.total > 0 || sections.length === 1),
    waitingOnMe: waiting?.ok ? waiting.data.pagination.total : 0,
    meta: { title: 'Bandeja', crumbs: [{ label: 'Bandeja' }] },
  };
};
