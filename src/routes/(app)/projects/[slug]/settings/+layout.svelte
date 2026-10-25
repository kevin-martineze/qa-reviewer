<script lang="ts">
  import type { Snippet } from 'svelte';

  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import type { LayoutData } from './$types';

  import SettingsTemplate from '$lib/components/templates/SettingsTemplate.svelte';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  const slug = $derived(data.project.id);
  const nav = $derived([
    {
      key: 'general',
      label: 'General',
      href: resolve('/(app)/projects/[slug]/settings', { slug }),
    },
    {
      key: 'members',
      label: 'Miembros',
      href: resolve('/(app)/projects/[slug]/settings/members', { slug }),
    },
    {
      key: 'assignment',
      label: 'Asignación',
      href: resolve('/(app)/projects/[slug]/settings/assignment', { slug }),
    },
    { key: 'sla', label: 'SLA', href: resolve('/(app)/projects/[slug]/settings/sla', { slug }) },
    {
      key: 'integrations',
      label: 'Integraciones',
      href: resolve('/(app)/projects/[slug]/settings/integrations', { slug }),
    },
    {
      key: 'rules',
      label: 'Reglas',
      href: resolve('/(app)/projects/[slug]/settings/rules', { slug }),
    },
  ]);
  const currentNav = $derived(page.data.meta?.tab ?? 'general');
</script>

<SettingsTemplate title={data.project.name} {nav} {currentNav}>
  {@render children()}
</SettingsTemplate>
