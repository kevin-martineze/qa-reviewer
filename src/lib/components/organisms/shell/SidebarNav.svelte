<script lang="ts">
  import { BarChart3, Building2, Inbox, ListChecks, Settings } from '@lucide/svelte';
  import type { Component } from 'svelte';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/atoms/tooltip';
  import { cn } from '$lib/utils/cn';

  interface Props {
    permissions: string[];
    projectId: string | null;
    collapsed: boolean;
    inboxCount: number;
  }

  let { permissions, projectId, collapsed, inboxCount }: Props = $props();

  interface Entry {
    key: string;
    label: string;
    href: string;
    icon: Component<{ class?: string }>;
    count?: number;
  }

  const main = $derived<Entry[]>([
    { key: 'inbox', label: 'Bandeja', href: resolve('/'), icon: Inbox, count: inboxCount },
    { key: 'reviews', label: 'Revisiones', href: resolve('/reviews'), icon: ListChecks },
    ...(permissions.includes('reports:view')
      ? [{ key: 'metrics', label: 'Métricas', href: resolve('/metrics'), icon: BarChart3 }]
      : []),
  ]);

  const admin = $derived<Entry[]>([
    ...(projectId && permissions.includes('projects:configure')
      ? [
          {
            key: 'project',
            label: 'Proyecto',
            href: resolve('/(app)/projects/[slug]/settings', { slug: projectId }),
            icon: Settings,
          },
        ]
      : []),
    ...(permissions.includes('users:invite')
      ? [{ key: 'admin', label: 'Organización', href: resolve('/admin/users'), icon: Building2 }]
      : []),
  ]);

  // Sección activa según la ruta (route.id), no según la URL.
  const active = $derived.by(() => {
    const id = page.route.id ?? '';
    if (id === '/(app)') return 'inbox';
    if (id.startsWith('/(app)/reviews')) return 'reviews';
    if (id.startsWith('/(app)/metrics')) return 'metrics';
    if (id.startsWith('/(app)/projects')) return 'project';
    if (id.startsWith('/(app)/admin')) return 'admin';
    return '';
  });
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- entry.href ya viene de resolve() -->
{#snippet link(entry: Entry)}
  {@const Icon = entry.icon}
  {@const isActive = active === entry.key}
  {#if collapsed}
    <Tooltip>
      <TooltipTrigger>
        {#snippet child({ props })}
          <a
            {...props}
            href={entry.href}
            aria-label={entry.label}
            aria-current={isActive ? 'page' : undefined}
            class={cn(
              'relative mx-auto flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground',
              isActive && 'bg-sidebar-accent text-foreground',
            )}
          >
            <Icon class="size-4" />
            {#if entry.count}
              <span class="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-info"></span>
            {/if}
          </a>
        {/snippet}
      </TooltipTrigger>
      <TooltipContent side="right">{entry.label}</TooltipContent>
    </Tooltip>
  {:else}
    <a
      href={entry.href}
      aria-current={isActive ? 'page' : undefined}
      class={cn(
        'flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground',
        isActive && 'bg-sidebar-accent text-foreground',
      )}
    >
      <Icon class="size-4" />
      <span class="flex-1 truncate">{entry.label}</span>
      {#if entry.count}
        <span class="tabular rounded-full bg-info-soft px-1.5 text-xs font-semibold text-info">
          {entry.count}
        </span>
      {/if}
    </a>
  {/if}
{/snippet}
<!-- eslint-enable svelte/no-navigation-without-resolve -->

<nav class="flex flex-col gap-0.5 px-2" aria-label="Secciones">
  {#each main as entry (entry.key)}
    {@render link(entry)}
  {/each}
  {#if admin.length}
    {#if collapsed}
      <div class="mx-auto my-2 h-px w-6 bg-border"></div>
    {:else}
      <p class="mt-4 mb-1 px-2.5 text-xs font-medium text-muted-foreground">Configuración</p>
    {/if}
    {#each admin as entry (entry.key)}
      {@render link(entry)}
    {/each}
  {/if}
</nav>
