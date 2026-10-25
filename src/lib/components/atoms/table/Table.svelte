<script lang="ts">
  import type { HTMLTableAttributes } from 'svelte/elements';

  import { cn, type WithElementRef } from '$lib/utils/cn';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLTableAttributes> = $props();
</script>

<!--
  Override de marca: el contenedor que scrollea es este, así que la sombra
  `scroll-x-hint` (CLAUDE.md regla 35) va aquí y no en un div externo.
-->
<div data-slot="table-container" class="scroll-x-hint relative w-full overflow-x-auto">
  <table
    bind:this={ref}
    data-slot="table"
    class={cn('w-full caption-bottom text-sm', className)}
    {...restProps}
  >
    {@render children?.()}
  </table>
</div>
