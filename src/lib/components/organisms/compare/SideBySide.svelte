<script lang="ts">
  import type { CompareProps } from './types';

  let { beforeSrc, beforeLabel, afterLabel, after }: CompareProps = $props();
</script>

<div class="grid grid-cols-2 gap-4">
  <figure class="space-y-1.5">
    <figcaption class="text-xs font-medium text-muted-foreground">{beforeLabel}</figcaption>
    <img src={beforeSrc} alt={beforeLabel} class="block h-auto w-full rounded-md border" />
  </figure>
  <figure class="space-y-1.5">
    <figcaption class="text-xs font-medium text-foreground">{afterLabel}</figcaption>
    <div class="overflow-hidden rounded-md border">{@render after()}</div>
  </figure>
</div>
