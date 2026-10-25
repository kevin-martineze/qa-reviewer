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

<div class="flex h-full min-h-0 flex-col gap-4">
  <div class="shrink-0">
    <PageHeader {title} {description} {actions} />
    {#if filters}
      <div>{@render filters()}</div>
    {/if}
  </div>
  <main data-scroll class="min-h-0 flex-1 overflow-y-auto">
    {@render children()}
  </main>
  {#if pagination}
    <footer class="shrink-0">{@render pagination()}</footer>
  {/if}
</div>
