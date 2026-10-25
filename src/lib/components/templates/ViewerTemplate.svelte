<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    toolbar: Snippet;
    aside?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { toolbar, aside, footer, children }: Props = $props();
</script>

<!-- Excepción documentada (layouts.md regla 8): el lienzo y el aside tienen scroll propio. -->
<div class="flex h-full min-h-0 flex-col">
  <div class="shrink-0 border-b">{@render toolbar()}</div>
  <div class="flex min-h-0 flex-1">
    <div data-scroll class="min-w-0 flex-1 overflow-auto bg-muted/40">
      {@render children()}
    </div>
    {#if aside}
      <aside data-scroll class="w-96 shrink-0 overflow-y-auto border-l bg-background">
        {@render aside()}
      </aside>
    {/if}
  </div>
  {#if footer}
    <footer class="shrink-0 border-t bg-background">{@render footer()}</footer>
  {/if}
</div>
