<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import type { PageData } from './$types';

  import { Badge } from '$lib/components/atoms/badge';
  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import { Label } from '$lib/components/atoms/label';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  const error = $derived(page.form?.error ?? null);
  const name = $derived(page.form?.name ?? '');

  const statusLabel = $derived(
    data.invite.status === 'expired'
      ? 'La invitación venció.'
      : data.invite.status === 'used'
        ? 'La invitación ya fue usada.'
        : data.invite.status === 'revoked'
          ? 'La invitación fue revocada.'
          : '',
  );
</script>

<div class="space-y-4">
  <div class="space-y-1 rounded-md border border-border bg-muted p-3 text-sm">
    <p><span class="text-muted-foreground">Organización:</span> {data.invite.org}</p>
    <p><span class="text-muted-foreground">Invitado por:</span> {data.invite.inviter}</p>
    <p><span class="text-muted-foreground">Rol:</span> {data.invite.role}</p>
    <div class="flex flex-wrap gap-1 pt-1">
      {#each data.invite.projects as project (project)}
        <Badge variant="outline">{project}</Badge>
      {/each}
    </div>
  </div>

  {#if data.invite.status === 'valid'}
    <form method="post" use:enhance class="space-y-4">
      <div class="space-y-2">
        <Label for="name">Tu nombre</Label>
        <Input id="name" name="name" value={name} required />
      </div>
      <div class="space-y-2">
        <Label for="password">Contraseña</Label>
        <Input id="password" name="password" type="password" required autocomplete="new-password" />
      </div>
      <div class="space-y-2">
        <Label for="confirm">Confirmar contraseña</Label>
        <Input id="confirm" name="confirm" type="password" required autocomplete="new-password" />
      </div>
      {#if error}
        <p class="text-sm text-danger">{error}</p>
      {/if}
      <Button type="submit" class="w-full">Aceptar y entrar</Button>
    </form>
  {:else}
    <p class="text-sm text-muted-foreground">{statusLabel}</p>
  {/if}
</div>
