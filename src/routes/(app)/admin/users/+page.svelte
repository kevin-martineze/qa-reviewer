<script lang="ts">
  import { Search, UserPlus } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import InvitationsList from '$lib/components/organisms/admin/InvitationsList.svelte';
  import InviteDialog from '$lib/components/organisms/admin/InviteDialog.svelte';
  import UsersTable from '$lib/components/organisms/admin/UsersTable.svelte';
  import { STATUS_FILTER_LABEL, STATUS_FILTERS, usersQueryHref } from '$lib/domain/user-filters';
  import { cn } from '$lib/utils/cn';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
  let inviteOpen = $state(false);

  const inviteErrors = $derived<Record<string, string>>(page.form?.inviteErrors ?? {});
  const inviteEmail = $derived<string>(page.form?.inviteEmail ?? '');

  // Un error del server reabre el diálogo con los mensajes por campo.
  $effect(() => {
    if (page.form?.inviteErrors) inviteOpen = true;
  });
</script>

<div class="space-y-6">
  <SettingsSection
    title="Personas"
    description="Quién entra a la organización y con qué rol. Los permisos por proyecto se dan en cada proyecto."
  >
    {#snippet actions()}
      <Button type="button" size="sm" onclick={() => (inviteOpen = true)}>
        <UserPlus /> Invitar
      </Button>
    {/snippet}

    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <nav aria-label="Estado" class="inline-flex rounded-md border p-0.5 text-sm">
        {#each STATUS_FILTERS as status (status)}
          <a
            href="{resolve('/admin/users')}{usersQueryHref(data.filters, status)}"
            aria-current={data.filters.status === status ? 'page' : undefined}
            class={cn(
              'rounded-sm px-2.5 py-1 text-muted-foreground hover:text-foreground',
              data.filters.status === status && 'bg-secondary font-medium text-foreground',
            )}
          >
            {STATUS_FILTER_LABEL[status]}
            <span class="text-xs tabular-nums">{data.counts[status]}</span>
          </a>
        {/each}
      </nav>
      <form method="get" role="search" class="relative w-64">
        {#if data.filters.status !== 'active'}
          <input type="hidden" name="status" value={data.filters.status} />
        {/if}
        <Search
          class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          name="q"
          type="search"
          value={data.filters.q}
          placeholder="Buscar por nombre o correo"
          aria-label="Buscar personas"
          class="h-8 pl-8"
        />
      </form>
    </div>

    {#if data.users.length}
      <UsersTable
        users={data.users}
        access={data.access}
        me={data.user.id}
        canManageOwners={data.canManageOwners}
        {now}
      />
    {:else}
      <EmptyState
        title="Nadie coincide"
        description={data.filters.q ? `No hay personas con «${data.filters.q}».` : undefined}
        class="py-10"
      />
    {/if}
  </SettingsSection>

  <SettingsSection
    title="Invitaciones"
    description="Pendientes, vencidas y revocadas. Las aceptadas pasan a la lista de personas."
  >
    {#if data.invitations.length}
      <InvitationsList invitations={data.invitations} people={data.people} {now} />
    {:else}
      <p class="text-sm text-muted-foreground">No hay invitaciones pendientes.</p>
    {/if}
  </SettingsSection>
</div>

<InviteDialog
  bind:open={inviteOpen}
  projects={data.projects}
  canManageOwners={data.canManageOwners}
  errors={inviteErrors}
  email={inviteEmail}
/>
