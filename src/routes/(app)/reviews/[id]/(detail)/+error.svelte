<script lang="ts">
  import { page } from '$app/state';

  import ErrorState from '$lib/components/organisms/ErrorState.svelte';
</script>

<ErrorState
  message={page.error?.message ?? 'No se pudo cargar esta vista.'}
  code={page.error?.code}
  permission={page.error?.permission}
  errorId={page.error?.errorId}
  homeRoute="/reviews"
/>
