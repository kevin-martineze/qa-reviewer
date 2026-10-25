<script lang="ts">
  import type { Snippet } from 'svelte';

  import PageHeader from '$lib/components/molecules/PageHeader.svelte';

  interface Props {
    title: string;
    description?: string;
    actions?: Snippet;
    filters?: Snippet;
    pagination?: Snippet;
    children: Snippet;
  }

  let { title, description, actions, filters, pagination, children }: Props = $props();
</script>

<div class="flex h-full min-h-0 flex-col">
  <div class="shrink-0 space-y-4 px-6 pt-6 pb-4">
    <PageHeader {title} {description} {actions} />
    {#if filters}
      <div>{@render filters()}</div>
    {/if}
  </div>
  <div data-scroll class="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
    {@render children()}
  </div>
  {#if pagination}
    <footer class="shrink-0 border-t px-6 py-3">{@render pagination()}</footer>
  {/if}
</div>
