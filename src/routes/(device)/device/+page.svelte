<script lang="ts">
  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import FormSelect from '$lib/components/molecules/FormSelect.svelte';
  import Illustration from '$lib/components/molecules/Illustration.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const form = $derived(page.form);
  const errors = $derived<Record<string, string>>(form?.errors ?? {});
  const device = $derived(data.device);
  /** El proyecto del repo donde corre la skill; si solo hay uno, ese. */
  const initialProject = $derived(
    device?.suggestedProjectId ??
      (data.projects.length === 1 ? (data.projects[0]?.value ?? '') : ''),
  );
  const label = $derived(typeof form?.label === 'string' ? form.label : data.defaultLabel);
  const action = (name: string) => `?/${name}&code=${encodeURIComponent(data.code)}`;

  let submitting = $state(false);
</script>

{#if !device}
  <form method="get" class="space-y-4" novalidate>
    <p class="text-sm text-muted-foreground">
      Escribe el código que muestra la terminal donde corriste <code>/design-review</code>.
    </p>
    <FormField id="code" label="Código" error={data.codeError ?? undefined}>
      {#snippet children({ describedBy, invalid })}
        <Input
          id="code"
          name="code"
          value={data.code}
          placeholder="ABCD-EFGH"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck={false}
          class="font-mono tracking-widest uppercase"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      {/snippet}
    </FormField>
    <Button type="submit" class="w-full">Continuar</Button>
  </form>
{:else if device.status === 'pending'}
  <div class="space-y-4">
    <div class="rounded-md bg-muted p-3 text-center">
      <p class="text-xs text-muted-foreground">Código</p>
      <p class="font-mono text-2xl font-semibold tracking-widest" data-testid="device-code">
        {device.userCode}
      </p>
    </div>
    <p class="text-sm text-muted-foreground">
      Confirma que es el mismo código de tu terminal. Si no corriste la skill, rechaza.
    </p>
    <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
      <dt class="text-muted-foreground">Equipo</dt>
      <dd class="truncate">{device.client.hostname || 'Sin nombre'}</dd>
      <dt class="text-muted-foreground">Cliente</dt>
      <dd class="truncate">{device.client.name} {device.client.version}</dd>
      {#if device.repo}
        <dt class="text-muted-foreground">Repositorio</dt>
        <dd class="truncate font-mono text-xs leading-5">{device.repo}</dd>
      {/if}
    </dl>

    {#if form?.error}
      <Notice tone="danger">{form.error}</Notice>
    {/if}

    <form
      method="post"
      action={action('approve')}
      class="space-y-4"
      novalidate
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update({ reset: false });
          submitting = false;
        };
      }}
    >
      {#if data.projects.length}
        <FormField
          id="device-project"
          label="Proyecto"
          error={errors.projectId}
          hint="La skill publicará revisiones solo en este proyecto."
        >
          {#snippet children({ describedBy, invalid })}
            <FormSelect
              id="device-project"
              name="projectId"
              value={initialProject}
              options={data.projects}
              placeholder="Elige el proyecto"
              {invalid}
              {describedBy}
            />
          {/snippet}
        </FormField>
        <FormField
          id="device-label"
          label="Nombre del token"
          error={errors.label}
          hint="Lo verás en Cuenta → Tokens, donde puedes revocarlo."
        >
          {#snippet children({ describedBy, invalid })}
            <Input
              id="device-label"
              name="label"
              value={label}
              autocomplete="off"
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
            />
          {/snippet}
        </FormField>
      {:else}
        <Notice tone="warning">
          Solo desarrolladores y admins de proyecto publican con la skill. Pide ese rol en el
          proyecto y vuelve a correr <code>/design-review</code>.
        </Notice>
      {/if}
      <div class="flex gap-2">
        <Button
          type="submit"
          variant="outline"
          class="flex-1"
          formaction={action('deny')}
          disabled={submitting}
        >
          Rechazar
        </Button>
        {#if data.projects.length}
          <Button type="submit" class="flex-1" disabled={submitting}>
            {submitting ? 'Enviando…' : 'Autorizar'}
          </Button>
        {/if}
      </div>
    </form>
  </div>
{:else if device.status === 'approved'}
  <div class="space-y-4">
    <Illustration name="token-cli" class="mx-auto w-32" />
    <Notice tone="success" title="Listo">
      Vuelve a la terminal: la skill ya puede publicar revisiones a tu nombre. Puedes cerrar esta
      pestaña.
    </Notice>
  </div>
{:else if device.status === 'denied'}
  <Notice tone="info" title="Acceso rechazado">
    La skill no recibió ningún token. Si fue un error, corre <code>/design-review</code> otra vez.
  </Notice>
{:else}
  <div class="space-y-4">
    <Illustration name="link-expired" class="mx-auto w-32" />
    <Notice tone="warning" title="El código venció">
      Corre <code>/design-review</code> otra vez para pedir uno nuevo.
    </Notice>
  </div>
{/if}
