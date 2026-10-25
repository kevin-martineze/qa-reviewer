<script lang="ts">
  import {
    Bell,
    Check,
    KeyRound,
    LogOut,
    Monitor,
    Moon,
    RefreshCw,
    Sun,
    SunMoon,
    User as UserIcon,
  } from '@lucide/svelte';
  import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
  import { untrack } from 'svelte';

  import { resolve } from '$app/paths';
  import type { SessionUser } from '$lib/api/types';
  import { Avatar, AvatarFallback } from '$lib/components/atoms/avatar';
  import { Button } from '$lib/components/atoms/button';
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

  interface MockUser {
    id: string;
    name: string;
  }

  interface Props {
    user: SessionUser;
    isMock: boolean;
    mockUsers: MockUser[];
  }

  let { user, isMock, mockUsers }: Props = $props();

  const initials = $derived(
    user.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );

  const themeLabel = $derived(
    userPrefersMode.current === 'light'
      ? 'Claro'
      : userPrefersMode.current === 'dark'
        ? 'Oscuro'
        : 'Sistema',
  );

  let selectedId = $state(untrack(() => user.id));
</script>

<DropdownMenu>
  <DropdownMenuTrigger
    class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none"
  >
    <Avatar class="size-7">
      <AvatarFallback class="text-xs">{initials}</AvatarFallback>
    </Avatar>
    <span class="hidden max-w-40 truncate text-sm font-medium md:inline">{user.name}</span>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" class="w-56">
    <DropdownMenuLabel>
      <p class="text-sm font-medium">{user.name}</p>
      <p class="text-xs font-normal text-muted-foreground">{user.email}</p>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem>
        {#snippet child({ props })}
          <a href={resolve('/settings/profile')} {...props}><UserIcon class="size-4" /> Perfil</a>
        {/snippet}
      </DropdownMenuItem>
      <DropdownMenuItem>
        {#snippet child({ props })}
          <a href={resolve('/settings/notifications')} {...props}
            ><Bell class="size-4" /> Notificaciones</a
          >
        {/snippet}
      </DropdownMenuItem>
      <DropdownMenuItem>
        {#snippet child({ props })}
          <a href={resolve('/settings/tokens')} {...props}><KeyRound class="size-4" /> Tokens</a>
        {/snippet}
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoon class="size-4" /> Tema
        <span class="ml-auto text-xs text-muted-foreground">{themeLabel}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onclick={() => setMode('light')}>
          <Sun class="size-4" /> Claro
          {#if userPrefersMode.current === 'light'}<Check class="ml-auto size-4" />{/if}
        </DropdownMenuItem>
        <DropdownMenuItem onclick={() => setMode('dark')}>
          <Moon class="size-4" /> Oscuro
          {#if userPrefersMode.current === 'dark'}<Check class="ml-auto size-4" />{/if}
        </DropdownMenuItem>
        <DropdownMenuItem onclick={() => resetMode()}>
          <Monitor class="size-4" /> Sistema
          {#if userPrefersMode.current === 'system'}<Check class="ml-auto size-4" />{/if}
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>

    {#if isMock}
      <DropdownMenuSeparator />
      <div class="px-1.5 py-1">
        <p class="flex items-center gap-1.5 px-1.5 py-1 text-xs font-medium text-muted-foreground">
          <RefreshCw class="size-4" /> Cambiar usuario (mock)
        </p>
        <form method="post" action={resolve('/api/switch-user')} class="space-y-1.5 px-1.5 pt-1">
          <select
            name="userId"
            bind:value={selectedId}
            class="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            {#each mockUsers as u (u.id)}
              <option value={u.id}>{u.name}</option>
            {/each}
          </select>
          <Button type="submit" variant="outline" size="sm" class="w-full">Cambiar</Button>
        </form>
      </div>
    {/if}

    <DropdownMenuSeparator />
    <form method="post" action={resolve('/logout')}>
      <DropdownMenuItem>
        {#snippet child({ props })}
          <button type="submit" class="w-full" {...props}
            ><LogOut class="size-4" /> Cerrar sesión</button
          >
        {/snippet}
      </DropdownMenuItem>
    </form>
  </DropdownMenuContent>
</DropdownMenu>
