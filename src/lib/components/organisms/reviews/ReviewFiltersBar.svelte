<script lang="ts">
  import { Search, X } from '@lucide/svelte';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import FilterSelect from '$lib/components/molecules/FilterSelect.svelte';
  import type { FilterOption } from '$lib/components/molecules/filter';
  import { PRIORITY } from '$lib/domain/labels';
  import {
    DEFAULT_QUERY,
    hasFilters,
    isPriority,
    isSort,
    reviewQueryHref,
    SORTS,
    STATUS_VIEWS,
    VIEW_KEYS,
    type ReviewQuery,
    type StatusView,
  } from '$lib/domain/review-query';
  import { cn } from '$lib/utils/cn';

  interface Props {
    query: ReviewQuery;
    /** Personas del proyecto para los filtros de asignado y autor. */
    people: FilterOption[];
    /** Conteo por vista (pestañas). */
    counts: Partial<Record<StatusView, number>>;
  }

  let { query, people, counts }: Props = $props();

  // Copia local del buscador: se aplica al enviar (Enter) para no navegar en cada tecla.
  let q = $state(page.url.searchParams.get('q') ?? '');

  const views = VIEW_KEYS.map((key) => ({ key, label: STATUS_VIEWS[key].label }));

  const userOptions = $derived<FilterOption[]>([{ value: 'me', label: 'Yo' }, ...people]);
  const priorityOptions: FilterOption[] = Object.entries(PRIORITY).map(([value, p]) => ({
    value,
    label: p.label,
  }));
  const sortOptions: FilterOption[] = Object.entries(SORTS).map(([value, label]) => ({
    value,
    label,
  }));

  function apply(patch: Partial<ReviewQuery>) {
    // eslint-disable-next-line svelte/no-navigation-without-resolve -- la ruta sale de resolve(); solo se agrega la query
    goto(`${resolve('/reviews')}${reviewQueryHref(query, patch)}`, {
      keepFocus: true,
      noScroll: true,
    });
  }

  function search(event: SubmitEvent) {
    event.preventDefault();
    apply({ q: q.trim() });
  }

  function clear() {
    q = '';
    const href = reviewQueryHref({ ...DEFAULT_QUERY, view: query.view, sort: query.sort }, {});
    // eslint-disable-next-line svelte/no-navigation-without-resolve -- la ruta sale de resolve(); solo se agrega la query
    goto(`${resolve('/reviews')}${href}`, {
      keepFocus: true,
      noScroll: true,
    });
  }
</script>

<div class="space-y-3">
  <div class="flex items-end justify-between gap-4 border-b">
    <nav class="-mb-px flex items-center gap-1" aria-label="Estado">
      {#each views as view (view.key)}
        {@const active = view.key === query.view}
        <a
          href="{resolve('/reviews')}{reviewQueryHref(query, { view: view.key })}"
          aria-current={active ? 'page' : undefined}
          class={cn(
            'flex items-center gap-1.5 border-b-2 border-transparent px-2.5 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
            active && 'border-primary text-foreground',
          )}
        >
          {view.label}
          {#if counts[view.key] !== undefined}
            <span class="rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums">
              {counts[view.key]}
            </span>
          {/if}
        </a>
      {/each}
    </nav>
    <div class="pb-1.5">
      <FilterSelect
        label="Orden"
        value={query.sort}
        options={sortOptions}
        onChange={(sort) => apply({ sort: isSort(sort) ? sort : 'updated' })}
      />
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-2">
    <form role="search" class="relative w-72" onsubmit={search}>
      <Search
        class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        name="q"
        type="search"
        bind:value={q}
        placeholder="Buscar por título, ID, tarjeta o PR"
        aria-label="Buscar revisiones"
        class="h-8 pl-8"
      />
    </form>
    <FilterSelect
      label="Asignada a"
      value={query.assignee}
      options={userOptions}
      anyLabel="Cualquiera"
      onChange={(assignee) => apply({ assignee })}
    />
    <FilterSelect
      label="Autor"
      value={query.author}
      options={userOptions}
      anyLabel="Cualquiera"
      onChange={(author) => apply({ author })}
    />
    <FilterSelect
      label="Prioridad"
      value={query.priority}
      options={priorityOptions}
      anyLabel="Todas"
      onChange={(p) => apply({ priority: isPriority(p) ? p : '' })}
    />
    <Button
      type="button"
      size="sm"
      variant={query.overdue ? 'secondary' : 'outline'}
      aria-pressed={query.overdue}
      onclick={() => apply({ overdue: !query.overdue })}
    >
      Solo vencidas
    </Button>
    {#if hasFilters(query)}
      <Button type="button" size="sm" variant="ghost" onclick={clear}>
        <X /> Limpiar filtros
      </Button>
    {/if}
  </div>
</div>
