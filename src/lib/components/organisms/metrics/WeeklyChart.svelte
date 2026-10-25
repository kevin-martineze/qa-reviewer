<script lang="ts">
  import ChartLegend from '$lib/components/molecules/ChartLegend.svelte';
  import { columnPath, niceTicks } from '$lib/utils/chart';
  import { cn } from '$lib/utils/cn';
  import { formatShortDate } from '$lib/utils/dates';

  interface Week {
    week: string;
    opened: number;
    approved: number;
  }

  interface Props {
    weeks: Week[];
    now: Date;
  }

  let { weeks, now }: Props = $props();

  const SERIES = [
    { key: 'opened', label: 'Abiertas', fill: 'fill-viz-1', swatch: 'bg-viz-1', line: 'bg-viz-1' },
    {
      key: 'approved',
      label: 'Aprobadas',
      fill: 'fill-viz-2',
      swatch: 'bg-viz-2',
      line: 'bg-viz-2',
    },
  ] as const;

  const PLOT_H = 180;
  const AXIS_H = 24;
  const LEFT = 28;
  const BAR_MAX = 24;
  const GAP = 2;

  let width = $state(640);
  let active = $state<number | null>(null);

  const ticks = $derived(niceTicks(Math.max(1, ...weeks.flatMap((w) => [w.opened, w.approved]))));
  const top = $derived(ticks[ticks.length - 1] ?? 1);
  const plotW = $derived(Math.max(0, width - LEFT));
  const band = $derived(weeks.length ? plotW / weeks.length : 0);
  const barW = $derived(Math.min(BAR_MAX, Math.max(6, band * 0.28)));
  const y = (v: number) => PLOT_H - (v / top) * PLOT_H;
  const activeWeek = $derived(active === null ? undefined : weeks[active]);
  const label = (w: Week) => `Semana al ${formatShortDate(w.week, now)}`;

  function value(w: Week, key: 'opened' | 'approved') {
    return key === 'opened' ? w.opened : w.approved;
  }
</script>

<div class="space-y-3">
  <ChartLegend items={SERIES.map((s) => ({ label: s.label, swatch: s.swatch }))} />

  <div class="relative" bind:clientWidth={width}>
    <svg
      {width}
      height={PLOT_H + AXIS_H}
      role="img"
      aria-label="Revisiones abiertas y aprobadas por semana"
      class="block overflow-visible"
    >
      {#each ticks as t (t)}
        <line x1={LEFT} x2={width} y1={y(t)} y2={y(t)} class="stroke-border" stroke-width="1" />
        <text
          x={LEFT - 6}
          y={y(t)}
          dy="0.32em"
          text-anchor="end"
          class="fill-muted-foreground text-2xs tabular-nums"
        >
          {t}
        </text>
      {/each}

      {#each weeks as w, i (w.week)}
        {@const x0 = LEFT + i * band}
        {@const groupW = barW * 2 + GAP}
        {@const start = x0 + (band - groupW) / 2}
        {@const last = i === weeks.length - 1}
        <!-- El área de toda la semana es el blanco del hover: más grande que la marca. -->
        <g
          role="button"
          tabindex="0"
          aria-label="{label(w)}: {w.opened} abiertas, {w.approved} aprobadas"
          class="outline-none"
          onpointerenter={() => (active = i)}
          onpointerleave={() => (active = null)}
          onfocus={() => (active = i)}
          onblur={() => (active = null)}
        >
          <rect
            x={x0}
            y={0}
            width={band}
            height={PLOT_H}
            class={cn(active === i ? 'fill-muted' : 'fill-transparent')}
          />
          {#each SERIES as s, j (s.key)}
            {@const v = value(w, s.key)}
            {@const bx = start + j * (barW + GAP)}
            <path d={columnPath(bx, y(v), barW, PLOT_H - y(v))} class={s.fill} />
            {#if last && v > 0}
              <text
                x={bx + barW / 2}
                y={y(v) - 4}
                text-anchor="middle"
                class="fill-foreground text-2xs font-medium"
              >
                {v}
              </text>
            {/if}
          {/each}
          <text
            x={x0 + band / 2}
            y={PLOT_H + 16}
            text-anchor="middle"
            class="fill-muted-foreground text-2xs"
          >
            {formatShortDate(w.week, now)}
          </text>
        </g>
      {/each}
      <line
        x1={LEFT}
        x2={width}
        y1={PLOT_H}
        y2={PLOT_H}
        class="stroke-muted-foreground/40"
        stroke-width="1"
      />
    </svg>

    {#if active !== null && activeWeek}
      {@const w = activeWeek}
      <div
        class="pointer-events-none absolute top-0 z-10 w-40 -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-xs shadow-md"
        style:left="{Math.min(Math.max(LEFT + active * band + band / 2, 80), width - 80)}px"
        role="status"
      >
        <p class="mb-1 text-muted-foreground">{label(w)}</p>
        {#each SERIES as s (s.key)}
          <p class="flex items-center gap-2">
            <span class={cn('h-0.5 w-3 rounded-full', s.line)} aria-hidden="true"></span>
            <strong class="font-semibold tabular-nums">{value(w, s.key)}</strong>
            <span class="text-muted-foreground">{s.label.toLowerCase()}</span>
          </p>
        {/each}
      </div>
    {/if}
  </div>

  <details class="text-sm">
    <summary class="cursor-pointer text-xs text-muted-foreground">Ver como tabla</summary>
    <table class="mt-2 w-full text-xs">
      <thead>
        <tr class="text-left text-muted-foreground">
          <th class="py-1 font-medium">Semana</th>
          <th class="py-1 text-right font-medium">Abiertas</th>
          <th class="py-1 text-right font-medium">Aprobadas</th>
        </tr>
      </thead>
      <tbody>
        {#each weeks as w (w.week)}
          <tr class="border-t">
            <td class="py-1">{label(w)}</td>
            <td class="py-1 text-right tabular-nums">{w.opened}</td>
            <td class="py-1 text-right tabular-nums">{w.approved}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </details>
</div>
