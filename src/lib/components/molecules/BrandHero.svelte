<script lang="ts">
  import { asset } from '$app/paths';

  import BrandMark from '$lib/components/molecules/BrandMark.svelte';
</script>

<!-- Ilustración y mensaje de marca del panel lateral de las pantallas públicas. -->
<div class="flex h-full flex-col gap-6 p-10">
  <div class="flex items-center gap-2 text-sm font-semibold">
    <BrandMark />
    QA Reviewer
  </div>
  <div class="flex min-h-0 flex-1 items-center justify-center">
    <!-- 1024 px reales: a 2x se ve nítida hasta 512 px de ancho, por eso el tope max-w-lg.
         Fondo transparente: el panel pone el color, así no aparece el borde de la imagen. -->
    <img
      src={asset('/brand/login-hero.webp')}
      alt=""
      aria-hidden="true"
      width="1024"
      height="1024"
      class="max-h-full w-full max-w-lg object-contain"
    />
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
