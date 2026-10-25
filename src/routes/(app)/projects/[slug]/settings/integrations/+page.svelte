<script lang="ts">
  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import SwitchField from '$lib/components/molecules/SwitchField.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const github = $derived(data.project.integrations.github);
  const plane = $derived(data.project.integrations.plane);
  const errors = $derived<Record<string, string>>(page.form?.errors ?? {});
  let sending = $state(false);
</script>

{#snippet status(connected: boolean)}
  {#if connected}
    <ToneBadge tone="success">Conectado</ToneBadge>
  {:else}
    <ToneBadge tone="muted">Sin conectar</ToneBadge>
  {/if}
{/snippet}

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
    title="GitHub"
    description="La revisión publica un check en el PR: pendiente mientras diseño revisa, verde al aprobar y rojo si pide ajustes."
  >
    {#snippet actions()}{@render status(github.connected)}{/snippet}
    <div class="space-y-4">
      <p class="text-sm">
        Repositorio <span class="font-mono">{github.repo}</span>
      </p>
      <FormField
        id="checkName"
        label="Nombre del check"
        error={errors.checkName}
        hint="Es el que exige la protección de rama. Si lo cambias, actualízalo también en GitHub."
      >
        {#snippet children({ describedBy, invalid })}
          <Input
            id="checkName"
            name="checkName"
            value={github.checkName}
            class="max-w-xs font-mono"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />
        {/snippet}
      </FormField>
      <SwitchField
        id="commentOnPr"
        name="commentOnPr"
        label="Comentar en el PR al enviar"
        description="Resume el envío de diseño con enlaces a cada pantalla con ajustes."
        checked={github.commentOnPr}
        disabled={!github.connected}
      />
    </div>
  </SettingsSection>

  <SettingsSection
    title="Plane"
    description="Enlaza la revisión con su tarjeta ({plane.projectKey}-123) a partir del nombre de la rama."
  >
    {#snippet actions()}{@render status(plane.connected)}{/snippet}
    <div class="space-y-4">
      {#if !plane.connected}
        <Notice tone="info">
          La conexión con Plane la hace un admin desde el API con un token del espacio de trabajo.
        </Notice>
      {/if}
      <SwitchField
        id="commentOnCard"
        name="commentOnCard"
        label="Comentar en la tarjeta al enviar"
        description="Deja el resultado de la revisión y el enlace en la tarjeta de Plane."
        checked={plane.commentOnCard}
        disabled={!plane.connected}
      />
    </div>
  </SettingsSection>

  <div class="flex justify-end">
    <Button type="submit" size="sm" disabled={sending}>Guardar integraciones</Button>
  </div>
</form>
