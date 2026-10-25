<script lang="ts">
  import type { Snippet } from 'svelte';

  import PageHeader from '$lib/components/molecules/PageHeader.svelte';
  import type { NavItem } from '$lib/components/molecules/nav';
  import { cn } from '$lib/utils/cn';

  interface Props {
    title: string;
    nav: NavItem[];
    currentNav: string;
    actions?: Snippet;
    children: Snippet;
  }

  let { title, nav, currentNav, actions, children }: Props = $props();
</script>

<div class="flex h-full min-h-0 flex-col gap-4">
  <div class="shrink-0">
    <PageHeader {title} {actions} />
  </div>
  <div class="flex min-h-0 flex-1">
    <nav class="w-52 shrink-0 space-y-1 pr-4">
      {#each nav as item (item.key)}
        <a
          href={item.href}
          class={cn(
            'block rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
            item.key === currentNav
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
          )}
          aria-current={item.key === currentNav ? 'page' : undefined}
        >
          {item.label}
        </a>
      {/each}
    </nav>
    <main data-scroll class="min-w-0 flex-1 overflow-y-auto">
      {@render children()}
    </main>
  </div>
</div>
