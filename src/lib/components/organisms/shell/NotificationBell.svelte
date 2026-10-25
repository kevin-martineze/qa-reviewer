<script lang="ts">
  import { Bell } from '@lucide/svelte';

  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation';
  import { resolve } from '$app/paths';
  import type { Notification } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
  } from '$lib/components/atoms/popover';
  import { cn } from '$lib/utils/cn';

  interface Props {
    notifications: Notification[];
    unread: number;
  }

  let { notifications, unread }: Props = $props();

  const last = $derived(notifications.slice(0, 5));
</script>

<Popover>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="relative" aria-label="Notificaciones">
        <Bell class="size-4" />
        {#if unread > 0}
          <span
            class="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-4 text-primary-foreground"
          >
            {unread}
          </span>
        {/if}
      </Button>
    {/snippet}
  </PopoverTrigger>

  <PopoverContent align="end" class="w-80 gap-0 p-0">
    <PopoverHeader class="flex-row items-center justify-between border-b px-4 py-3">
      <PopoverTitle class="text-sm font-semibold">Notificaciones</PopoverTitle>
      {#if unread > 0}
        <form
          method="post"
          action={resolve('/api/mark-all-read')}
          use:enhance={() => async () => {
            await invalidate('notifications');
          }}
        >
          <Button type="submit" variant="ghost" size="xs">Marcar todas como leídas</Button>
        </form>
      {/if}
    </PopoverHeader>

    <div class="max-h-80 overflow-y-auto">
      {#if last.length === 0}
        <p class="px-4 py-8 text-center text-sm text-muted-foreground">Sin notificaciones.</p>
      {:else}
        {#each last as n, i (n.when + i)}
          <div
            class={cn(
              'flex gap-2 border-b px-4 py-3 text-sm last:border-b-0',
              n.unread && 'bg-muted/40',
            )}
          >
            <span
              class={cn(
                'mt-1.5 size-1.5 shrink-0 rounded-full',
                n.unread ? 'bg-primary' : 'bg-transparent',
              )}
            ></span>
            <div class="min-w-0">
              <p class="text-sm">{n.text}</p>
              <p class="text-xs text-muted-foreground">{n.when}</p>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <div class="border-t px-4 py-2">
      <a href={resolve('/notifications')} class="text-sm font-medium text-primary hover:underline">
        Ver todas
      </a>
    </div>
  </PopoverContent>
</Popover>
