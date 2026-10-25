<script lang="ts">
  import type { Snippet } from 'svelte';

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '$lib/components/atoms/card';
  import BrandHero from '$lib/components/molecules/BrandHero.svelte';
  import BrandMark from '$lib/components/molecules/BrandMark.svelte';

  interface Props {
    title: string;
    description?: string;
    footer?: Snippet;
    children: Snippet;
  }

  let { title, description, footer, children }: Props = $props();
</script>

<div class="flex h-dvh min-h-0">
  <!-- Panel de marca: siempre oscuro (la ilustración lo es); `dark` hace que los tokens resuelvan claros. -->
  <aside
    class="dark relative hidden w-5/12 max-w-2xl shrink-0 overflow-hidden bg-background text-foreground lg:block"
  >
    <BrandHero />
  </aside>

  <div
    data-scroll
    class="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto bg-muted/40 p-6"
  >
    <div class="flex items-center gap-2 text-sm font-semibold lg:hidden">
      <BrandMark />
      QA Reviewer
    </div>
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-lg">{title}</CardTitle>
        {#if description}
          <CardDescription>{description}</CardDescription>
        {/if}
      </CardHeader>
      <CardContent>{@render children()}</CardContent>
      {#if footer}
        <CardFooter class="justify-center text-sm text-muted-foreground"
          >{@render footer()}</CardFooter
        >
      {/if}
    </Card>
  </div>
</div>
