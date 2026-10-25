<script lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '$lib/components/atoms/table';

  interface Row {
    module: string;
    changes: number;
    screens: number;
  }

  interface Props {
    rows: Row[];
  }

  let { rows }: Props = $props();

  const max = $derived(Math.max(1, ...rows.map((r) => r.changes)));
</script>

<div class="overflow-hidden rounded-lg border">
  <Table class="min-w-lg">
    <TableHeader>
      <TableRow>
        <TableHead>Módulo</TableHead>
        <TableHead class="w-full">Ajustes pedidos</TableHead>
        <TableHead class="text-right">Pantallas</TableHead>
        <TableHead class="text-right">Ajustes por pantalla</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each rows as row (row.module)}
        <TableRow>
          <TableCell class="font-mono text-xs">{row.module}</TableCell>
          <TableCell>
            <span class="flex items-center gap-2">
              <span class="h-2 min-w-0 flex-1">
                {#if row.changes > 0}
                  <span
                    class="block h-full rounded-r-sm bg-viz-1"
                    style:width="{(row.changes / max) * 100}%"
                  ></span>
                {/if}
              </span>
              <span class="w-6 text-right text-xs tabular-nums">{row.changes}</span>
            </span>
          </TableCell>
          <TableCell class="text-right text-xs tabular-nums">{row.screens}</TableCell>
          <TableCell class="text-right text-xs tabular-nums">
            {row.screens ? (row.changes / row.screens).toFixed(2).replace('.', ',') : '—'}
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>
