<script lang="ts">
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import ListTemplate from '$lib/components/templates/ListTemplate.svelte';
</script>

<ListTemplate
  title="Revisiones"
  description="Todas las revisiones del proyecto, con filtros en la URL."
>
  <EmptyState
    title="Llega en la fase 3"
    description="El listado de revisiones con filtros y paginación se construye en la fase 3."
  />
</ListTemplate>
