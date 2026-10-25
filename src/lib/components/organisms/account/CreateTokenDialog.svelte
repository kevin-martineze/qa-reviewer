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
  import type { FilterOption } from '$lib/components/molecules/filter';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import FormSelect from '$lib/components/molecules/FormSelect.svelte';

  interface Props {
    open: boolean;
    projects: FilterOption[];
    errors: Record<string, string>;
    label: string;
  }

  let { open = $bindable(false), projects, errors, label }: Props = $props();

  let sending = $state(false);
</script>

<Dialog bind:open>
  <DialogContent class="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Crear token de la skill</DialogTitle>
      <DialogDescription>
        Un token por equipo y proyecto. Lo verás una sola vez al crearlo.
      </DialogDescription>
    </DialogHeader>
    <form
      method="post"
      action="?/create"
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
      <FormField
        id="token-label"
        label="Nombre"
        error={errors.label}
        hint="Para reconocerlo después, p. ej. «MacBook · Lideris»."
      >
        {#snippet children({ describedBy, invalid })}
          <Input
            id="token-label"
            name="label"
            value={label}
            autocomplete="off"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />
        {/snippet}
      </FormField>
      <FormField id="token-project" label="Proyecto" error={errors.projectId}>
        {#snippet children({ describedBy, invalid })}
          <FormSelect
            id="token-project"
            name="projectId"
            value={projects.length === 1 ? (projects[0]?.value ?? '') : ''}
            options={projects}
            placeholder="Elige el proyecto"
            {invalid}
            {describedBy}
          />
        {/snippet}
      </FormField>
      <DialogFooter>
        <Button type="button" variant="ghost" onclick={() => (open = false)}>Cancelar</Button>
        <Button type="submit" disabled={sending}>Crear token</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
