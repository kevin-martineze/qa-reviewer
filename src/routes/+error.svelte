<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import ErrorState from '$lib/components/organisms/ErrorState.svelte';
</script>

<svelte:head><title>Error {page.status} · QA Reviewer</title></svelte:head>

<!-- Fuera de cualquier shell: rutas inexistentes o errores antes del layout. -->
<main class="flex h-dvh bg-muted/40">
  <ErrorState
    status={page.status}
    message={page.error?.message ?? 'Algo salió mal.'}
    code={page.error?.code}
    permission={page.error?.permission}
    errorId={page.error?.errorId}
    homeHref={resolve('/')}
    homeLabel="Ir al inicio"
  />
</main>
