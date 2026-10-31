<script lang="ts">
  import { FolderPlus } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import NewProjectDialog from '$lib/components/organisms/admin/NewProjectDialog.svelte';
  import ProjectsTable from '$lib/components/organisms/admin/ProjectsTable.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const errors = $derived<Record<string, string>>(page.form?.projectErrors ?? {});
  const values = $derived({
    name: page.form?.projectValues?.name ?? '',
    id: page.form?.projectValues?.id ?? '',
    repo: page.form?.projectValues?.repo ?? '',
    planeKey: page.form?.projectValues?.planeKey ?? '',
  });

  let createOpen = $state(false);

  // Un error del server reabre el diálogo con los mensajes por campo.
  $effect(() => {
    if (page.form?.projectErrors) createOpen = true;
  });
</script>

<SettingsSection
  title="Proyectos"
  description="Cada proyecto tiene sus miembros, plazo, reglas de asignación e integraciones. Admin y owner ven todos."
>
  {#snippet actions()}
    <Button type="button" size="sm" onclick={() => (createOpen = true)}>
      <FolderPlus /> Nuevo proyecto
    </Button>
  {/snippet}

  {#if data.projects.length}
    <ProjectsTable projects={data.projects} />
  {:else}
    <EmptyState
      title="Todavía no hay proyectos"
      description="Crea el primero para empezar a recibir revisiones de la skill."
      class="py-10"
    />
  {/if}
</SettingsSection>

<NewProjectDialog bind:open={createOpen} {errors} {values} />
