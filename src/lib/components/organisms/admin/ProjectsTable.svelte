<script lang="ts">
  import { Settings } from '@lucide/svelte';

  import { resolve } from '$app/paths';

  import type { Project } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '$lib/components/atoms/table';
  import { STRATEGY } from '$lib/domain/labels';

  interface Props {
    projects: Array<Project & { members: number }>;
  }

  let { projects }: Props = $props();
</script>

<div class="overflow-x-auto rounded-lg border">
  <Table class="min-w-3xl">
    <TableHeader>
      <TableRow>
        <TableHead class="w-full">Proyecto</TableHead>
        <TableHead>Repositorio</TableHead>
        <TableHead>Plane</TableHead>
        <TableHead>Asignación</TableHead>
        <TableHead class="text-right">Miembros</TableHead>
        <TableHead class="text-right">Revisiones</TableHead>
        <TableHead><span class="sr-only">Acciones</span></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each projects as project (project.id)}
        <TableRow>
          <TableCell class="max-w-0">
            <p class="truncate font-medium">{project.name}</p>
            <p class="truncate font-mono text-xs text-muted-foreground">{project.id}</p>
          </TableCell>
          <TableCell class="font-mono text-xs whitespace-nowrap">
            {project.repo || '—'}
          </TableCell>
          <TableCell class="font-mono text-xs">{project.planeKey || '—'}</TableCell>
          <TableCell class="whitespace-nowrap">{STRATEGY[project.strategy].label}</TableCell>
          <TableCell class="text-right tabular-nums">{project.members}</TableCell>
          <TableCell class="text-right tabular-nums">{project.reviewsCount}</TableCell>
          <TableCell>
            <Button
              href={resolve('/(app)/projects/[slug]/settings', { slug: project.id })}
              variant="ghost"
              size="sm"
              aria-label="Configurar {project.name}"
            >
              <Settings /> Configurar
            </Button>
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>
