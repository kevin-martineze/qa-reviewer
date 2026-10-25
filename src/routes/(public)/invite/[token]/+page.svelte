<script lang="ts">
  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import { Badge } from '$lib/components/atoms/badge';
  import { Button, buttonVariants } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import PasswordInput from '$lib/components/molecules/PasswordInput.svelte';
  import { ORG_ROLE } from '$lib/domain/labels';
  import { cn } from '$lib/utils/cn';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const STATUS_TEXT = {
    expired: 'La invitación venció. Pide a quien te invitó que te envíe una nueva.',
    used: 'Esta invitación ya se usó. Si la cuenta es tuya, entra con tu correo.',
    revoked: 'La invitación fue revocada. Habla con el admin de tu organización.',
  } as const;

  const form = $derived(page.form);
  const errors = $derived<Record<string, string>>(form?.errors ?? {});
  let submitting = $state(false);
</script>

{#if data.invite.status === 'valid'}
  <div class="space-y-4">
    <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md bg-muted p-3 text-sm">
      <dt class="text-muted-foreground">Correo</dt>
      <dd class="truncate">{data.invite.email}</dd>
      <dt class="text-muted-foreground">Rol</dt>
      <dd>{ORG_ROLE[data.invite.role].label}</dd>
      {#if data.invite.projects.length}
        <dt class="text-muted-foreground">Proyectos</dt>
        <dd class="flex flex-wrap gap-1">
          {#each data.invite.projects as project (project)}
            <Badge variant="outline">{project}</Badge>
          {/each}
        </dd>
      {/if}
    </dl>

    {#if form?.error}
      <Notice tone="danger">{form.error}</Notice>
    {/if}

    <form
      method="post"
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
      <FormField id="name" label="Tu nombre" error={errors.name}>
        {#snippet children({ describedBy, invalid })}
          <Input
            id="name"
            name="name"
            autocomplete="name"
            required
            value={form?.name ?? ''}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
          />
        {/snippet}
      </FormField>
      <FormField
        id="password"
        label="Contraseña"
        error={errors.password}
        hint="Mínimo {data.passwordMin} caracteres."
      >
        {#snippet children({ describedBy, invalid })}
          <PasswordInput
            id="password"
            name="password"
            autocomplete="new-password"
            {invalid}
            {describedBy}
          />
        {/snippet}
      </FormField>
      <FormField id="confirm" label="Confirma la contraseña" error={errors.confirm}>
        {#snippet children({ describedBy, invalid })}
          <PasswordInput
            id="confirm"
            name="confirm"
            autocomplete="new-password"
            {invalid}
            {describedBy}
          />
        {/snippet}
      </FormField>
      <Button type="submit" class="w-full" disabled={submitting}>
        {submitting ? 'Creando cuenta…' : 'Aceptar y entrar'}
      </Button>
    </form>
  </div>
{:else}
  <div class="space-y-4">
    <Notice tone="warning">{STATUS_TEXT[data.invite.status]}</Notice>
    <a href={resolve('/login')} class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
      Ir a iniciar sesión
    </a>
  </div>
{/if}
