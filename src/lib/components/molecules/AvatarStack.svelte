<script lang="ts">
  import { cn } from '$lib/utils/cn';

  import UserAvatar from './UserAvatar.svelte';

  interface StackUser {
    name: string;
    avatar: string | null;
  }

  interface Props {
    users: StackUser[];
    max?: number;
    class?: string;
  }

  let { users, max = 3, class: className }: Props = $props();

  const shown = $derived(users.slice(0, max));
  const rest = $derived(users.length - shown.length);
  const names = $derived(users.map((u) => u.name).join(', '));
</script>

<div class={cn('flex items-center -space-x-1.5', className)} title={names}>
  {#each shown as user, i (`${i}-${user.name}`)}
    <UserAvatar name={user.name} avatar={user.avatar} size="xs" class="ring-2 ring-background" />
  {/each}
  {#if rest > 0}
    <span
      class="flex size-5 items-center justify-center rounded-full bg-muted text-2xs font-medium text-muted-foreground ring-2 ring-background"
    >
      +{rest}
    </span>
  {/if}
  <span class="sr-only">{names}</span>
</div>
