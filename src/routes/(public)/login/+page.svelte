<script lang="ts">
  import { tick } from 'svelte';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import PasswordInput from '$lib/components/molecules/PasswordInput.svelte';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const form = $derived(page.form);
  const errors = $derived<Record<string, string>>(form?.errors ?? {});

  let email = $state(page.form?.email ?? '');
  let password = $state('');
  let submitting = $state(false);

  let formEl = $state<HTMLFormElement | null>(null);

  /** Mock: un clic en la cuenta entra directo. */
  async function useDemo(account: string) {
    email = account;
    password = data.demo?.password ?? '';
    await tick();
    formEl?.requestSubmit();
  }
</script>

<div class="space-y-4">
  {#if data.notice}
    <Notice tone={data.notice.tone}>{data.notice.text}</Notice>
  {/if}
  {#if form?.error}
    <Notice tone="danger">{form.error}</Notice>
  {/if}

  <form
    bind:this={formEl}
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
    {#if data.redirectTo}
      <input type="hidden" name="redirectTo" value={data.redirectTo} />
    {/if}

    <FormField id="email" label="Correo" error={errors.email}>
      {#snippet children({ describedBy, invalid })}
        <Input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          bind:value={email}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />
      {/snippet}
    </FormField>

    <FormField id="password" label="Contraseña" error={errors.password}>
      {#snippet aside()}
        <a
          href={resolve('/recover')}
          class="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      {/snippet}
      {#snippet children({ describedBy, invalid })}
        <PasswordInput
          id="password"
          name="password"
          autocomplete="current-password"
          bind:value={password}
          {invalid}
          {describedBy}
        />
      {/snippet}
    </FormField>

    <Button type="submit" class="w-full" disabled={submitting}>
      {submitting ? 'Entrando…' : 'Entrar'}
    </Button>
  </form>

  {#if data.demo}
    <section class="space-y-2 rounded-md border border-dashed p-3" aria-labelledby="demo-title">
      <div class="flex items-baseline justify-between">
        <h2 id="demo-title" class="text-xs font-medium">Entrar como (mock)</h2>
        <span class="text-xs text-muted-foreground">Contraseña: {data.demo.password}</span>
      </div>
      <ul class="space-y-1">
        {#each data.demo.accounts as account (account.email)}
          <li>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              onclick={() => useDemo(account.email)}
            >
              <UserAvatar name={account.name} avatar={account.avatar} size="sm" />
              <span class="min-w-0">
                <span class="block truncate text-sm">{account.name}</span>
                <span class="block truncate text-xs text-muted-foreground">{account.role}</span>
              </span>
            </button>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</div>
