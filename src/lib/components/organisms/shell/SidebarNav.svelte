<script lang="ts">
  import { BarChart3, Building2, Inbox, ListChecks, Settings } from '@lucide/svelte';
  import type { LucideIcon } from '@lucide/svelte';

  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { cn } from '$lib/utils/cn';

  interface Props {
    permissions: string[];
    currentProjectId: string;
  }

  let { permissions, currentProjectId }: Props = $props();

  interface NavEntry {
    key: string;
    label: string;
    routeId: '/' | '/reviews' | '/metrics' | '/admin/users';
    icon: LucideIcon;
  }

  const items = $derived.by((): NavEntry[] => {
    const list: NavEntry[] = [
      { key: 'inbox', label: 'Bandeja', routeId: '/', icon: Inbox },
      { key: 'reviews', label: 'Revisiones', routeId: '/reviews', icon: ListChecks },
    ];
    if (permissions.includes('reports:view')) {
      list.push({ key: 'metrics', label: 'Métricas', routeId: '/metrics', icon: BarChart3 });
    }
    if (permissions.includes('users:invite')) {
      list.push({
        key: 'admin',
        label: 'Organización',
        routeId: '/admin/users',
        icon: Building2,
      });
    }
    return list;
  });

  const active = $derived.by((): string => {
    const path = page.url.pathname;
    if (path === '/') return 'inbox';
    if (path.startsWith('/metrics')) return 'metrics';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/reviews')) return 'reviews';
    if (path.startsWith('/projects/')) return 'project-settings';
    return '';
  });
</script>

<nav class="flex flex-1 flex-col gap-1 p-2">
  {#each items as item (item.key)}
    {@const Icon = item.icon}
    <a
      href={resolve(item.routeId)}
      class={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        active === item.key && 'bg-muted text-foreground',
      )}
      aria-current={active === item.key ? 'page' : undefined}
    >
      <Icon class="size-4" />
      {item.label}
    </a>
  {/each}

  {#if permissions.includes('projects:configure')}
    <a
      href={resolve('/(app)/projects/[slug]/settings', { slug: currentProjectId })}
      class={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        active === 'project-settings' && 'bg-muted text-foreground',
      )}
      aria-current={active === 'project-settings' ? 'page' : undefined}
    >
      <Settings class="size-4" />
      Ajustes del proyecto
    </a>
  {/if}
</nav>
