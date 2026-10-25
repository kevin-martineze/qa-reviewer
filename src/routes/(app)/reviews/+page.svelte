<script lang="ts">
  import type { PageData } from './$types';

  import { resolve } from '$app/paths';

  import { buttonVariants } from '$lib/components/atoms/button';
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import Pagination from '$lib/components/molecules/Pagination.svelte';
  import ReviewFiltersBar from '$lib/components/organisms/reviews/ReviewFiltersBar.svelte';
  import ReviewsTable from '$lib/components/organisms/reviews/ReviewsTable.svelte';
  import ListTemplate from '$lib/components/templates/ListTemplate.svelte';
  import { DEFAULT_QUERY, hasFilters, reviewQueryHref } from '$lib/domain/review-query';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
</script>

<ListTemplate title="Revisiones" description="Todas las revisiones del proyecto activo.">
  {#snippet filters()}
    <ReviewFiltersBar query={data.query} people={data.peopleOptions} counts={data.counts} />
  {/snippet}

  {#if data.reviews.length}
    <ReviewsTable reviews={data.reviews} people={data.people} {now} />
  {:else if hasFilters(data.query)}
    <EmptyState
      title="Nada coincide con los filtros"
      description="Prueba con otra búsqueda o quita algún filtro."
    >
      {#snippet action()}
        <a
          href="{resolve('/reviews')}{reviewQueryHref(
            { ...DEFAULT_QUERY, view: data.query.view },
            {},
          )}"
          class={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          Limpiar filtros
        </a>
      {/snippet}
    </EmptyState>
  {:else}
    <EmptyState
      title="No hay revisiones en esta vista"
      description="Cuando la skill /design-review suba un cambio, aparecerá aquí."
    />
  {/if}

  {#snippet pagination()}
    <Pagination
      page={data.pagination.page}
      limit={data.pagination.limit}
      total={data.pagination.total}
      hrefFor={(page) => `${resolve('/reviews')}${reviewQueryHref(data.query, { page })}`}
    />
  {/snippet}
</ListTemplate>
