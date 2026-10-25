<script lang="ts">
  import { Trash2 } from '@lucide/svelte';

  import type { ApiToken } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '$lib/components/atoms/table';
  import ConfirmDialog from '$lib/components/molecules/ConfirmDialog.svelte';
  import { formatRelative, formatShortDate } from '$lib/utils/dates';

  interface Props {
    tokens: ApiToken[];
    projectNames: Record<string, string>;
    now: Date;
  }

  let { tokens, projectNames, now }: Props = $props();

  let target = $state<ApiToken | null>(null);
  let open = $state(false);
</script>

<div class="overflow-hidden rounded-lg border">
  <Table class="min-w-xl">
    <TableHeader>
      <TableRow>
        <TableHead class="w-full">Token</TableHead>
        <TableHead>Proyecto</TableHead>
        <TableHead>Creado</TableHead>
        <TableHead>Último uso</TableHead>
        <TableHead><span class="sr-only">Acciones</span></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each tokens as token (token.id)}
        <TableRow>
          <TableCell class="max-w-0">
            <p class="truncate font-medium">{token.label}</p>
            <p class="font-mono text-xs text-muted-foreground">{token.prefix}…</p>
          </TableCell>
          <TableCell class="text-sm">{projectNames[token.project] ?? token.project}</TableCell>
          <TableCell class="text-xs whitespace-nowrap text-muted-foreground">
            {formatShortDate(token.createdAt, now)}
          </TableCell>
          <TableCell class="text-xs whitespace-nowrap text-muted-foreground">
            {token.lastUsedAt ? formatRelative(token.lastUsedAt, now) : 'Nunca'}
          </TableCell>
          <TableCell class="text-right">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Revocar {token.label}"
              onclick={() => {
                target = token;
                open = true;
              }}
            >
              <Trash2 />
            </Button>
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>

<ConfirmDialog
  bind:open
  action="?/revoke"
  title="Revocar «{target?.label}»"
  description="La skill que use este token deja de poder publicar revisiones. No se puede deshacer: tendrás que crear otro."
  confirmLabel="Revocar"
  destructive
>
  {#snippet fields()}
    <input type="hidden" name="id" value={target?.id ?? ''} />
  {/snippet}
</ConfirmDialog>
