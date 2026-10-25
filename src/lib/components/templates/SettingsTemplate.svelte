<script lang="ts">
  import type { Snippet } from 'svelte';

  import PageHeader from '$lib/components/molecules/PageHeader.svelte';
  import type { NavItem } from '$lib/components/molecules/nav';
  import { cn } from '$lib/utils/cn';

  interface Props {
    title: string;
    description?: string;
    nav: NavItem[];
    currentNav: string;
    actions?: Snippet;
    children: Snippet;
  }

  let { title, description, nav, currentNav, actions, children }: Props = $props();
</script>

<div class="flex h-full min-h-0 flex-col">
  <div class="shrink-0 px-6 pt-6 pb-4">
    <PageHeader {title} {description} {actions} />
  </div>
  <div class="flex min-h-0 flex-1 gap-6 px-6">
    <nav aria-label="Secciones" class="w-48 shrink-0 space-y-0.5">
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
    <div data-scroll class="min-w-0 flex-1 overflow-y-auto pb-6">
      <div class="max-w-3xl">{@render children()}</div>
    </div>
  </div>
</div>
