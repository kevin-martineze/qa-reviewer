<script lang="ts">
  import { CircleDashed } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { resolve } from '$app/paths';

  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import ScreenCard from '$lib/components/organisms/review/ScreenCard.svelte';
  import { awaitingFollowUp } from '$lib/domain/follow-ups';
  import { cn } from '$lib/utils/cn';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const review = $derived(data.review);
  const changed = $derived(review.screens.filter((s) => s.changedIn === review.round));
  const showFilter = $derived(review.round > 1 && changed.length < review.screens.length);
  const screens = $derived(data.changedOnly && showFilter ? changed : review.screens);

  function openCommentsOf(key: string) {
    return data.comments.filter((c) => c.screen === key && !c.resolved).length;
  }
  function followUpsOf(key: string) {
    return data.comments.filter((c) => c.screen === key && awaitingFollowUp(c, review.round))
      .length;
  }
</script>

<div class="space-y-5">
  {#if showFilter}
    <div
      class="inline-flex rounded-md border p-0.5 text-sm"
      role="group"
      aria-label="Filtrar pantallas"
    >
      {#each [{ on: false, label: `Todas (${review.screens.length})`, search: '' }, { on: true, label: `Cambiaron en la ronda ${review.round} (${changed.length})`, search: '?changed=1' }] as opt (opt.label)}
        <a
          href="{resolve('/(app)/reviews/[id]/(detail)', { id: review.id })}{opt.search}"
          aria-current={data.changedOnly === opt.on ? 'true' : undefined}
          class={cn(
            'rounded-sm px-3 py-1 text-muted-foreground transition-colors hover:text-foreground',
            data.changedOnly === opt.on && 'bg-secondary font-medium text-foreground',
          )}
        >
          {opt.label}
        </a>
      {/each}
    </div>
  {/if}

  {#if screens.length}
    <ul class="grid grid-cols-2 gap-4 xl:grid-cols-3 3xl:grid-cols-4">
      {#each screens as screen (screen.key)}
        <li class="flex">
          <ScreenCard
            reviewId={review.id}
            {screen}
            round={review.round}
            openComments={openCommentsOf(screen.key)}
            followUps={followUpsOf(screen.key)}
          />
        </li>
      {/each}
    </ul>
  {:else}
    <EmptyState title="Esta revisión no tiene pantallas" />
  {/if}

  {#if review.notCaptured.length}
    <Notice tone="info" title="Estados que la skill no capturó">
      <ul class="mt-1 space-y-0.5">
        {#each review.notCaptured as item (item)}
          <li class="flex gap-2">
            <CircleDashed class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />{item}
          </li>
        {/each}
      </ul>
      <p class="mt-2 text-xs text-muted-foreground">
        Revísalos en el entorno de QA o pide la captura en un comentario.
      </p>
    </Notice>
  {/if}
</div>
