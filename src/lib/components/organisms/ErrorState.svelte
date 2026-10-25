<script lang="ts">
  import { ArchiveX, FileQuestion, ShieldX, TriangleAlert } from '@lucide/svelte';

  import { resolve } from '$app/paths';
  import { buttonVariants } from '$lib/components/atoms/button';
  import { permissionLabel } from '$lib/domain/permissions';
  import { cn } from '$lib/utils/cn';

  interface Props {
    message: string;
    code?: string;
    permission?: string;
    errorId?: string;
    homeRoute?: '/' | '/reviews';
  }

  let { message, code, permission, errorId, homeRoute = '/' }: Props = $props();

  const title = $derived(
    code === 'forbidden'
      ? 'Sin permiso'
      : code === 'not_found'
        ? 'No encontrado'
        : code === 'gone'
          ? 'Ya no está disponible'
          : 'Algo salió mal',
  );

  const hint = $derived(
    code === 'forbidden' && permission ? `Necesitas ${permissionLabel(permission)}.` : undefined,
  );
</script>

<div class="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
  {#if code === 'forbidden'}
    <ShieldX class="size-8 text-muted-foreground" />
  {:else if code === 'not_found'}
    <FileQuestion class="size-8 text-muted-foreground" />
  {:else if code === 'gone'}
    <ArchiveX class="size-8 text-muted-foreground" />
  {:else}
    <TriangleAlert class="size-8 text-muted-foreground" />
  {/if}

  <h1 class="text-lg font-semibold">{title}</h1>
  <p class="max-w-sm text-sm text-muted-foreground">{message}</p>
  {#if hint}
    <p class="max-w-sm text-sm text-muted-foreground">{hint}</p>
  {/if}
  {#if errorId}
    <p class="text-xs text-muted-foreground">Ref: {errorId}</p>
  {/if}

  <a href={resolve(homeRoute)} class={cn(buttonVariants({ variant: 'outline' }), 'mt-2')}>
    Volver al inicio
  </a>
</div>
