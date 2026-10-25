<script lang="ts">
  import '../app.css';
  import '@fontsource-variable/geist';
  import '@fontsource-variable/geist-mono';
  import type { Snippet } from 'svelte';
  import { ModeWatcher } from 'mode-watcher';

  import { page } from '$app/state';
  import { Toaster } from '$lib/components/atoms/sonner';
  import { TooltipProvider } from '$lib/components/atoms/tooltip';

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();

  const title = $derived(page.data.meta?.title);
</script>

<svelte:head>
  <title>{title ? `${title} · QA Reviewer` : 'QA Reviewer'}</title>
</svelte:head>

<TooltipProvider delayDuration={300}>
  {@render children()}
</TooltipProvider>
<ModeWatcher />
<Toaster />
