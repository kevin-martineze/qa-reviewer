<script lang="ts">
  import { UserMinus } from '@lucide/svelte';

  import type { ProjectRole, User } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '$lib/components/atoms/table';
  import AutoSubmitSelect from '$lib/components/molecules/AutoSubmitSelect.svelte';
  import ConfirmDialog from '$lib/components/molecules/ConfirmDialog.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { PROJECT_ROLE } from '$lib/domain/labels';
  import { PROJECT_ROLES } from '$lib/schemas/roles';

  interface Props {
    members: Array<{ user: User; role: ProjectRole }>;
    me: string;
    projectName: string;
    canManage: boolean;
  }

  let { members, me, projectName, canManage }: Props = $props();

  const roleOptions = PROJECT_ROLES.map((r) => ({ value: r, label: PROJECT_ROLE[r].label }));

  let target = $state<User | null>(null);
  let open = $state(false);
</script>

<div class="overflow-hidden rounded-lg border">
  <Table class="min-w-xl">
    <TableHeader>
      <TableRow>
        <TableHead class="w-full">Persona</TableHead>
        <TableHead>Rol en el proyecto</TableHead>
        <TableHead><span class="sr-only">Acciones</span></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each members as member (member.user.id)}
        {@const user = member.user}
        {@const role = member.role}
        {@const editable = canManage && user.id !== me}
        <TableRow>
          <TableCell class="max-w-0">
            <div class="flex min-w-0 items-center gap-2.5">
              <UserAvatar name={user.name} />
              <div class="min-w-0">
                <p class="flex items-center gap-2 truncate font-medium">
                  {user.name}
                  {#if user.id === me}<span class="text-xs font-normal text-muted-foreground"
                      >(tú)</span
                    >{/if}
                  {#if user.status === 'inactive'}<ToneBadge tone="muted">Desactivado</ToneBadge
                    >{/if}
                </p>
                <p class="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            {#if editable}
              <AutoSubmitSelect
                action="?/role"
                name="role"
                value={role}
                options={roleOptions}
                label="Rol de {user.name}"
                hidden={{ userId: user.id }}
                class="w-44"
              />
            {:else}
              <span class="text-sm" title={PROJECT_ROLE[role].description}>
                {PROJECT_ROLE[role].label}
              </span>
            {/if}
          </TableCell>
          <TableCell class="text-right">
            {#if editable}
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Quitar a {user.name}"
                onclick={() => {
                  target = user;
                  open = true;
                }}
              >
                <UserMinus />
              </Button>
            {/if}
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>

<ConfirmDialog
  bind:open
  action="?/remove"
  title="Quitar a {target?.name} de {projectName}"
  description="Deja de ver las revisiones del proyecto. Sus comentarios y veredictos se conservan, y sus asignaciones abiertas quedan sin diseñador."
  confirmLabel="Quitar"
  destructive
>
  {#snippet fields()}
    <input type="hidden" name="userId" value={target?.id ?? ''} />
  {/snippet}
</ConfirmDialog>
