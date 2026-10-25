<script lang="ts">
  import { ScanEye } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  import type { LayoutData } from './$types';

  import { page } from '$app/state';

  import { toast } from '$lib/components/atoms/sonner';
  import NotificationBell from '$lib/components/organisms/shell/NotificationBell.svelte';
  import ProjectSelector from '$lib/components/organisms/shell/ProjectSelector.svelte';
  import SidebarNav from '$lib/components/organisms/shell/SidebarNav.svelte';
  import UserMenu from '$lib/components/organisms/shell/UserMenu.svelte';
  import AppShell from '$lib/components/templates/AppShell.svelte';
  import { PROJECT_ROLE } from '$lib/domain/labels';
  import { projectRoleOf } from '$lib/domain/permissions';
  import { formFeedback } from '$lib/utils/form-feedback';

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  const crumbs = $derived(page.data.meta?.crumbs ?? []);
  const now = $derived(new Date(data.now));
  const role = $derived(data.projectId ? projectRoleOf(data.user, data.projectId) : undefined);
  const roleLabel = $derived(
    role ? PROJECT_ROLE[role].label : data.user.orgRole === 'member' ? 'Sin rol' : 'Admin',
  );

  // Resultado de cualquier form action de la app: un toast, sin código en cada página.
  $effect(() => {
    const feedback = formFeedback(page.form);
    if (!feedback) return;
    if (feedback.kind === 'error') toast.error(feedback.text);
    else toast.success(feedback.text);
  });

  function persistSidebar(collapsed: boolean) {
    document.cookie = `qa_sidebar=${collapsed ? '1' : '0'}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }
</script>

{#snippet sidebar(collapsed: boolean)}
  <div class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
    <span
      class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
    >
      <ScanEye class="size-4" />
    </span>
    {#if !collapsed}<span class="text-sm font-semibold">QA Reviewer</span>{/if}
  </div>
  <div class="p-2">
    <ProjectSelector projects={data.projects} currentId={data.projectId} {collapsed} />
  </div>
  <SidebarNav
    permissions={data.permissions}
    projectId={data.projectId}
    {collapsed}
    inboxCount={data.inboxCount}
  />
{/snippet}

{#snippet topbar()}
  <NotificationBell recent={data.recentNotifications} unread={data.unread} {now} />
  <UserMenu user={data.user} {roleLabel} isMock={data.isMock} mockUsers={data.mockUsers} />
{/snippet}

<AppShell {sidebar} {topbar} {crumbs} collapsed={data.sidebarCollapsed} onToggle={persistSidebar}>
  {@render children()}
</AppShell>
