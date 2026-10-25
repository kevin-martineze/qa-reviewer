<script lang="ts">
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import ListTemplate from '$lib/components/templates/ListTemplate.svelte';
</script>

<ListTemplate
  title="Bandeja"
  description="Revisiones asignadas a ti y actividad reciente del proyecto."
>
  <EmptyState
    title="Llega en la fase 3"
    description="La bandeja con las revisiones pendientes se construye en la fase 3."
  />
</ListTemplate>
