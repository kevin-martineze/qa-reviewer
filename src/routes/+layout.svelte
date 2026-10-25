<script lang="ts">
  import '@fontsource-variable/geist';
  import '@fontsource-variable/geist-mono';
  import type { Snippet } from 'svelte';
  import { Toaster } from '$lib/components/atoms/sonner';

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

{@render children()}
<Toaster />
