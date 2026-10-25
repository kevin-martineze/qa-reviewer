<script lang="ts">
  import { page } from '$app/state';

  import ErrorState from '$lib/components/organisms/ErrorState.svelte';
</script>

<ErrorState
  message={page.error?.message ?? 'Algo salió mal.'}
  code={page.error?.code}
  permission={page.error?.permission}
  errorId={page.error?.errorId}
  homeRoute="/"
/>
