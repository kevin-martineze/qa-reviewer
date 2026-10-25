<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    toolbar: Snippet;
    aside?: Snippet;
    footer?: Snippet;
    asideWidth?: string;
    children: Snippet;
  }

  let { toolbar, aside, footer, asideWidth = '20rem', children }: Props = $props();
</script>

<div class="flex h-full min-h-0 flex-col">
  <div class="shrink-0 border-b">{@render toolbar()}</div>
  <div class="flex min-h-0 flex-1">
    <main data-scroll class="min-w-0 flex-1 overflow-y-auto">
      {@render children()}
    </main>
    {#if aside}
      <aside data-scroll class="shrink-0 overflow-y-auto border-l" style="width: {asideWidth}">
        {@render aside()}
      </aside>
    {/if}
  </div>
  {#if footer}
    <footer class="shrink-0 border-t">{@render footer()}</footer>
  {/if}
</div>
