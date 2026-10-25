<script lang="ts">
  import { LogOut } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { page } from '$app/state';

  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import AvatarPicker from '$lib/components/molecules/AvatarPicker.svelte';
  import ConfirmDialog from '$lib/components/molecules/ConfirmDialog.svelte';
  import FormField from '$lib/components/molecules/FormField.svelte';
  import PasswordInput from '$lib/components/molecules/PasswordInput.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { ORG_ROLE } from '$lib/domain/labels';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const profileErrors = $derived<Record<string, string>>(page.form?.profileErrors ?? {});
  const passwordErrors = $derived<Record<string, string>>(page.form?.passwordErrors ?? {});
  let savingProfile = $state(false);
  let savingPassword = $state(false);
  let everywhereOpen = $state(false);
</script>

<div class="space-y-6">
  <form
    method="post"
    action="?/profile"
    novalidate
    use:enhance={() => {
      savingProfile = true;
      return async ({ update }) => {
        await update({ reset: false });
        savingProfile = false;
      };
    }}
  >
    <SettingsSection title="Perfil" description="Así te ven en comentarios, asignaciones y avisos.">
      <div class="flex items-start gap-4">
        <UserAvatar name={data.user.name} avatar={data.user.avatar} size="lg" />
        <div class="grid flex-1 gap-4 sm:grid-cols-2">
          <FormField id="name" label="Nombre" error={profileErrors.name}>
            {#snippet children({ describedBy, invalid })}
              <Input
                id="name"
                name="name"
                autocomplete="name"
                value={data.user.name}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
              />
            {/snippet}
          </FormField>
          <FormField id="email" label="Correo" hint="Lo cambia un admin de la organización.">
            {#snippet children({ describedBy })}
              <Input
                id="email"
                value={data.user.email}
                readonly
                class="text-muted-foreground"
                aria-describedby={describedBy}
              />
            {/snippet}
          </FormField>
        </div>
      </div>
      {#key data.user.avatar}
        <AvatarPicker
          personName={data.user.name}
          initial={data.user.avatar}
          error={profileErrors.avatar}
          class="mt-6"
        />
      {/key}
      <p class="mt-4 text-sm text-muted-foreground">
        Rol en la organización: {ORG_ROLE[data.user.orgRole].label}.
      </p>
      {#snippet footer()}
        <Button type="submit" size="sm" disabled={savingProfile}>Guardar</Button>
      {/snippet}
    </SettingsSection>
  </form>

  <form
    method="post"
    action="?/password"
    novalidate
    use:enhance={() => {
      savingPassword = true;
      return async ({ result, update }) => {
        await update({ reset: result.type === 'success' });
        savingPassword = false;
      };
    }}
  >
    <SettingsSection
      title="Contraseña"
      description="Al cambiarla, las demás sesiones abiertas se cierran."
    >
      <div class="grid max-w-md gap-4">
        <FormField id="current" label="Contraseña actual" error={passwordErrors.current}>
          {#snippet children({ describedBy, invalid })}
            <PasswordInput
              id="current"
              name="current"
              autocomplete="current-password"
              {invalid}
              {describedBy}
            />
          {/snippet}
        </FormField>
        <FormField
          id="password"
          label="Contraseña nueva"
          error={passwordErrors.password}
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
        <FormField id="confirm" label="Confirma la contraseña nueva" error={passwordErrors.confirm}>
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
      </div>
      {#snippet footer()}
        <Button type="submit" size="sm" disabled={savingPassword}>Cambiar contraseña</Button>
      {/snippet}
    </SettingsSection>
  </form>

  <SettingsSection
    title="Sesiones"
    description="Si usaste QA Reviewer en un equipo ajeno o perdiste uno, cierra todas las sesiones."
  >
    <Button type="button" variant="outline" size="sm" onclick={() => (everywhereOpen = true)}>
      <LogOut /> Cerrar sesión en todos los dispositivos
    </Button>
  </SettingsSection>
</div>

<ConfirmDialog
  bind:open={everywhereOpen}
  action="?/everywhere"
  title="Cerrar todas las sesiones"
  description="Sales también de este navegador. Los tokens de la skill siguen activos; revócalos en Tokens si hace falta."
  confirmLabel="Cerrar sesiones"
  destructive
/>
