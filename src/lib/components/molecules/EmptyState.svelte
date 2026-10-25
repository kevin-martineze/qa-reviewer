<script lang="ts">
  import { Inbox } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils/cn';

  interface Props {
    title: string;
    description?: string;
    action?: Snippet;
    class?: string;
  }

  let { title, description, action, class: className }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center gap-2 py-16 text-center', className)}>
  <Inbox class="size-6 text-muted-foreground" />
  <h2 class="text-base font-medium">{title}</h2>
  {#if description}
    <p class="max-w-sm text-sm text-muted-foreground">{description}</p>
  {/if}
  {#if action}
    <div class="mt-2">{@render action()}</div>
  {/if}
</div>
