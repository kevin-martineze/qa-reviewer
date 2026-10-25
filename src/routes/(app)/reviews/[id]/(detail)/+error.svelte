<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import ErrorState from '$lib/components/organisms/ErrorState.svelte';
</script>

<!-- Error de una pestaña: la cabecera de la revisión y las pestañas siguen visibles. -->
<ErrorState
  status={page.status}
  message={page.error?.message ?? 'No se pudo cargar esta pestaña.'}
  code={page.error?.code}
  permission={page.error?.permission}
  errorId={page.error?.errorId}
  homeHref={resolve('/reviews')}
  homeLabel="Ver revisiones"
/>
