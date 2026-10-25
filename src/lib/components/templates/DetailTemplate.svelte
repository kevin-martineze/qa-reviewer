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
  <header class="shrink-0 pb-4">{@render header()}</header>
  {@render banner?.()}
  <NavTabs items={tabs} current={currentTab} class="shrink-0" />
  <main data-scroll class="min-h-0 flex-1 overflow-y-auto py-4">
    {#if loading && pending}
      {@render pending()}
    {:else}
      {@render children()}
    {/if}
  </main>
  {#if footer}
    <footer class="shrink-0 border-t bg-background">{@render footer()}</footer>
  {/if}
</div>
