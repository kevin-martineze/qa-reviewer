<script lang="ts">
  import { Bell, CheckCheck } from '@lucide/svelte';

  import { enhance } from '$app/forms';
  import { afterNavigate } from '$app/navigation';
  import { resolve } from '$app/paths';

  import type { Notification } from '$lib/api/types';
  import { Button, buttonVariants } from '$lib/components/atoms/button';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/atoms/popover';
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import NotificationItem from '$lib/components/organisms/notifications/NotificationItem.svelte';
  import { cn } from '$lib/utils/cn';

  interface Props {
    recent: Notification[];
    unread: number;
    now: Date;
  }

  let { recent, unread, now }: Props = $props();

  let open = $state(false);

  // Abrir una notificación navega con un POST: cierra el panel al llegar.
  afterNavigate(() => {
    open = false;
  });
</script>

<Popover bind:open>
  <PopoverTrigger
    class={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'relative')}
    aria-label={unread ? `Notificaciones, ${unread} sin leer` : 'Notificaciones'}
  >
    <Bell />
    {#if unread > 0}
      <span
        class="tabular absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-2xs font-semibold text-danger-foreground"
      >
        {unread > 9 ? '9+' : unread}
      </span>
    {/if}
  </PopoverTrigger>

  <PopoverContent align="end" class="w-96 gap-0 p-0">
    <div class="flex items-center justify-between border-b px-4 py-3">
      <p class="text-sm font-semibold">Notificaciones</p>
      {#if unread > 0}
        <form method="post" action="{resolve('/(app)/notifications')}?/markAllRead" use:enhance>
          <Button type="submit" variant="ghost" size="xs">
            <CheckCheck /> Marcar todas como leídas
          </Button>
        </form>
      {/if}
    </div>

    <div class="max-h-96 divide-y overflow-y-auto">
      {#each recent as n (n.id)}
        <NotificationItem notification={n} {now} compact />
      {:else}
        <EmptyState
          title="Sin notificaciones"
          description="Aquí verás asignaciones, rondas y respuestas."
        />
      {/each}
    </div>

    <div class="border-t p-1">
      <a
        href={resolve('/notifications')}
        class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-full')}
      >
        Ver todas
      </a>
    </div>
  </PopoverContent>
</Popover>
