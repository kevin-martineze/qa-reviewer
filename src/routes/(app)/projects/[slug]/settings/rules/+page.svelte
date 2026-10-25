<script lang="ts">
  import { ShieldAlert } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Textarea } from '$lib/components/atoms/textarea';
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
  class="space-y-6"
  use:enhance={() => {
    sending = true;
    return async ({ update }) => {
      await update({ reset: false });
      sending = false;
    };
  }}
>
  <SettingsSection
    title="Reglas de diseño"
    description="La skill las revisa antes de publicar y las muestra en el resumen de cada revisión."
  >
    <FormField
      id="designRules"
      label="Una regla por línea"
      error={errors.designRules}
      hint="Máximo 30 reglas de 200 caracteres."
    >
      {#snippet children({ describedBy, invalid })}
        <Textarea
          id="designRules"
          name="designRules"
          rows={6}
          value={page.form?.designRules ?? data.project.designRules.join('\n')}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      {/snippet}
    </FormField>
  </SettingsSection>

  <SettingsSection
    title="Datos sensibles"
    description="Selectores CSS que la skill tapa con un bloque gris antes de capturar. Nunca se suben imágenes sin tapar."
  >
    <div
      class="mb-4 flex items-start gap-2 rounded-md bg-warning-soft px-3 py-2 text-sm text-warning"
    >
      <ShieldAlert class="mt-0.5 size-4 shrink-0" />
      <p>
        Agrega aquí cualquier campo con datos de pacientes o documentos. Si un selector no coincide,
        la skill avisa y no publica esa pantalla.
      </p>
    </div>
    <FormField
      id="maskSelectors"
      label="Un selector por línea"
      error={errors.maskSelectors}
      hint="Ej.: [data-patient-name] o input[type=&quot;email&quot;]."
    >
      {#snippet children({ describedBy, invalid })}
        <Textarea
          id="maskSelectors"
          name="maskSelectors"
          rows={5}
          class="font-mono text-xs"
          value={page.form?.maskSelectors ?? data.project.maskSelectors.join('\n')}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      {/snippet}
    </FormField>
  </SettingsSection>

  <div class="flex justify-end">
    <Button type="submit" size="sm" disabled={sending}>Guardar reglas</Button>
  </div>
</form>
