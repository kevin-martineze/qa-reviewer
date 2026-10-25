<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import ErrorState from '$lib/components/organisms/ErrorState.svelte';
</script>

<!-- Dentro del shell: el sidebar sigue visible para que el usuario pueda irse a otro lado. -->
<svelte:head><title>Error {page.status} · QA Reviewer</title></svelte:head>

<ErrorState
  status={page.status}
  message={page.error?.message ?? 'Algo salió mal.'}
  code={page.error?.code}
  permission={page.error?.permission}
  errorId={page.error?.errorId}
  homeHref={resolve('/')}
/>
