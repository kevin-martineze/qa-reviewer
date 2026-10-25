<script lang="ts">
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import DashboardTemplate from '$lib/components/templates/DashboardTemplate.svelte';
</script>

<DashboardTemplate title="Métricas" description="Rendimiento del equipo de revisión.">
  <EmptyState
    title="Llega en la fase 3"
    description="Los KPIs y gráficas de métricas se construyen en la fase 3."
  />
</DashboardTemplate>
