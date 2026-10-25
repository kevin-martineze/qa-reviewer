<script lang="ts">
  import { cn } from '$lib/utils/cn';

  import UserAvatar from './UserAvatar.svelte';

  interface Props {
    names: string[];
    max?: number;
    class?: string;
  }

  let { names, max = 3, class: className }: Props = $props();

  const shown = $derived(names.slice(0, max));
  const rest = $derived(names.length - shown.length);
</script>

<div class={cn('flex items-center -space-x-1.5', className)} title={names.join(', ')}>
  {#each shown as name, i (`${i}-${name}`)}
    <UserAvatar {name} size="xs" class="ring-2 ring-background" />
  {/each}
  {#if rest > 0}
    <span
      class="flex size-5 items-center justify-center rounded-full bg-muted text-2xs font-medium text-muted-foreground ring-2 ring-background"
    >
      +{rest}
    </span>
  {/if}
  <span class="sr-only">{names.join(', ')}</span>
</div>
