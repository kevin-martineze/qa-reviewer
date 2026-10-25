<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    approved: number;
    changes: number;
    total: number;
    /** Muestra «3/7» al lado de la barra. */
    showCount?: boolean;
    class?: string;
  }

  let { approved, changes, total, showCount = true, class: className }: Props = $props();

  const pct = (n: number) => (total ? `${(n / total) * 100}%` : '0%');
  const label = $derived(
    `${approved} aprobadas, ${changes} con ajustes, ${total - approved - changes} pendientes de ${total}`,
  );
</script>

<div class={cn('flex items-center gap-2', className)}>
  <div class="flex h-1.5 w-16 overflow-hidden rounded-full bg-muted" role="img" aria-label={label}>
    <!-- Ancho calculado: única forma de pintar la proporción (CLAUDE.md §4.7). -->
    <span class="bg-success" style:width={pct(approved)}></span>
    <span class="bg-warning" style:width={pct(changes)}></span>
  </div>
  {#if showCount}
    <span class="text-xs text-muted-foreground tabular-nums">{approved + changes}/{total}</span>
  {/if}
</div>
