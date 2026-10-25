<script lang="ts">
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils/cn';

  interface Props {
    title: string;
    description?: string;
    actions?: Snippet;
    class?: string;
  }

  let { title, description, actions, class: className }: Props = $props();
</script>

<div class={cn('flex flex-wrap items-start justify-between gap-4', className)}>
  <div class="min-w-0">
    <h1 class="text-xl font-semibold">{title}</h1>
    {#if description}
      <p class="text-sm text-muted-foreground">{description}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex shrink-0 items-center gap-2">{@render actions()}</div>
  {/if}
</div>
