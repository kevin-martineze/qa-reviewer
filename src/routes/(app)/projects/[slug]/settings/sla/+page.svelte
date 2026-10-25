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
  <SettingsSection
    title="Plazo de revisión"
    description="Días hábiles (lunes a viernes, hora de Bogotá) desde que la revisión se abre hasta el primer envío de diseño."
  >
    <FormField
      id="slaDays"
      label="Días hábiles"
      error={errors.slaDays}
      hint="Entre {data.limits.min} y {data.limits
        .max}. Cambia el plazo de las revisiones nuevas; las abiertas conservan el suyo."
    >
      {#snippet children({ describedBy, invalid })}
        <Input
          id="slaDays"
          name="slaDays"
          type="number"
          inputmode="numeric"
          min={data.limits.min}
          max={data.limits.max}
          step={1}
          value={page.form?.slaDays ?? data.project.slaDays}
          class="w-28 tabular-nums"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      {/snippet}
    </FormField>

    <ul class="mt-4 space-y-1 text-sm text-muted-foreground">
      <li>Un día antes del vencimiento, quien tiene la revisión asignada recibe un aviso.</li>
      <li>Al vencerse, la revisión aparece como vencida en la bandeja del líder de diseño.</li>
    </ul>

    {#snippet footer()}
      <Button type="submit" size="sm" disabled={sending}>Guardar</Button>
    {/snippet}
  </SettingsSection>
</form>
