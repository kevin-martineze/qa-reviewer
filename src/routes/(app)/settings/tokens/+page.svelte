<script lang="ts">
  import { KeyRound, Plus } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import CreateTokenDialog from '$lib/components/organisms/account/CreateTokenDialog.svelte';
  import TokenSecretDialog from '$lib/components/organisms/account/TokenSecretDialog.svelte';
  import TokensTable from '$lib/components/organisms/account/TokensTable.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
  const canCreate = $derived(data.tokenProjects.length > 0);

  let createOpen = $state(false);
  let secretOpen = $state(false);

  const created = $derived(page.form?.created ?? null);
  const tokenErrors = $derived<Record<string, string>>(page.form?.tokenErrors ?? {});

  // Respuesta del server: el secreto se muestra una vez; un error de validación reabre el form.
  $effect(() => {
    if (page.form?.created) secretOpen = true;
    if (page.form?.tokenErrors) createOpen = true;
  });
</script>

<SettingsSection
  title="Tokens de la skill"
  description="La skill /design-review los usa para publicar revisiones y rondas a tu nombre."
>
  {#snippet actions()}
    {#if canCreate}
      <Button type="button" size="sm" onclick={() => (createOpen = true)}>
        <Plus /> Crear token
      </Button>
    {/if}
  {/snippet}

  {#if !canCreate}
    <Notice tone="info">
      Solo desarrolladores y admins de proyecto publican con la skill. Pide ese rol en el proyecto
      si lo necesitas.
    </Notice>
  {/if}

  {#if data.tokens.length}
    <TokensTable tokens={data.tokens} projectNames={data.projectNames} {now} />
  {:else if canCreate}
    <EmptyState
      title="Sin tokens"
      description="Crea uno para conectar la skill desde tu equipo."
      class="py-10"
    >
      {#snippet action()}
        <Button type="button" size="sm" variant="outline" onclick={() => (createOpen = true)}>
          <KeyRound /> Crear el primero
        </Button>
      {/snippet}
    </EmptyState>
  {/if}
</SettingsSection>

<CreateTokenDialog
  bind:open={createOpen}
  projects={data.tokenProjects}
  errors={tokenErrors}
  label={page.form?.label ?? ''}
/>

{#if created}
  <TokenSecretDialog bind:open={secretOpen} label={created.label} secret={created.secret} />
{/if}
