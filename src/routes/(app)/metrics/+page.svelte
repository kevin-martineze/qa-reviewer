<script lang="ts">
  import type { PageData } from './$types';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { navigating } from '$app/state';

  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import FilterSelect from '$lib/components/molecules/FilterSelect.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import StatTile from '$lib/components/molecules/StatTile.svelte';
  import DesignerLoad from '$lib/components/organisms/metrics/DesignerLoad.svelte';
  import ModuleChanges from '$lib/components/organisms/metrics/ModuleChanges.svelte';
  import WeeklyChart from '$lib/components/organisms/metrics/WeeklyChart.svelte';
  import DashboardTemplate from '$lib/components/templates/DashboardTemplate.svelte';
  import { isRange, metricsQueryHref, RANGES, type MetricsQuery } from '$lib/domain/metrics-query';
  import { formatHours, formatPercent } from '$lib/utils/chart';
  import { cn } from '$lib/utils/cn';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const o = $derived(data.overview);
  const now = $derived(new Date(data.now));
  const base = resolve('/metrics');
  const rangeOptions = RANGES.map((r) => ({ value: String(r), label: `Últimos ${r} días` }));
  // Al refiltrar, el tablero conserva el render anterior atenuado (sin skeleton).
  const loading = $derived(navigating.to?.route.id === '/(app)/metrics');

  function apply(patch: Partial<MetricsQuery>) {
    // eslint-disable-next-line svelte/no-navigation-without-resolve -- `base` sale de resolve(); solo se agrega la query
    goto(`${base}${metricsQueryHref(data.query, patch)}`, { keepFocus: true, noScroll: true });
  }
</script>

<DashboardTemplate
  title="Métricas"
  description="Cómo fluyen las revisiones de diseño. Todo se recalcula con los filtros."
>
  {#snippet filters()}
    <div class="flex flex-wrap gap-2">
      <FilterSelect
        label="Periodo"
        value={String(data.query.range)}
        options={rangeOptions}
        onChange={(v) => {
          const n = Number(v);
          if (isRange(n)) apply({ range: n });
        }}
      />
      {#if data.projectOptions.length > 1}
        <FilterSelect
          label="Proyecto"
          value={data.query.project}
          options={data.projectOptions}
          anyLabel="Todos"
          onChange={(project) => apply({ project })}
        />
      {/if}
    </div>
  {/snippet}

  {#snippet kpis()}
    <div
      class={cn(
        'grid grid-cols-2 gap-3 transition-opacity lg:grid-cols-3 xl:grid-cols-6',
        loading && 'opacity-60',
      )}
    >
      <StatTile label="Abiertas" value={String(o.open)} hint="Sin envío de diseño todavía" />
      <StatTile
        label="Vencidas"
        value={String(o.overdue)}
        hint="Pasaron el SLA del proyecto"
        alert={o.overdue > 0}
      />
      <StatTile
        label="Hasta el primer envío"
        value={formatHours(o.hoursToFirstReview)}
        hint="Mediana desde que se abre"
      />
      <StatTile
        label="Hasta la aprobación"
        value={formatHours(o.hoursToApproval)}
        hint="Mediana desde que se abre"
      />
      <StatTile
        label="Aprobadas en la 1.ª ronda"
        value={formatPercent(o.firstRoundApprovalRate)}
        hint="De las revisiones enviadas"
      />
      <StatTile
        label="Rondas por revisión"
        value={String(o.avgRounds).replace('.', ',')}
        hint="Promedio"
      />
    </div>
  {/snippet}

  <div class={cn('grid gap-6 transition-opacity xl:grid-cols-2', loading && 'opacity-60')}>
    <SettingsSection
      class="min-w-0"
      title="Revisiones por semana"
      description="Abiertas y aprobadas en las últimas 6 semanas."
    >
      <WeeklyChart weeks={o.weekly} {now} />
    </SettingsSection>

    <SettingsSection
      class="min-w-0"
      title="Pendientes por diseñador"
      description="Revisiones abiertas asignadas a cada persona."
    >
      {#if o.pendingByDesigner.length}
        <DesignerLoad rows={o.pendingByDesigner} people={data.people} />
      {:else}
        <EmptyState title="Nadie tiene pendientes" class="py-8" />
      {/if}
    </SettingsSection>

    <SettingsSection
      title="Ajustes por módulo"
      description="Pantallas con «Pedir ajuste» en todas las rondas. Señala dónde se repiten problemas."
      class="min-w-0 xl:col-span-2"
    >
      {#if o.changesByModule.length}
        <ModuleChanges rows={o.changesByModule} />
      {:else}
        <EmptyState title="Sin revisiones en el periodo" class="py-8" />
      {/if}
    </SettingsSection>
  </div>
</DashboardTemplate>
