<script lang="ts">
  import { X } from '@lucide/svelte';

  import type { Invitation } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import ConfirmDialog from '$lib/components/molecules/ConfirmDialog.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import { ORG_ROLE } from '$lib/domain/labels';
  import { nameOf, type People } from '$lib/domain/people';
  import { formatRelative, formatShortDate } from '$lib/utils/dates';

  interface Props {
    invitations: Invitation[];
    people: People;
    now: Date;
  }

  let { invitations, people, now }: Props = $props();

  const STATUS = {
    valid: { label: 'Pendiente', tone: 'info' },
    expired: { label: 'Vencida', tone: 'warning' },
    revoked: { label: 'Revocada', tone: 'muted' },
    used: { label: 'Aceptada', tone: 'success' },
  } as const;

  let target = $state<Invitation | null>(null);
  let open = $state(false);
</script>

<ul class="divide-y rounded-lg border">
  {#each invitations as invite (invite.id)}
    <li class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">{invite.email}</p>
        <p class="truncate text-xs text-muted-foreground">
          {ORG_ROLE[invite.role].label} · {invite.projects.length}
          {invite.projects.length === 1 ? 'proyecto' : 'proyectos'} · invitó {nameOf(
            people,
            invite.invitedBy,
          )}
          {formatRelative(invite.createdAt, now)}
        </p>
      </div>
      <ToneBadge tone={STATUS[invite.status].tone}>{STATUS[invite.status].label}</ToneBadge>
      {#if invite.status === 'valid'}
        <span class="text-xs whitespace-nowrap text-muted-foreground">
          Vence el {formatShortDate(invite.expiresAt, now)}
        </span>
        <Button
          type="button"
          size="xs"
          variant="ghost"
          onclick={() => {
            target = invite;
            open = true;
          }}
        >
          <X /> Revocar
        </Button>
      {/if}
    </li>
  {/each}
</ul>

<ConfirmDialog
  bind:open
  action="?/revokeInvite"
  title="Revocar la invitación"
  description="El enlace enviado a {target?.email} deja de funcionar. Puedes invitar de nuevo cuando quieras."
  confirmLabel="Revocar"
  destructive
>
  {#snippet fields()}
    <input type="hidden" name="id" value={target?.id ?? ''} />
  {/snippet}
</ConfirmDialog>
