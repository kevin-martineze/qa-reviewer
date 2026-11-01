<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { LayoutData } from './$types';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import AuthTemplate from '$lib/components/templates/AuthTemplate.svelte';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }
  let { data, children }: Props = $props();
</script>

<AuthTemplate
  title={page.data.meta?.title ?? 'QA Reviewer'}
  description={page.data.meta?.description}
>
  {@render children()}
  {#snippet footer()}
    <span>
      Entraste como <span class="font-medium text-foreground">{data.account.email}</span> ·
      <a href={resolve('/')} class="underline underline-offset-4 hover:text-foreground">
        Ir a QA Reviewer
      </a>
    </span>
  {/snippet}
</AuthTemplate>
