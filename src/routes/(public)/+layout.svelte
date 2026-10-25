<script lang="ts">
  import type { Snippet } from 'svelte';

  import { page } from '$app/state';
  import AuthTemplate from '$lib/components/templates/AuthTemplate.svelte';

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

<AuthTemplate
  title={page.data.meta?.title ?? 'QA Reviewer'}
  description={page.data.meta?.description}
>
  {@render children()}
</AuthTemplate>
