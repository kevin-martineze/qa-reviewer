<script lang="ts">
  import { Check, ChevronsUpDown } from '@lucide/svelte';
  import { tick } from 'svelte';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import type { Project } from '$lib/api/types';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from '$lib/components/atoms/dropdown-menu';
  import { cn } from '$lib/utils/cn';

  interface Props {
    projects: Project[];
    currentId: string | null;
    collapsed: boolean;
  }

  let { projects, currentId, collapsed }: Props = $props();

  const current = $derived(projects.find((p) => p.id === currentId) ?? projects[0]);

  let form = $state<HTMLFormElement | null>(null);
  let selected = $state('');

  async function choose(id: string) {
    selected = id;
    // Espera a que el input oculto tenga el valor antes de enviar.
    await tick();
    form?.requestSubmit();
  }
</script>

<form
  bind:this={form}
  method="post"
  action="{resolve('/(app)/session')}?/project"
  use:enhance
  class="hidden"
>
  <input type="hidden" name="projectId" value={selected} />
  <input type="hidden" name="redirectTo" value={page.url.pathname + page.url.search} />
</form>

{#if current}
  <DropdownMenu>
    <DropdownMenuTrigger
      disabled={projects.length < 2}
      aria-label="Cambiar de proyecto"
      class={cn(
        'flex w-full items-center gap-2 rounded-md text-left text-sm transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-default disabled:hover:bg-transparent',
        collapsed ? 'size-9 justify-center' : 'h-10 px-2',
      )}
    >
      <span
        class="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground"
      >
        {current.name[0]}
      </span>
      {#if !collapsed}
        <span class="min-w-0 flex-1">
          <span class="block truncate font-medium">{current.name}</span>
          <span class="block truncate text-xs text-muted-foreground">{current.repo}</span>
        </span>
        {#if projects.length > 1}
          <ChevronsUpDown class="size-4 shrink-0 text-muted-foreground" />
        {/if}
      {/if}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" class="w-60">
      <DropdownMenuLabel>Proyectos</DropdownMenuLabel>
      {#each projects as project (project.id)}
        <DropdownMenuItem onSelect={() => choose(project.id)}>
          <span class="flex-1 truncate">{project.name}</span>
          {#if project.id === current.id}<Check class="size-4" />{/if}
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenu>
{/if}
