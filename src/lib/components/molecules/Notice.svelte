<script lang="ts">
  import { CircleAlert, CircleCheck, Info, TriangleAlert } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils/cn';

  import { TONE_CLASS } from './tone';

  interface Props {
    tone?: 'info' | 'success' | 'warning' | 'danger';
    title?: string;
    class?: string;
    children?: Snippet;
  }

  let { tone = 'info', title, class: className, children }: Props = $props();

  const Icon = $derived(
    tone === 'success'
      ? CircleCheck
      : tone === 'warning'
        ? TriangleAlert
        : tone === 'danger'
          ? CircleAlert
          : Info,
  );
</script>

<div
  role={tone === 'danger' ? 'alert' : 'status'}
  class={cn('flex gap-2 rounded-md px-3 py-2 text-sm', TONE_CLASS[tone], className)}
>
  <Icon class="mt-0.5 size-4 shrink-0" />
  <div class="min-w-0 space-y-0.5">
    {#if title}<p class="font-medium">{title}</p>{/if}
    {#if children}<div class="text-foreground/80">{@render children()}</div>{/if}
  </div>
</div>
