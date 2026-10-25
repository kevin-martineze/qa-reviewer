<script lang="ts">
  import { PanelLeftClose, PanelLeftOpen } from '@lucide/svelte';
  import { untrack, type Snippet } from 'svelte';

  import { Button } from '$lib/components/atoms/button';
  import type { Crumb } from '$lib/components/molecules/nav';
  import { cn } from '$lib/utils/cn';

  interface Props {
    /** Recibe `true` cuando la barra está colapsada (solo íconos). */
    sidebar: Snippet<[boolean]>;
    topbar: Snippet;
    crumbs: Crumb[];
    collapsed?: boolean;
    onToggle?: (collapsed: boolean) => void;
    children: Snippet;
  }

  let { sidebar, topbar, crumbs, collapsed = false, onToggle, children }: Props = $props();

  // Estado local que parte de la preferencia guardada; el layout la persiste con onToggle.
  let isCollapsed = $state(untrack(() => collapsed));

  function toggle() {
    isCollapsed = !isCollapsed;
    onToggle?.(isCollapsed);
  }
</script>

<a
  href="#contenido"
  class="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
>
  Saltar al contenido
</a>

<div class="flex h-dvh min-h-0 bg-background text-foreground">
  <aside
    class={cn(
      'flex shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200',
      isCollapsed ? 'w-14' : 'w-60',
    )}
    aria-label="Navegación principal"
  >
    {@render sidebar(isCollapsed)}
  </aside>

  <div class="flex min-w-0 flex-1 flex-col">
    <header class="flex h-14 shrink-0 items-center gap-2 border-b px-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onclick={toggle}
        aria-label={isCollapsed ? 'Expandir la barra lateral' : 'Colapsar la barra lateral'}
        aria-expanded={!isCollapsed}
      >
        {#if isCollapsed}
          <PanelLeftOpen />
        {:else}
          <PanelLeftClose />
        {/if}
      </Button>
      <nav aria-label="Migas de pan" class="min-w-0 flex-1">
        <ol class="flex min-w-0 items-center gap-1.5 text-sm">
          {#each crumbs as crumb, i (i)}
            {#if i > 0}
              <li aria-hidden="true" class="text-muted-foreground/60">/</li>
            {/if}
            <li class="min-w-0 truncate">
              {#if crumb.href}
                <a
                  href={crumb.href}
                  class="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </a>
              {:else}
                <span class="font-medium text-foreground" aria-current="page">{crumb.label}</span>
              {/if}
            </li>
          {/each}
        </ol>
      </nav>
      <div class="flex shrink-0 items-center gap-1">{@render topbar()}</div>
    </header>

    <main id="contenido" tabindex="-1" class="min-h-0 flex-1 overflow-hidden outline-none">
      {@render children()}
    </main>
  </div>
</div>
