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
  class="flex h-full min-h-0 flex-col items-center justify-center overflow-y-auto p-6"
>
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {#if description}
        <CardDescription>{description}</CardDescription>
      {/if}
    </CardHeader>
    <CardContent>{@render children()}</CardContent>
    {#if footer}
      <CardFooter>{@render footer()}</CardFooter>
    {/if}
  </Card>
</div>
