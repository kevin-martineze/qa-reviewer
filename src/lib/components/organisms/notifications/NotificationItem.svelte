<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';

  import type { Notification } from '$lib/api/types';
  import { formatRelative } from '$lib/utils/dates';
  import { cn } from '$lib/utils/cn';

  import { NOTIFICATION_ICON } from './notification-icons';

  interface Props {
    notification: Notification;
    now: Date;
    compact?: boolean;
  }

  let { notification: n, now, compact = false }: Props = $props();

  const Icon = $derived(NOTIFICATION_ICON[n.type]);
  const unread = $derived(n.readAt === null);
</script>

<!-- Abrir marca como leída y lleva al lugar exacto (POST: un prefetch no la marca). -->
<form method="post" action="{resolve('/(app)/notifications')}?/open" use:enhance>
  <input type="hidden" name="id" value={n.id} />
  <button
    type="submit"
    class={cn(
      'flex w-full gap-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none',
      compact ? 'px-4 py-3' : 'rounded-lg px-3 py-3',
      unread && 'bg-info-soft/40',
    )}
  >
    <span
      class={cn(
        'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
        unread ? 'bg-info-soft text-info' : 'bg-muted text-muted-foreground',
      )}
    >
      <Icon class="size-3.5" />
    </span>
    <span class="min-w-0 flex-1">
      <span
        class={cn('block text-sm', unread ? 'font-medium text-foreground' : 'text-foreground/80')}
      >
        {n.text}
      </span>
      <span class="block text-xs text-muted-foreground">{formatRelative(n.createdAt, now)}</span>
    </span>
    {#if unread}
      <span class="mt-2 size-2 shrink-0 rounded-full bg-info" aria-label="Sin leer"></span>
    {/if}
  </button>
</form>
