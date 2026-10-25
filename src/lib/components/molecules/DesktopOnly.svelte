<script lang="ts">
  import { Monitor } from '@lucide/svelte';

  import BrandMark from '$lib/components/molecules/BrandMark.svelte';
</script>

<div class="flex h-dvh flex-col items-center justify-center gap-4 bg-background p-8 text-center">
  <BrandMark class="size-10" />
  <div class="flex size-12 items-center justify-center rounded-full border bg-muted/50">
    <Monitor class="size-6 text-muted-foreground" aria-hidden="true" />
  </div>
  <h1 class="text-lg font-semibold text-foreground">Disponible solo en computador</h1>
  <p class="max-w-sm text-sm text-muted-foreground">
    QA Reviewer está pensado para pantallas de al menos 1024 px. Ábrelo desde un computador o amplía
    la ventana.
  </p>
</div>
