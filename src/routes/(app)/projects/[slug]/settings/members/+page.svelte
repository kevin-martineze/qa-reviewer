<script lang="ts">
  import { UserPlus } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import AddMemberDialog from '$lib/components/organisms/project/AddMemberDialog.svelte';
  import MembersTable from '$lib/components/organisms/project/MembersTable.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let addOpen = $state(false);
  const addErrors = $derived<Record<string, string>>(page.form?.addErrors ?? {});

  // Un error de validación del server reabre el diálogo con los mensajes.
  $effect(() => {
    if (page.form?.addErrors) addOpen = true;
  });
</script>

<SettingsSection
  title="Miembros"
  description="Quién ve las revisiones de {data.project
    .name} y qué puede hacer. Owner y admin entran sin ser miembros."
>
  {#snippet actions()}
    {#if data.canManage}
      <Button
        type="button"
        size="sm"
        disabled={!data.candidates.length}
        onclick={() => (addOpen = true)}
      >
        <UserPlus /> Agregar
      </Button>
    {/if}
  {/snippet}
  <MembersTable
    members={data.members}
    me={data.user.id}
    projectName={data.project.name}
    canManage={data.canManage}
  />
</SettingsSection>

<AddMemberDialog
  bind:open={addOpen}
  projectName={data.project.name}
  candidates={data.candidates}
  errors={addErrors}
/>
