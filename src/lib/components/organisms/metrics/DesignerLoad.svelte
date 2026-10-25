<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/atoms/tooltip';
  import ChartLegend from '$lib/components/molecules/ChartLegend.svelte';
  import { nameOf, type People } from '$lib/domain/people';
  import { cn } from '$lib/utils/cn';

  interface Row {
    userId: string;
    pending: number;
    overdue: number;
  }

  interface Props {
    rows: Row[];
    people: People;
  }

  let { rows, people }: Props = $props();

  const sorted = $derived([...rows].sort((a, b) => b.pending - a.pending || b.overdue - a.overdue));
  const max = $derived(Math.max(1, ...rows.map((r) => r.pending)));
  const pct = (n: number) => `${(n / max) * 100}%`;
</script>

<div class="space-y-3">
  <ChartLegend
    items={[
      { label: 'A tiempo', swatch: 'bg-viz-1' },
      { label: 'Vencidas', swatch: 'bg-viz-critical' },
    ]}
  />
  <ul class="space-y-1">
    {#each sorted as row (row.userId)}
      {@const onTime = row.pending - row.overdue}
      {@const name = nameOf(people, row.userId)}
      <li>
        <Tooltip>
          <TooltipTrigger
            class="grid w-full grid-cols-[9rem_1fr] items-center gap-3 rounded-md px-1 py-1.5 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
            aria-label="{name}: {row.pending} pendientes, {row.overdue} vencidas"
          >
            <span class="truncate text-sm">{name}</span>
            <span class="flex items-center gap-2">
              <span class="flex h-4 min-w-0 flex-1 items-stretch gap-0.5">
                {#if onTime > 0}
                  <span
                    class={cn('bg-viz-1', row.overdue === 0 ? 'rounded-r-sm' : '')}
                    style:width={pct(onTime)}
                  ></span>
                {/if}
                {#if row.overdue > 0}
                  <span class="rounded-r-sm bg-viz-critical" style:width={pct(row.overdue)}></span>
                {/if}
              </span>
              <span class="w-16 shrink-0 text-xs text-muted-foreground tabular-nums">
                {row.pending}{#if row.overdue}<span class="text-danger">
                    · {row.overdue} venc.</span
                  >{/if}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p class="font-medium">{name}</p>
            <p><strong class="tabular-nums">{onTime}</strong> a tiempo</p>
            <p><strong class="tabular-nums">{row.overdue}</strong> vencidas</p>
          </TooltipContent>
        </Tooltip>
      </li>
    {/each}
  </ul>
</div>
