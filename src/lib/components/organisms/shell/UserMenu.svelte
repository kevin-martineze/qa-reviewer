<script lang="ts">
  import {
    Bell,
    Check,
    KeyRound,
    LogOut,
    Monitor,
    Moon,
    Sun,
    SunMoon,
    User as UserIcon,
    Users,
  } from '@lucide/svelte';
  import { tick } from 'svelte';
  import { resetMode, setMode, userPrefersMode } from 'mode-watcher';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import type { SessionUser } from '$lib/api/types';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from '$lib/components/atoms/dropdown-menu';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { ORG_ROLE } from '$lib/domain/labels';

  interface MockUser {
    id: string;
    name: string;
  }

  interface Props {
    user: SessionUser;
    roleLabel: string;
    isMock: boolean;
    mockUsers: MockUser[];
  }

  let { user, roleLabel, isMock, mockUsers }: Props = $props();

  let logoutForm = $state<HTMLFormElement | null>(null);
  let switchForm = $state<HTMLFormElement | null>(null);
  let switchTo = $state('');

  const here = $derived(page.url.pathname + page.url.search);

  async function switchUser(id: string) {
    switchTo = id;
    await tick();
    switchForm?.requestSubmit();
  }

  const THEMES = [
    { mode: 'light', label: 'Claro', icon: Sun },
    { mode: 'dark', label: 'Oscuro', icon: Moon },
    { mode: 'system', label: 'Sistema', icon: Monitor },
  ] as const;

  function applyTheme(mode: 'light' | 'dark' | 'system') {
    if (mode === 'system') resetMode();
    else setMode(mode);
  }
</script>

<form
  bind:this={logoutForm}
  method="post"
  action="{resolve('/(app)/session')}?/logout"
  class="hidden"
></form>
{#if isMock}
  <form
    bind:this={switchForm}
    method="post"
    action="{resolve('/(app)/session')}?/switchUser"
    use:enhance
    class="hidden"
  >
    <input type="hidden" name="userId" value={switchTo} />
    <input type="hidden" name="redirectTo" value={here} />
  </form>
{/if}

<DropdownMenu>
  <DropdownMenuTrigger
    class="flex items-center gap-2 rounded-md py-1 pr-2 pl-1 text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    aria-label="Menú de usuario"
  >
    <UserAvatar name={user.name} />
    <span class="hidden max-w-40 truncate font-medium md:inline">{user.name}</span>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" class="w-64">
    <DropdownMenuLabel class="font-normal">
      <p class="truncate text-sm font-medium">{user.name}</p>
      <p class="truncate text-xs text-muted-foreground">{user.email}</p>
      <p class="mt-1 text-xs text-muted-foreground">
        {ORG_ROLE[user.orgRole].label} · {roleLabel}
      </p>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem>
        {#snippet child({ props })}
          <a {...props} href={resolve('/settings/profile')}><UserIcon /> Perfil</a>
        {/snippet}
      </DropdownMenuItem>
      <DropdownMenuItem>
        {#snippet child({ props })}
          <a {...props} href={resolve('/settings/notifications')}><Bell /> Notificaciones</a>
        {/snippet}
      </DropdownMenuItem>
      <DropdownMenuItem>
        {#snippet child({ props })}
          <a {...props} href={resolve('/settings/tokens')}><KeyRound /> Tokens de la skill</a>
        {/snippet}
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoon /> Tema
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {#each THEMES as theme (theme.mode)}
          {@const Icon = theme.icon}
          <DropdownMenuItem onSelect={() => applyTheme(theme.mode)}>
            <Icon />
            {theme.label}
            {#if userPrefersMode.current === theme.mode}<Check class="ml-auto" />{/if}
          </DropdownMenuItem>
        {/each}
      </DropdownMenuSubContent>
    </DropdownMenuSub>

    {#if isMock}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Users /> Cambiar usuario (mock)
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="w-56">
          {#each mockUsers as u (u.id)}
            <DropdownMenuItem onSelect={() => switchUser(u.id)} disabled={u.id === user.id}>
              <UserAvatar name={u.name} size="xs" />
              <span class="flex-1 truncate">{u.name}</span>
              {#if u.id === user.id}<Check />{/if}
            </DropdownMenuItem>
          {/each}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    {/if}

    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={() => logoutForm?.requestSubmit()}>
      <LogOut /> Cerrar sesión
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
