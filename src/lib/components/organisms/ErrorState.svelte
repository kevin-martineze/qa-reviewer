<script lang="ts">
  import { Check, Copy } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  import { buttonVariants } from '$lib/components/atoms/button';
  import Illustration from '$lib/components/molecules/Illustration.svelte';
  import { permissionLabel } from '$lib/domain/permissions';
  import { cn } from '$lib/utils/cn';

  interface Props {
    status: number;
    message: string;
    code?: string;
    permission?: string;
    errorId?: string;
    /** A dónde lleva el botón principal. */
    homeHref: string;
    homeLabel?: string;
    /** Acciones extra (p. ej. «Ver mis revisiones»). */
    actions?: Snippet;
    class?: string;
  }

  let {
    status,
    message,
    code,
    permission,
    errorId,
    homeHref,
    homeLabel = 'Ir a la bandeja',
    actions,
    class: className,
  }: Props = $props();

  const kind = $derived(
    code === 'forbidden' || status === 403
      ? 'forbidden'
      : code === 'not_found' || status === 404
        ? 'not_found'
        : code === 'gone' || status === 410
          ? 'gone'
          : code === 'unavailable' || status === 503
            ? 'unavailable'
            : 'error',
  );

  const COPY = {
    forbidden: { title: 'No tienes acceso', illustration: 'error-403' },
    not_found: { title: 'No encontramos esto', illustration: 'error-404' },
    gone: { title: 'Ya no está disponible', illustration: 'link-expired' },
    unavailable: { title: 'Servicio no disponible', illustration: 'error-500' },
    error: { title: 'Algo salió mal', illustration: 'error-500' },
  } as const;

  const hint = $derived.by(() => {
    if (kind === 'forbidden') {
      return permission
        ? `Necesitas el permiso «${permissionLabel(permission)}». Pídelo al admin del proyecto.`
        : 'Pide acceso al admin del proyecto.';
    }
    if (kind === 'not_found')
      return 'Puede que el enlace esté mal o que la revisión se haya borrado.';
    if (kind === 'unavailable') return 'Intenta de nuevo en unos minutos.';
    if (kind === 'error') return 'Si vuelve a pasar, comparte la referencia con soporte.';
    return undefined;
  });

  let copied = $state(false);

  async function copyId() {
    if (!errorId) return;
    try {
      await navigator.clipboard.writeText(errorId);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      copied = false;
    }
  }
</script>

<div
  class={cn(
    'flex h-full w-full flex-1 flex-col items-center justify-center gap-3 p-8 text-center',
    className,
  )}
>
  <Illustration name={COPY[kind].illustration} class="mb-1 w-48" />
  <p class="text-xs font-medium text-muted-foreground tabular-nums">Error {status}</p>
  <h1 class="text-lg font-semibold">{COPY[kind].title}</h1>
  <p class="max-w-md text-sm text-muted-foreground">{message}</p>
  {#if hint}
    <p class="max-w-md text-sm text-muted-foreground">{hint}</p>
  {/if}

  {#if errorId}
    <button
      type="button"
      onclick={copyId}
      class="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs text-muted-foreground hover:text-foreground"
      aria-label="Copiar referencia del error"
    >
      Ref {errorId}
      {#if copied}<Check class="size-3.5 text-success" />{:else}<Copy class="size-3.5" />{/if}
    </button>
  {/if}

  <div class="mt-2 flex flex-wrap justify-center gap-2">
    {#if kind === 'error' || kind === 'unavailable'}
      <button
        type="button"
        class={buttonVariants({ variant: 'outline' })}
        onclick={() => location.reload()}
      >
        Reintentar
      </button>
    {/if}
    {@render actions?.()}
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- homeHref ya viene resuelto -->
    <a href={homeHref} class={buttonVariants({ variant: 'default' })}>{homeLabel}</a>
  </div>
</div>
