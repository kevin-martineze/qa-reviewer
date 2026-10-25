<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import type { PageData } from './$types';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import { Label } from '$lib/components/atoms/label';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  const error = $derived(page.form?.error ?? null);
  const sent = $derived(page.form?.sent ?? false);
  const email = $derived(page.form?.email ?? '');
  const hasToken = $derived('recovery' in data);
</script>

{#if hasToken}
  <form method="post" use:enhance class="space-y-4">
    <div class="space-y-2">
      <Label for="password">Contraseña nueva</Label>
      <Input id="password" name="password" type="password" required autocomplete="new-password" />
    </div>
    <div class="space-y-2">
      <Label for="confirm">Confirmar contraseña</Label>
      <Input id="confirm" name="confirm" type="password" required autocomplete="new-password" />
    </div>
    {#if error}
      <p class="text-sm text-danger">{error}</p>
    {/if}
    <Button type="submit" class="w-full">Guardar contraseña</Button>
  </form>
{:else if sent}
  <p class="text-sm text-muted-foreground">
    Si el correo existe, te enviamos un enlace para definir una contraseña nueva.
  </p>
{:else}
  <form method="post" use:enhance class="space-y-4">
    <div class="space-y-2">
      <Label for="email">Correo</Label>
      <Input id="email" name="email" type="email" value={email} required autocomplete="email" />
    </div>
    {#if error}
      <p class="text-sm text-danger">{error}</p>
    {/if}
    <Button type="submit" class="w-full">Enviar enlace</Button>
  </form>
{/if}
