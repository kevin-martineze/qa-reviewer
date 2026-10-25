import { resolve } from '$app/paths';
import type { ProjectPatch } from '$lib/api/ports';
import type { Project } from '$lib/api/types';
import { toastResult } from './action-result';
import { gateway } from './gateway';
import { requirePermission } from './guards';

export type ProjectTab = 'general' | 'members' | 'assignment' | 'sla' | 'integrations' | 'rules';

export const PROJECT_TAB_LABEL: Record<ProjectTab, string> = {
  general: 'General',
  members: 'Miembros',
  assignment: 'Asignación',
  sla: 'SLA',
  integrations: 'Integraciones',
  rules: 'Reglas',
};

/** `meta` de cada pestaña de ajustes del proyecto (título, migas y pestaña activa). */
export function projectMeta(project: Pick<Project, 'id' | 'name'>, tab: ProjectTab) {
  return {
    title: `${PROJECT_TAB_LABEL[tab]} · ${project.name}`,
    crumbs: [
      { label: 'Inicio', href: resolve('/') },
      {
        label: project.name,
        href: resolve('/(app)/projects/[slug]/settings', { slug: project.id }),
      },
      { label: PROJECT_TAB_LABEL[tab] },
    ],
    tab,
  };
}

interface SaveEvent {
  locals: App.Locals;
  fetch: typeof fetch;
  params: { slug: string };
}

/** Guarda un cambio de configuración y responde con el toast estándar. */
export async function saveProject(event: SaveEvent, patch: ProjectPatch, message: string) {
  requirePermission(event.locals, 'projects:configure', event.params.slug);
  const result = await gateway(event.locals, event.fetch).directory.updateProject(
    event.params.slug,
    patch,
  );
  return toastResult(result, message);
}
