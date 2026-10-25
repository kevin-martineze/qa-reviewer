<script lang="ts">
  import { ScanEye } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '$lib/components/atoms/card';

  interface Props {
    title: string;
    description?: string;
    footer?: Snippet;
    children: Snippet;
  }

  let { title, description, footer, children }: Props = $props();
</script>

<div
  data-scroll
  class="flex h-dvh min-h-0 flex-col items-center justify-center gap-6 overflow-y-auto bg-muted/40 p-6"
>
  <div class="flex items-center gap-2 text-sm font-semibold">
    <span
      class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
    >
      <ScanEye class="size-4" />
    </span>
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
