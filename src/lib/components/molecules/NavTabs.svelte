<script lang="ts">
  import { cn } from '$lib/utils/cn';

  import type { NavItem } from './nav';

  interface Props {
    items: NavItem[];
    current: string;
    class?: string;
  }

  let { items, current, class: className }: Props = $props();
</script>

<nav class={cn('flex items-center gap-4 border-b', className)}>
  {#each items as item (item.key)}
    <a
      href={item.href}
      class={cn(
        'relative -mb-px border-b-2 border-transparent px-1 pb-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
        item.key === current && 'border-primary text-foreground',
      )}
      aria-current={item.key === current ? 'page' : undefined}
    >
      {item.label}
    </a>
  {/each}
</nav>
