<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { LayoutData } from './$types';

  import { resolve } from '$app/paths';
  import { navigating, page } from '$app/state';

  import { Skeleton } from '$lib/components/atoms/skeleton';
  import ReviewHeader from '$lib/components/organisms/review/ReviewHeader.svelte';
  import RoundBanner from '$lib/components/organisms/review/RoundBanner.svelte';
  import SubmitReviewBar from '$lib/components/organisms/review/SubmitReviewBar.svelte';
  import DetailTemplate from '$lib/components/templates/DetailTemplate.svelte';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  const id = $derived(data.review.id);
  const now = $derived(new Date(data.now));
  const openComments = $derived(data.comments.filter((c) => !c.resolved).length);

  const tabs = $derived([
    {
      key: 'screens',
      label: `Pantallas (${data.review.screens.length})`,
      href: resolve('/(app)/reviews/[id]/(detail)', { id }),
    },
    {
      key: 'summary',
      label: 'Resumen',
      href: resolve('/(app)/reviews/[id]/(detail)/summary', { id }),
    },
    {
      key: 'rounds',
      label: `Rondas (${data.review.rounds.length})`,
      href: resolve('/(app)/reviews/[id]/(detail)/rounds', { id }),
    },
    {
      key: 'feedback',
      label: openComments ? `Para Claude Code (${openComments})` : 'Para Claude Code',
      href: resolve('/(app)/reviews/[id]/(detail)/feedback', { id }),
    },
    {
      key: 'activity',
      label: 'Actividad',
      href: resolve('/(app)/reviews/[id]/(detail)/activity', { id }),
    },
    {
      key: 'branch',
      label: 'Rama y PR',
      href: resolve('/(app)/reviews/[id]/(detail)/branch', { id }),
    },
  ]);
  const currentTab = $derived(page.data.meta?.tab ?? 'screens');

  // Skeleton solo al cambiar de pestaña dentro de la misma revisión.
  const loading = $derived(
    navigating.to !== null &&
      navigating.to.params?.id === id &&
      (navigating.to.route.id ?? '').startsWith('/(app)/reviews/[id]/(detail)') &&
      navigating.to.route.id !== navigating.from?.route.id,
  );
</script>

{#snippet header()}
  <ReviewHeader
    review={data.review}
    people={data.people}
    {now}
    can={data.can}
    designers={data.designers}
  />
{/snippet}

{#snippet banner()}
  <RoundBanner review={data.review} people={data.people} {now} canReopen={data.can.reopen} />
{/snippet}

{#snippet pending()}
  <div class="space-y-3" aria-label="Cargando">
    <Skeleton class="h-5 w-48" />
    <div class="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {#each [1, 2, 3] as n (n)}
        <Skeleton class="h-56 w-full" />
      {/each}
    </div>
  </div>
{/snippet}

{#snippet footer()}
  <SubmitReviewBar review={data.review} />
{/snippet}

<DetailTemplate
  {header}
  {banner}
  {tabs}
  {currentTab}
  {loading}
  {pending}
  footer={data.can.verdict ? footer : undefined}
>
  {@render children()}
</DetailTemplate>
