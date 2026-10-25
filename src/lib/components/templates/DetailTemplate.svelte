<script lang="ts">
  import type { Snippet } from 'svelte';

  import NavTabs from '$lib/components/molecules/NavTabs.svelte';
  import type { NavItem } from '$lib/components/molecules/nav';

  interface Props {
    header: Snippet;
    tabs: NavItem[];
    currentTab: string;
    banner?: Snippet;
    footer?: Snippet;
    pending?: Snippet;
    loading?: boolean;
    children: Snippet;
  }

  let {
    header,
    tabs,
    currentTab,
    banner,
    footer,
    pending,
    loading = false,
    children,
  }: Props = $props();
</script>

<div class="flex h-full min-h-0 flex-col">
  <div class="shrink-0 space-y-4 px-6 pt-6">
    {@render header()}
    {@render banner?.()}
    <NavTabs items={tabs} current={currentTab} />
  </div>
  <div data-scroll class="min-h-0 flex-1 overflow-y-auto px-6 py-5" aria-busy={loading}>
    {#if loading && pending}
      {@render pending()}
    {:else}
      {@render children()}
    {/if}
  </div>
  {#if footer}
    <footer class="shrink-0 border-t bg-background px-6 py-3">{@render footer()}</footer>
  {/if}
</div>
