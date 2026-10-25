<script lang="ts">
  import '../app.css';
  import '@fontsource-variable/geist';
  import '@fontsource-variable/geist-mono';
  import type { Snippet } from 'svelte';
  import { ModeWatcher } from 'mode-watcher';

  import { asset } from '$app/paths';
  import { page } from '$app/state';
  import { Toaster } from '$lib/components/atoms/sonner';
  import { TooltipProvider } from '$lib/components/atoms/tooltip';
  import DesktopOnly from '$lib/components/molecules/DesktopOnly.svelte';

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();

  const title = $derived(page.data.meta?.title);
  // Vista previa al compartir un enlace (Slack, WhatsApp, GitHub): exige URL absoluta.
  const ogImage = $derived(new URL(asset('/brand/og.jpg'), page.url).href);
</script>

<svelte:head>
  <title>{title ? `${title} · QA Reviewer` : 'QA Reviewer'}</title>
  <meta property="og:site_name" content="QA Reviewer" />
  <meta property="og:title" content={title ?? 'QA Reviewer'} />
  <meta
    property="og:description"
    content="Revisión de diseño de cada pantalla antes de llegar a producción."
  />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<TooltipProvider delayDuration={300}>
  <!-- Bajo lg (1024 px) no hay pantallas: solo el aviso. CSS puro, sin JS, para que el SSR no parpadee. -->
  <div class="lg:hidden">
    <DesktopOnly />
  </div>
  <div class="hidden lg:contents">
    {@render children()}
  </div>
</TooltipProvider>
<!-- Claro por defecto; quien elija oscuro o «sistema» en el menú lo conserva (localStorage). -->
<ModeWatcher defaultMode="light" />
<Toaster />
