<script lang="ts">
  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const errors = $derived<Record<string, string>>(page.form?.errors ?? {});
  let sending = $state(false);
</script>

<div class="space-y-6">
  <form
    method="post"
    novalidate
    use:enhance={() => {
      sending = true;
      return async ({ update }) => {
        await update({ reset: false });
        sending = false;
      };
    }}
  >
    <SettingsSection title="Proyecto" description="El nombre se ve en el selector y en los avisos.">
      <FormField id="name" label="Nombre" error={errors.name}>
        {#snippet children({ describedBy, invalid })}
          <Input
            id="name"
            name="name"
            required
            value={data.project.name}
            class="max-w-sm"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />
        {/snippet}
      </FormField>
      {#snippet footer()}
        <Button type="submit" size="sm" disabled={sending}>Guardar</Button>
      {/snippet}
    </SettingsSection>
  </form>

  <SettingsSection
    title="Identificadores"
    description="Los usa la skill para publicar revisiones. Se cambian desde el API."
  >
    <dl class="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm">
      <dt class="text-muted-foreground">Slug</dt>
      <dd class="font-mono">{data.project.id}</dd>
      <dt class="text-muted-foreground">Repositorio</dt>
      <dd class="font-mono">{data.project.repo}</dd>
      <dt class="text-muted-foreground">Clave en Plane</dt>
      <dd class="font-mono">{data.project.planeKey}</dd>
      <dt class="text-muted-foreground">Revisiones</dt>
      <dd class="tabular-nums">{data.project.reviewsCount}</dd>
    </dl>
  </SettingsSection>
</div>
