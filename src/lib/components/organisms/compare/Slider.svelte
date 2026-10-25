<script lang="ts">
  import type { CompareProps } from './types';

  let { beforeSrc, beforeLabel, afterLabel, after }: CompareProps = $props();

  /** % del ancho que muestra la referencia (izquierda). */
  let position = $state(50);
</script>

<div class="space-y-2">
  <div class="flex justify-between text-xs font-medium">
    <span class="text-muted-foreground">← {beforeLabel}</span>
    <span>{afterLabel} →</span>
  </div>
  <div class="relative overflow-hidden rounded-md border">
    {@render after()}
    <!-- La referencia va encima, recortada; no recibe clics para que los pins sigan funcionando. -->
    <img
      src={beforeSrc}
      alt={beforeLabel}
      class="pointer-events-none absolute inset-0 block h-auto w-full"
      style:clip-path="inset(0 {100 - position}% 0 0)"
    />
    <div
      class="pointer-events-none absolute inset-y-0 w-0.5 bg-primary shadow"
      style:left="{position}%"
      aria-hidden="true"
    ></div>
  </div>
  <input
    type="range"
    min="0"
    max="100"
    step="1"
    bind:value={position}
    class="w-full accent-primary"
    aria-label="Mover el corte entre {beforeLabel} y {afterLabel}"
  />
</div>
