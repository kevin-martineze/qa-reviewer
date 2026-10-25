<script lang="ts">
  import { enhance } from '$app/forms';

  import { Button } from '$lib/components/atoms/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '$lib/components/atoms/dialog';
  import { Input } from '$lib/components/atoms/input';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import FormSelect from '$lib/components/molecules/FormSelect.svelte';
  import { ORG_ROLE, PROJECT_ROLE } from '$lib/domain/labels';
  import { NO_ACCESS } from '$lib/schemas/admin';
  import type { OrgRole } from '$lib/api/types';
  import { ORG_ROLES, PROJECT_ROLES } from '$lib/schemas/roles';

  interface Props {
    open: boolean;
    projects: Array<{ id: string; name: string }>;
    canManageOwners: boolean;
    errors: Record<string, string>;
    email: string;
  }

  let { open = $bindable(false), projects, canManageOwners, errors, email }: Props = $props();

  let sending = $state(false);
  let role = $state<OrgRole>('member');

  const roleOptions = $derived(
    ORG_ROLES.filter((r) => canManageOwners || r !== 'owner').map((r) => ({
      value: r,
      label: ORG_ROLE[r].label,
    })),
  );
  const projectOptions = [
    { value: NO_ACCESS, label: 'Sin acceso' },
    ...PROJECT_ROLES.map((r) => ({ value: r, label: PROJECT_ROLE[r].label })),
  ];
</script>

<Dialog bind:open>
  <DialogContent class="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Invitar a la organización</DialogTitle>
      <DialogDescription>
        Le llega un correo con un enlace válido por 7 días para crear su contraseña.
      </DialogDescription>
    </DialogHeader>
    <form
      method="post"
      action="?/invite"
      class="space-y-4"
      novalidate
      use:enhance={() => {
        sending = true;
        return async ({ result, update }) => {
          await update({ reset: result.type === 'success' });
          sending = false;
          if (result.type === 'success') open = false;
        };
      }}
    >
      <FormField id="invite-email" label="Correo" error={errors.email}>
        {#snippet children({ describedBy, invalid })}
          <Input
            id="invite-email"
            name="email"
            type="email"
            autocomplete="off"
            required
            value={email}
            placeholder="nombre@empresa.co"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />
        {/snippet}
      </FormField>

      <FormField
        id="invite-role"
        label="Rol en la organización"
        error={errors.role}
        hint={ORG_ROLE[role].description}
      >
        {#snippet children({ describedBy, invalid })}
          <FormSelect
            id="invite-role"
            name="role"
            value={role}
            options={roleOptions}
            onChange={(v) => {
              const next = ORG_ROLES.find((r) => r === v);
              if (next) role = next;
            }}
            {invalid}
            {describedBy}
          />
        {/snippet}
      </FormField>

      {#if projects.length}
        <fieldset class="space-y-2">
          <legend class="text-sm font-medium">Acceso a proyectos</legend>
          <div class="divide-y rounded-md border">
            {#each projects as project (project.id)}
              <div class="flex items-center justify-between gap-3 px-3 py-2">
                <span class="text-sm">{project.name}</span>
                <FormSelect
                  name="project:{project.id}"
                  value={NO_ACCESS}
                  options={projectOptions}
                  size="sm"
                  class="w-44"
                  label="Rol en {project.name}"
                />
              </div>
            {/each}
          </div>
          <p class="text-xs text-muted-foreground">
            Admin y owner ven todos los proyectos aunque no tengan rol en ellos.
          </p>
        </fieldset>
      {/if}

      <DialogFooter>
        <Button type="button" variant="ghost" onclick={() => (open = false)}>Cancelar</Button>
        <Button type="submit" disabled={sending}
          >{sending ? 'Enviando…' : 'Enviar invitación'}</Button
        >
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
