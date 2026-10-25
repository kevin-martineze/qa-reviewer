<script lang="ts">
  import type { Snippet } from 'svelte';

  import { enhance } from '$app/forms';

  import { Button } from '$lib/components/atoms/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '$lib/components/atoms/dialog';

  interface Props {
    open: boolean;
    title: string;
    description?: string;
    /** URL de la form action, p. ej. `?/revoke`. */
    action: string;
    confirmLabel: string;
    destructive?: boolean;
    /** Inputs ocultos con los ids y campos extra del diálogo. */
    fields?: Snippet;
  }

  let {
    open = $bindable(false),
    title,
    description,
    action,
    confirmLabel,
    destructive = false,
    fields,
  }: Props = $props();

  let sending = $state(false);
</script>

<Dialog bind:open>
  <DialogContent class="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      {#if description}<DialogDescription>{description}</DialogDescription>{/if}
    </DialogHeader>
    <form
      method="post"
      {action}
      class="space-y-4"
      use:enhance={() => {
        sending = true;
        return async ({ update }) => {
          await update();
          sending = false;
          open = false;
        };
      }}
    >
      {#if fields}{@render fields()}{/if}
      <DialogFooter>
        <Button type="button" variant="ghost" onclick={() => (open = false)}>Cancelar</Button>
        <Button type="submit" variant={destructive ? 'destructive' : 'default'} disabled={sending}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
