<script lang="ts">
  import type { Snippet } from 'svelte';

  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import type { LayoutData } from './$types';

  import PageHeader from '$lib/components/molecules/PageHeader.svelte';
  import DetailTemplate from '$lib/components/templates/DetailTemplate.svelte';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  const id = $derived(data.review.id);
  const tabs = $derived([
    { key: 'screens', label: 'Pantallas', href: resolve('/(app)/reviews/[id]/(detail)', { id }) },
    {
      key: 'summary',
      label: 'Resumen',
      href: resolve('/(app)/reviews/[id]/(detail)/summary', { id }),
    },
    {
      key: 'rounds',
      label: 'Rondas',
      href: resolve('/(app)/reviews/[id]/(detail)/rounds', { id }),
    },
    {
      key: 'feedback',
      label: 'Para Claude Code',
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
</script>

{#snippet header()}
  <PageHeader title={data.review.title} description={data.review.context} />
{/snippet}

<DetailTemplate {header} {tabs} {currentTab}>
  {@render children()}
</DetailTemplate>
