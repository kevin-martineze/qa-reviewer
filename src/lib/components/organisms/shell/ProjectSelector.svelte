<script lang="ts">
  import { ChevronsUpDown } from '@lucide/svelte';

  import type { Project } from '$lib/api/types';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from '$lib/components/atoms/dropdown-menu';

  interface Props {
    projects: Project[];
    currentId: string;
    onSelect: (id: string) => void;
  }

  let { projects, currentId, onSelect }: Props = $props();

  const current = $derived(projects.find((p) => p.id === currentId) ?? projects[0]);
</script>

{#if projects.length > 1 && current}
  <DropdownMenu>
    <DropdownMenuTrigger
      class="flex w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none"
    >
      <span class="truncate">{current.name}</span>
      <ChevronsUpDown class="size-4 shrink-0 text-muted-foreground" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" class="w-52">
      <DropdownMenuLabel>Proyectos</DropdownMenuLabel>
      {#each projects as project (project.id)}
        <DropdownMenuItem onclick={() => onSelect(project.id)}>
          {project.name}
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenu>
{/if}
