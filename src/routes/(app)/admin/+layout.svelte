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
    { key: 'users', label: 'Usuarios', href: resolve('/admin/users') },
    { key: 'projects', label: 'Proyectos', href: resolve('/admin/projects') },
    { key: 'roles', label: 'Roles', href: resolve('/admin/roles') },
    { key: 'audit', label: 'Auditoría', href: resolve('/admin/audit') },
  ]);
  const currentNav = $derived(page.data.meta?.tab ?? 'users');
</script>

<SettingsTemplate title="Organización" {nav} {currentNav}>
  {@render children()}
</SettingsTemplate>
