<script lang="ts">
  import type { SubmitFunction } from '@sveltejs/kit';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import { Button, buttonVariants } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import PasswordInput from '$lib/components/molecules/PasswordInput.svelte';
  import { cn } from '$lib/utils/cn';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const form = $derived(page.form);
  const errors = $derived<Record<string, string>>(form?.errors ?? {});
  const sent = $derived<string | null>(form?.sent ?? null);
  let submitting = $state(false);

  const submit: SubmitFunction = () => {
    submitting = true;
    return async ({ update }) => {
      await update({ reset: false });
      submitting = false;
    };
  };
</script>

<div class="space-y-4">
  {#if form?.error}
    <Notice tone="danger">{form.error}</Notice>
  {/if}

  {#if data.mode === 'request'}
    {#if sent}
      <Notice tone="success" title="Revisa tu correo">
        Si {sent} tiene una cuenta, le llegará un enlace válido por 1 hora.
      </Notice>
    {:else}
      <form method="post" action="?/request" class="space-y-4" novalidate use:enhance={submit}>
        <FormField id="email" label="Correo" error={errors.email}>
          {#snippet children({ describedBy, invalid })}
            <Input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              value={form?.email ?? ''}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
            />
          {/snippet}
        </FormField>
        <Button type="submit" class="w-full" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar enlace'}
        </Button>
      </form>
    {/if}
  {:else if data.status === 'valid'}
    <form method="post" action="?/reset" class="space-y-4" novalidate use:enhance={submit}>
      <FormField
        id="password"
        label="Contraseña nueva"
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
        {submitting ? 'Guardando…' : 'Guardar contraseña'}
      </Button>
    </form>
  {:else}
    <Notice tone="warning">
      {data.status === 'used'
        ? 'Este enlace ya se usó. Pide uno nuevo si todavía no puedes entrar.'
        : 'Este enlace venció. Los enlaces duran 1 hora; pide uno nuevo.'}
    </Notice>
    <a href={resolve('/recover')} class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
      Pedir otro enlace
    </a>
  {/if}

  <p class="text-center text-sm text-muted-foreground">
    <a href={resolve('/login')} class="underline-offset-4 hover:text-foreground hover:underline">
      Volver a iniciar sesión
    </a>
  </p>
</div>
