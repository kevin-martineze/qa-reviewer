<script lang="ts">
  import { PanelLeft } from '@lucide/svelte';
  import { untrack, type Snippet } from 'svelte';

  import type { Crumb } from '$lib/components/molecules/nav';

  interface Props {
    children: Snippet;
    sidebar: Snippet;
    topbar: Snippet;
    crumbs: Crumb[];
    collapsed?: boolean;
  }

  let { children, sidebar, topbar, crumbs, collapsed = false }: Props = $props();

  let open = $state(untrack(() => !collapsed));

  function toggle() {
    open = !open;
    if (open) {
      document.cookie = 'sidebar_collapsed=; Max-Age=0; Path=/';
    } else {
      document.cookie = 'sidebar_collapsed=1; Path=/';
    }
  }
</script>

<div class="flex h-full min-h-0">
  {#if open}
    <aside class="flex w-64 shrink-0 flex-col border-r bg-muted/40">
      {@render sidebar()}
    </aside>
  {/if}
  <div class="flex min-w-0 flex-1 flex-col">
    <header class="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <button
        type="button"
        class="text-muted-foreground transition-colors hover:text-foreground"
        onclick={toggle}
        aria-label="Alternar barra lateral"
      >
        <PanelLeft class="size-4" />
      </button>
      <nav aria-label="Migas de pan" class="flex items-center gap-1.5 text-sm">
        {#each crumbs as crumb, i (crumb.href ?? crumb.label)}
          {#if i > 0}
            <span class="text-muted-foreground/60">/</span>
          {/if}
          {#if crumb.href}
            <a
              href={crumb.href}
              class="text-muted-foreground transition-colors hover:text-foreground"
            >
              {crumb.label}
            </a>
          {:else}
            <span class="font-medium text-foreground">{crumb.label}</span>
          {/if}
        {/each}
      </nav>
      <div class="ml-auto flex items-center gap-2">{@render topbar()}</div>
    </header>
    <main data-scroll class="min-h-0 flex-1 overflow-y-auto">
      {@render children()}
    </main>
  </div>
</div>
