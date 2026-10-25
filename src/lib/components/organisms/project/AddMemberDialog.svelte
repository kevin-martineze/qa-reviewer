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
  import FormField from '$lib/components/molecules/FormField.svelte';
  import FormSelect from '$lib/components/molecules/FormSelect.svelte';
  import { PROJECT_ROLE } from '$lib/domain/labels';
  import { PROJECT_ROLES } from '$lib/schemas/roles';

  interface Props {
    open: boolean;
    projectName: string;
    candidates: Array<{ id: string; name: string; email: string }>;
    errors: Record<string, string>;
  }

  let { open = $bindable(false), projectName, candidates, errors }: Props = $props();

  let sending = $state(false);
  let role = $state<string>('designer');

  const people = $derived(
    candidates.map((c) => ({ value: c.id, label: `${c.name} · ${c.email}` })),
  );
  const roles = PROJECT_ROLES.map((r) => ({ value: r, label: PROJECT_ROLE[r].label }));
  const roleHint = $derived(PROJECT_ROLES.find((r) => r === role));
</script>

<Dialog bind:open>
  <DialogContent class="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Agregar a {projectName}</DialogTitle>
      <DialogDescription>
        Solo aparecen personas activas de la organización. Para alguien nuevo, invítalo primero.
      </DialogDescription>
    </DialogHeader>
    <form
      method="post"
      action="?/add"
      class="space-y-4"
      use:enhance={() => {
        sending = true;
        return async ({ result, update }) => {
          await update();
          sending = false;
          if (result.type === 'success') open = false;
        };
      }}
    >
      <FormField id="member-user" label="Persona" error={errors.userId}>
        {#snippet children({ describedBy, invalid })}
          <FormSelect
            id="member-user"
            name="userId"
            value=""
            options={people}
            placeholder="Elige una persona"
            {invalid}
            {describedBy}
          />
        {/snippet}
      </FormField>
      <FormField
        id="member-role"
        label="Rol en el proyecto"
        error={errors.role}
        hint={roleHint ? PROJECT_ROLE[roleHint].description : undefined}
      >
        {#snippet children({ describedBy, invalid })}
          <FormSelect
            id="member-role"
            name="role"
            value={role}
            options={roles}
            {invalid}
            {describedBy}
            onChange={(v) => (role = v)}
          />
        {/snippet}
      </FormField>
      <DialogFooter>
        <Button type="button" variant="ghost" onclick={() => (open = false)}>Cancelar</Button>
        <Button type="submit" disabled={sending}>Agregar</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
