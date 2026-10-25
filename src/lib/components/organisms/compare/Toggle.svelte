<script lang="ts">
  import { onMount } from 'svelte';

  import { Button } from '$lib/components/atoms/button';

  import type { CompareProps } from './types';

  let { beforeSrc, beforeLabel, afterLabel, after }: CompareProps = $props();

  let showBefore = $state(false);

  // «T» alterna mientras el foco no esté en un campo de texto.
  onMount(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      )
        return;
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        showBefore = !showBefore;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<div class="space-y-2">
  <div class="flex items-center justify-between gap-2">
    <p class="text-xs font-medium" aria-live="polite">
      Mostrando: <span class="text-foreground">{showBefore ? beforeLabel : afterLabel}</span>
    </p>
    <Button type="button" size="xs" variant="outline" onclick={() => (showBefore = !showBefore)}>
      Alternar <kbd class="ml-1 rounded-sm border px-1 font-mono text-2xs">T</kbd>
    </Button>
  </div>
  <div class="relative overflow-hidden rounded-md border">
    {@render after()}
    {#if showBefore}
      <img src={beforeSrc} alt={beforeLabel} class="absolute inset-0 block h-auto w-full" />
    {/if}
  </div>
</div>
