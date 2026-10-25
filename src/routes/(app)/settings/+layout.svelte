<script lang="ts">
  import type { Snippet } from 'svelte';

  import { page } from '$app/state';
  import { resolve } from '$app/paths';

  import SettingsTemplate from '$lib/components/templates/SettingsTemplate.svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const nav = $derived([
    { key: 'profile', label: 'Perfil', href: resolve('/settings/profile') },
    { key: 'notifications', label: 'Notificaciones', href: resolve('/settings/notifications') },
    { key: 'tokens', label: 'Tokens', href: resolve('/settings/tokens') },
  ]);
  const currentNav = $derived(page.data.meta?.tab ?? 'profile');
</script>

<SettingsTemplate title="Cuenta" {nav} {currentNav}>
  {@render children()}
</SettingsTemplate>
