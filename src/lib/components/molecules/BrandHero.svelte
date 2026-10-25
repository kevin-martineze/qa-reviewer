<script lang="ts">
  import { asset } from '$app/paths';

  import BrandMark from '$lib/components/molecules/BrandMark.svelte';
</script>

<!-- Ilustración y mensaje de marca del panel lateral de las pantallas públicas. -->
<img
  src={asset('/brand/login-hero.webp')}
  alt=""
  aria-hidden="true"
  width="720"
  height="964"
  class="absolute inset-0 size-full object-cover"
/>
<div class="relative flex h-full flex-col justify-between p-10">
  <div class="flex items-center gap-2 text-sm font-semibold">
    <BrandMark />
    QA Reviewer
  </div>
  <div class="max-w-sm space-y-2">
    <p class="text-xl font-semibold text-balance">
      Cada pantalla revisada antes de llegar a producción.
    </p>
    <p class="text-sm text-muted-foreground">
      Capturas por ronda, comparación con develop y comentarios sobre el componente exacto.
    </p>
  </div>
</div>
