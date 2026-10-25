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

<div class="flex h-full min-h-0 flex-col">
  <div class="shrink-0 space-y-4 px-6 pt-6 pb-4">
    <PageHeader {title} {description} />
    {#if filters}
      <div>{@render filters()}</div>
    {/if}
  </div>
  <div data-scroll class="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pb-6">
    {#if kpis}
      <div>{@render kpis()}</div>
    {/if}
    {@render children()}
  </div>
</div>
