<script lang="ts">
  import { Info } from '@lucide/svelte';

  import { Button } from '$lib/components/atoms/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '$lib/components/atoms/dialog';
  import CopyButton from '$lib/components/molecules/CopyButton.svelte';

  interface Props {
    open: boolean;
    email: string;
    url: string;
    /** El enlace reemplaza a uno anterior, que ya no funciona. */
    renewed?: boolean;
  }

  let { open = $bindable(false), email, url, renewed = false }: Props = $props();
</script>

<Dialog bind:open>
  <DialogContent class="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>{renewed ? 'Enlace nuevo' : 'Invitación creada'}</DialogTitle>
      <DialogDescription>
        Copia el enlace y envíaselo a <span class="font-medium text-foreground">{email}</span> por el
        canal que uses. Vale 7 días y sirve una sola vez.
      </DialogDescription>
    </DialogHeader>
    <div class="space-y-3">
      <div class="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
        <code class="min-w-0 flex-1 truncate font-mono text-sm" data-testid="invite-link">
          {url}
        </code>
        <CopyButton text={url} size="xs" successMessage="Enlace copiado." />
      </div>
      <p class="flex items-start gap-2 text-sm text-muted-foreground">
        <Info class="mt-0.5 size-4 shrink-0" />
        {#if renewed}
          El enlace anterior ya no funciona. Este no se vuelve a mostrar: si lo pierdes, pide otro
          desde la lista de invitaciones.
        {:else}
          Este enlace no se vuelve a mostrar. Si lo pierdes, pide uno nuevo desde la lista de
          invitaciones.
        {/if}
      </p>
    </div>
    <DialogFooter>
      <Button type="button" onclick={() => (open = false)}>Ya lo copié</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
