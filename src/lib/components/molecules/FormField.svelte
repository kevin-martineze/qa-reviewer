<script lang="ts">
  import type { Snippet } from 'svelte';

  import { Label } from '$lib/components/atoms/label';
  import { cn } from '$lib/utils/cn';

  interface Props {
    id: string;
    label: string;
    error?: string;
    hint?: string;
    /** Acción a la derecha del label, p. ej. «¿Olvidaste tu contraseña?». */
    aside?: Snippet;
    class?: string;
    /** Recibe los ids para `aria-describedby`. */
    children: Snippet<[{ describedBy: string | undefined; invalid: boolean }]>;
  }

  let { id, label, error, hint, aside, class: className, children }: Props = $props();

  const describedBy = $derived(
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') ||
      undefined,
  );
</script>

<div class={cn('space-y-1.5', className)}>
  <div class="flex items-center justify-between gap-2">
    <Label for={id}>{label}</Label>
    {#if aside}{@render aside()}{/if}
  </div>
  {@render children({ describedBy, invalid: Boolean(error) })}
  {#if hint && !error}
    <p id="{id}-hint" class="text-xs text-muted-foreground">{hint}</p>
  {/if}
  {#if error}
    <p id="{id}-error" class="text-xs text-danger">{error}</p>
  {/if}
</div>
