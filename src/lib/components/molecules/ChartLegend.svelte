<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    items: Array<{ label: string; swatch: string }>;
    class?: string;
  }

  let { items, class: className }: Props = $props();
</script>

<ul class={cn('flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground', className)}>
  {#each items as item (item.label)}
    <li class="inline-flex items-center gap-1.5">
      <span class={cn('size-2.5 rounded-xs', item.swatch)} aria-hidden="true"></span>
      {item.label}
    </li>
  {/each}
</ul>
