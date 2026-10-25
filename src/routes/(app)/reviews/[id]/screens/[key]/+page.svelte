<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';

  import { resolve } from '$app/paths';
  import type { PageData } from './$types';

  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import ViewerTemplate from '$lib/components/templates/ViewerTemplate.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

{#snippet toolbar()}
  <div class="flex items-center justify-between gap-2 px-4 py-3">
    <div class="min-w-0">
      <p class="truncate text-sm font-medium">{data.screen.title}</p>
      <p class="text-xs text-muted-foreground">{data.screen.vp} · {data.screen.route}</p>
    </div>
    <a
      href={resolve('/(app)/reviews/[id]/(detail)', { id: data.review.id })}
      class="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      <ArrowLeft class="size-4" />
      Volver a la revisión
    </a>
  </div>
{/snippet}

<ViewerTemplate {toolbar}>
  <EmptyState
    title="Llega en la fase 4"
    description="El visor con la captura, los elementos y los comentarios se construye en la fase 4."
  />
</ViewerTemplate>
