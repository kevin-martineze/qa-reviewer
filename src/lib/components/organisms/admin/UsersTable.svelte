<script lang="ts">
  import { MoreHorizontal, UserCheck, UserX } from '@lucide/svelte';

  import type { ProjectRole, User } from '$lib/api/types';
  import { buttonVariants } from '$lib/components/atoms/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '$lib/components/atoms/dropdown-menu';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '$lib/components/atoms/table';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/atoms/tooltip';
  import AutoSubmitSelect from '$lib/components/molecules/AutoSubmitSelect.svelte';
  import ConfirmDialog from '$lib/components/molecules/ConfirmDialog.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { ORG_ROLE, PROJECT_ROLE } from '$lib/domain/labels';
  import { ORG_ROLES } from '$lib/schemas/roles';
  import { formatRelative } from '$lib/utils/dates';

  interface Props {
    users: User[];
    access: Record<string, Array<{ project: string; role: ProjectRole }>>;
    me: string;
    canManageOwners: boolean;
    now: Date;
  }

  let { users, access, me, canManageOwners, now }: Props = $props();

  let target = $state<User | null>(null);
  let confirmOpen = $state(false);

  function ask(user: User) {
    target = user;
    confirmOpen = true;
  }

  const roleOptions = $derived(
    ORG_ROLES.filter((r) => canManageOwners || r !== 'owner').map((r) => ({
      value: r,
      label: ORG_ROLE[r].label,
    })),
  );

  const deactivating = $derived(target?.status === 'active');
</script>

<div class="overflow-hidden rounded-lg border">
  <Table class="min-w-2xl">
    <TableHeader>
      <TableRow>
        <TableHead class="w-full">Persona</TableHead>
        <TableHead>Rol en la organización</TableHead>
        <TableHead>Proyectos</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead class="text-right">Última actividad</TableHead>
        <TableHead><span class="sr-only">Acciones</span></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each users as user (user.id)}
        {@const isMe = user.id === me}
        {@const protectedOwner = user.orgRole === 'owner' && !canManageOwners}
        {@const projects = access[user.id] ?? []}
        <TableRow>
          <TableCell class="max-w-0">
            <div class="flex min-w-0 items-center gap-2.5">
              <UserAvatar name={user.name} />
              <div class="min-w-0">
                <p class="truncate font-medium">
                  {user.name}
                  {#if isMe}<span class="text-xs font-normal text-muted-foreground">(tú)</span>{/if}
                </p>
                <p class="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            {#if isMe || protectedOwner || user.status === 'inactive'}
              <span class="text-sm">{ORG_ROLE[user.orgRole].label}</span>
            {:else}
              <AutoSubmitSelect
                action="?/role"
                name="role"
                value={user.orgRole}
                options={roleOptions}
                label="Rol de {user.name}"
                hidden={{ userId: user.id }}
                class="w-36"
              />
            {/if}
          </TableCell>
          <TableCell>
            {#if projects.length}
              <Tooltip>
                <TooltipTrigger class="text-sm underline decoration-dotted underline-offset-4">
                  {projects.length}
                  {projects.length === 1 ? 'proyecto' : 'proyectos'}
                </TooltipTrigger>
                <TooltipContent>
                  <ul class="space-y-0.5">
                    {#each projects as p (p.project)}
                      <li>{p.project} · {PROJECT_ROLE[p.role].label}</li>
                    {/each}
                  </ul>
                </TooltipContent>
              </Tooltip>
            {:else}
              <span class="text-xs text-muted-foreground">
                {user.orgRole === 'member' ? 'Sin proyectos' : 'Todos'}
              </span>
            {/if}
          </TableCell>
          <TableCell>
            {#if user.status === 'active'}
              <ToneBadge tone="success">Activo</ToneBadge>
            {:else}
              <ToneBadge tone="muted">Desactivado</ToneBadge>
            {/if}
          </TableCell>
          <TableCell class="text-right text-xs whitespace-nowrap text-muted-foreground">
            {user.lastSeenAt ? formatRelative(user.lastSeenAt, now) : 'Nunca'}
          </TableCell>
          <TableCell class="text-right">
            {#if !isMe && user.orgRole !== 'owner'}
              <DropdownMenu>
                <DropdownMenuTrigger
                  class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
                  aria-label="Acciones para {user.name}"
                >
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {#if user.status === 'active'}
                    <DropdownMenuItem variant="destructive" onSelect={() => ask(user)}>
                      <UserX /> Desactivar
                    </DropdownMenuItem>
                  {:else}
                    <DropdownMenuItem onSelect={() => ask(user)}>
                      <UserCheck /> Reactivar
                    </DropdownMenuItem>
                  {/if}
                </DropdownMenuContent>
              </DropdownMenu>
            {/if}
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>

<ConfirmDialog
  bind:open={confirmOpen}
  action="?/status"
  title={deactivating ? `Desactivar a ${target?.name}` : `Reactivar a ${target?.name}`}
  description={deactivating
    ? 'No podrá entrar ni usar la skill: sus tokens se revocan. Sus comentarios y veredictos se conservan.'
    : 'Podrá volver a entrar con su correo y contraseña. Los tokens revocados no vuelven.'}
  confirmLabel={deactivating ? 'Desactivar' : 'Reactivar'}
  destructive={deactivating}
>
  {#snippet fields()}
    <input type="hidden" name="userId" value={target?.id ?? ''} />
    <input type="hidden" name="status" value={deactivating ? 'inactive' : 'active'} />
  {/snippet}
</ConfirmDialog>
