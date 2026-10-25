<script lang="ts">
  import { untrack, type Snippet } from 'svelte';

  import { page } from '$app/state';
  import type { LayoutData } from './$types';

  import SidebarNav from '$lib/components/organisms/shell/SidebarNav.svelte';
  import ProjectSelector from '$lib/components/organisms/shell/ProjectSelector.svelte';
  import NotificationBell from '$lib/components/organisms/shell/NotificationBell.svelte';
  import UserMenu from '$lib/components/organisms/shell/UserMenu.svelte';
  import AppShell from '$lib/components/templates/AppShell.svelte';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  let currentProjectId = $state(untrack(() => data.projects[0]?.id ?? 'lideris'));

  const crumbs = $derived(page.data.meta?.crumbs ?? []);
</script>

{#snippet sidebar()}
  <div class="space-y-2 p-2">
    <ProjectSelector
      projects={data.projects}
      currentId={currentProjectId}
      onSelect={(id) => (currentProjectId = id)}
    />
    <SidebarNav permissions={data.permissions} {currentProjectId} />
  </div>
{/snippet}

{#snippet topbar()}
  <NotificationBell notifications={data.notifications} unread={data.unread} />
  <UserMenu user={data.user} isMock={data.isMock} mockUsers={data.mockUsers} />
{/snippet}

<AppShell {sidebar} {topbar} {crumbs} collapsed={data.collapsed}>
  {@render children()}
</AppShell>
