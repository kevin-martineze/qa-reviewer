<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import { Label } from '$lib/components/atoms/label';

  const error = $derived(page.form?.error ?? null);
  const email = $derived(page.form?.email ?? '');
</script>

<form method="post" use:enhance class="space-y-4">
  <div class="space-y-2">
    <Label for="email">Correo</Label>
    <Input id="email" name="email" type="email" value={email} required autocomplete="email" />
  </div>
  <div class="space-y-2">
    <Label for="password">Contraseña</Label>
    <Input id="password" name="password" type="password" required autocomplete="current-password" />
  </div>
  {#if error}
    <p class="text-sm text-danger">{error}</p>
  {/if}
  <Button type="submit" class="w-full">Entrar</Button>
</form>

<div
  class="mt-6 space-y-1 rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground"
>
  <p class="font-medium text-foreground">Cuentas demo</p>
  <p>Laura Ríos · laura.rios@ejemplo.co · design_lead</p>
  <p>Kevin Martínez · kevin@ejemplo.co · developer</p>
  <p class="pt-1">Contraseña: demo1234</p>
</div>
