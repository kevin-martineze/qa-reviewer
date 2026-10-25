<script lang="ts">
  import { CheckCheck, Settings } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';

  import { Button, buttonVariants } from '$lib/components/atoms/button';
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import NotificationItem from '$lib/components/organisms/notifications/NotificationItem.svelte';
  import ListTemplate from '$lib/components/templates/ListTemplate.svelte';
  import { cn } from '$lib/utils/cn';
  import { groupByDay } from '$lib/utils/group-by-day';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
  const groups = $derived(groupByDay(data.items, now));

  const TABS = [
    { key: 'all', label: 'Todas', search: '' },
    { key: 'unread', label: 'No leídas', search: '?tab=unread' },
    { key: 'mentions', label: 'Menciones', search: '?tab=mentions' },
  ] as const;

  const EMPTY = {
    all: {
      title: 'Sin notificaciones',
      description: 'Aquí verás asignaciones, rondas, menciones y respuestas.',
    },
    unread: { title: 'Estás al día', description: 'No tienes notificaciones sin leer.' },
    mentions: {
      title: 'Nadie te ha mencionado',
      description: 'Cuando alguien escriba @tu-nombre en un comentario, aparecerá aquí.',
    },
  } as const;

  let marking = $state(false);
</script>

<ListTemplate
  title="Notificaciones"
  description="Lo que pasó en las revisiones en las que participas."
>
  {#snippet actions()}
    {#if data.unread > 0}
      <form
        method="post"
        action="?/markAllRead"
        use:enhance={() => {
          marking = true;
          return async ({ update }) => {
            await update();
            marking = false;
          };
        }}
      >
        <Button type="submit" variant="outline" size="sm" disabled={marking}>
          <CheckCheck /> Marcar todas como leídas
        </Button>
      </form>
    {/if}
    <a
      href={resolve('/settings/notifications')}
      class={buttonVariants({ variant: 'ghost', size: 'sm' })}
    >
      <Settings /> Preferencias
    </a>
  {/snippet}

  {#snippet filters()}
    <nav class="flex items-center gap-1 border-b" aria-label="Filtrar notificaciones">
      {#each TABS as tab (tab.key)}
        {@const active = tab.key === data.tab}
        <a
          href="{resolve('/notifications')}{tab.search}"
          aria-current={active ? 'page' : undefined}
          class={cn(
            '-mb-px flex items-center gap-1.5 border-b-2 border-transparent px-2.5 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
            active && 'border-primary text-foreground',
          )}
        >
          {tab.label}
          {#if tab.key === 'unread' && data.unread > 0}
            <span class="rounded-full bg-info-soft px-1.5 text-xs text-info tabular-nums">
              {data.unread}
            </span>
          {/if}
        </a>
      {/each}
    </nav>
  {/snippet}

  {#if groups.length}
    <div class="max-w-3xl space-y-6">
      {#each groups as group (group.key)}
        <section aria-labelledby="day-{group.key}">
          <h2 id="day-{group.key}" class="mb-1 px-3 text-xs font-medium text-muted-foreground">
            {group.label}
          </h2>
          <ul class="space-y-0.5">
            {#each group.items as n (n.id)}
              <li><NotificationItem notification={n} {now} /></li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>
  {:else}
    <EmptyState title={EMPTY[data.tab].title} description={EMPTY[data.tab].description} />
  {/if}
</ListTemplate>
