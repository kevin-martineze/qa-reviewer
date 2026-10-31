<script lang="ts">
  import { untrack } from 'svelte';

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
  import { toSlug } from '$lib/schemas/project';

  interface Props {
    open: boolean;
    errors: Record<string, string>;
    values: { name: string; id: string; repo: string; planeKey: string };
  }

  let { open = $bindable(false), errors, values }: Props = $props();

  let sending = $state(false);
  // Arranca con lo que devolvió el server (sin JS); con JS, un error no limpia el formulario.
  const initial = untrack(() => values);
  let name = $state(initial.name);
  // Mientras la persona no lo toque, el identificador sigue al nombre.
  let customId = $state<string | null>(
    initial.id && initial.id !== toSlug(initial.name) ? initial.id : null,
  );
  const id = $derived(customId ?? toSlug(name));
</script>

<Dialog bind:open>
  <DialogContent class="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Nuevo proyecto</DialogTitle>
      <DialogDescription>
        Un proyecto agrupa las revisiones de un producto. Después agregas a sus miembros y
        configuras el plazo, la asignación y las integraciones.
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
          if (result.type === 'success') {
            open = false;
            name = '';
            customId = null;
          }
        };
      }}
    >
      <FormField id="project-name" label="Nombre" error={errors.name}>
        {#snippet children({ describedBy, invalid })}
          <Input
            id="project-name"
            name="name"
            autocomplete="off"
            required
            bind:value={name}
            placeholder="Portal de clientes"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />
        {/snippet}
      </FormField>

      <FormField
        id="project-id"
        label="Identificador"
        error={errors.id}
        hint="Va en las URLs y en los tokens de la skill. No se puede cambiar después."
      >
        {#snippet children({ describedBy, invalid })}
          <Input
            id="project-id"
            name="id"
            autocomplete="off"
            required
            value={id}
            oninput={(e) => (customId = e.currentTarget.value)}
            placeholder="portal-clientes"
            class="font-mono"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />
        {/snippet}
      </FormField>

      <div class="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <FormField
          id="project-repo"
          label="Repositorio de GitHub (opcional)"
          error={errors.repo}
          hint="dueño/repositorio"
        >
          {#snippet children({ describedBy, invalid })}
            <Input
              id="project-repo"
              name="repo"
              autocomplete="off"
              value={values.repo}
              placeholder="estudio-norte/portal"
              class="font-mono"
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
            />
          {/snippet}
        </FormField>
        <FormField id="project-plane" label="Clave de Plane" error={errors.planeKey}>
          {#snippet children({ describedBy, invalid })}
            <Input
              id="project-plane"
              name="planeKey"
              autocomplete="off"
              value={values.planeKey}
              placeholder="PORT"
              class="font-mono uppercase"
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
            />
          {/snippet}
        </FormField>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onclick={() => (open = false)}>Cancelar</Button>
        <Button type="submit" disabled={sending}>{sending ? 'Creando…' : 'Crear proyecto'}</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
