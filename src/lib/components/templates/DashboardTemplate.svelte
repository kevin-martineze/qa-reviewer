<script lang="ts">
  import type { Snippet } from 'svelte';

  import PageHeader from '$lib/components/molecules/PageHeader.svelte';

  interface Props {
    title: string;
    description?: string;
    filters?: Snippet;
    kpis?: Snippet;
    children: Snippet;
  }

  let { title, description, filters, kpis, children }: Props = $props();
</script>

<div class="flex h-full min-h-0 flex-col gap-4">
  <div class="shrink-0">
    <PageHeader {title} {description} />
    {#if filters}
      <div class="mt-4">{@render filters()}</div>
    {/if}
  </div>
  {#if kpis}
    <div class="shrink-0">{@render kpis()}</div>
  {/if}
  <main data-scroll class="min-h-0 flex-1 overflow-y-auto">
    {@render children()}
  </main>
</div>
