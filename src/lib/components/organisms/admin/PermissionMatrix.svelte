<script lang="ts">
  import { Check, Minus } from '@lucide/svelte';

  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '$lib/components/atoms/table';
  import { PERMISSIONS } from '$lib/domain/permissions';
  import type { RoleColumn } from '$lib/domain/role-matrix';

  interface Props {
    columns: RoleColumn[];
    caption: string;
  }

  let { columns, caption }: Props = $props();
</script>

<div class="overflow-hidden rounded-lg border">
  <Table class="min-w-2xl">
    <caption class="sr-only">{caption}</caption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-full">Permiso</TableHead>
        {#each columns as col (col.key)}
          <TableHead class="text-center" title={col.description}>{col.label}</TableHead>
        {/each}
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each PERMISSIONS as perm (perm.key)}
        <TableRow>
          <TableCell>
            <span class="block">{perm.label}</span>
            <code class="text-2xs text-muted-foreground">{perm.key}</code>
          </TableCell>
          {#each columns as col (col.key)}
            <TableCell class="text-center">
              {#if col.grants.has(perm.key)}
                <Check class="mx-auto size-4 text-success" aria-label="Sí" />
              {:else}
                <Minus class="mx-auto size-4 text-muted-foreground/40" aria-label="No" />
              {/if}
            </TableCell>
          {/each}
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>
