<script lang="ts">
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import ListTemplate from '$lib/components/templates/ListTemplate.svelte';
</script>

<ListTemplate title="Notificaciones" description="Avisos sobre revisiones, comentarios y entregas.">
  <EmptyState
    title="Llega en la fase 3"
    description="El historial completo de notificaciones se construye en la fase 3."
  />
</ListTemplate>
