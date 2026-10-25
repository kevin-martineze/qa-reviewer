<script lang="ts">
  import { TriangleAlert } from '@lucide/svelte';

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
    label: string;
    secret: string;
  }

  let { open = $bindable(false), label, secret }: Props = $props();
</script>

<Dialog bind:open>
  <DialogContent class="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Token «{label}» creado</DialogTitle>
      <DialogDescription>
        Cópialo ahora y pégalo cuando la skill lo pida. Al cerrar este diálogo no se vuelve a
        mostrar.
      </DialogDescription>
    </DialogHeader>
    <div class="space-y-3">
      <div class="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
        <code class="min-w-0 flex-1 truncate font-mono text-sm" data-testid="token-secret">
          {secret}
        </code>
        <CopyButton text={secret} size="xs" successMessage="Token copiado." />
      </div>
      <p class="text-sm text-muted-foreground">
        En la terminal del proyecto: <code class="font-mono">/design-review login</code> y pega el token.
      </p>
      <p class="flex items-start gap-2 text-sm text-warning">
        <TriangleAlert class="mt-0.5 size-4 shrink-0" />
        No lo subas al repositorio ni lo compartas: publica revisiones a tu nombre.
      </p>
    </div>
    <DialogFooter>
      <Button type="button" onclick={() => (open = false)}>Ya lo copié</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
