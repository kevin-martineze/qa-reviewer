<script lang="ts">
  import { Inbox } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  import Illustration from '$lib/components/molecules/Illustration.svelte';
  import type { IllustrationName } from '$lib/components/molecules/illustrations';
  import { cn } from '$lib/utils/cn';

  interface Props {
    title: string;
    description?: string;
    /** Ilustración en vez del ícono. Para estados de página completa, no para tarjetas chicas. */
    illustration?: IllustrationName;
    action?: Snippet;
    class?: string;
  }

  let { title, description, illustration, action, class: className }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center gap-2 py-16 text-center', className)}>
  {#if illustration}
    <Illustration name={illustration} class="mb-2" />
  {:else}
    <Inbox class="size-6 text-muted-foreground" />
  {/if}
  <h2 class="text-base font-medium">{title}</h2>
  {#if description}
    <p class="max-w-sm text-sm text-muted-foreground">{description}</p>
  {/if}
  {#if action}
    <div class="mt-2">{@render action()}</div>
  {/if}
</div>
