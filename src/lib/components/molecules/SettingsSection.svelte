<script lang="ts">
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils/cn';

  interface Props {
    title: string;
    description?: string;
    /** Acción a la derecha del título (p. ej. «Invitar»). */
    actions?: Snippet;
    /** Barra inferior, normalmente el botón Guardar. */
    footer?: Snippet;
    class?: string;
    children: Snippet;
  }

  let { title, description, actions, footer, class: className, children }: Props = $props();

  const id = $props.id();
</script>

<section aria-labelledby="{id}-title" class={cn('rounded-lg border bg-card', className)}>
  <header class="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3">
    <div class="min-w-0">
      <h2 id="{id}-title" class="text-sm font-semibold">{title}</h2>
      {#if description}
        <p class="text-sm text-muted-foreground">{description}</p>
      {/if}
    </div>
    {#if actions}
      <div class="flex shrink-0 items-center gap-2">{@render actions()}</div>
    {/if}
  </header>
  <div class="p-4">{@render children()}</div>
  {#if footer}
    <footer class="flex items-center justify-end gap-2 border-t bg-muted/40 px-4 py-2.5">
      {@render footer()}
    </footer>
  {/if}
</section>
