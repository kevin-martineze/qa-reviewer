<script lang="ts">
  import { History, ImageOff, MessageSquare, MessageSquareWarning } from '@lucide/svelte';

  import { resolve } from '$app/paths';

  import type { Screen } from '$lib/api/types';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import { VERDICT } from '$lib/domain/labels';

  interface Props {
    reviewId: string;
    screen: Screen;
    round: number;
    /** Comentarios abiertos de la pantalla. */
    openComments: number;
    /** Comentarios de rondas anteriores que esperan «¿Quedó resuelto?». */
    followUps: number;
  }

  let { reviewId, screen, round, openComments, followUps }: Props = $props();

  const verdict = $derived(VERDICT[screen.verdict]);
  const changedNow = $derived(round > 1 && screen.changedIn === round);
</script>

<a
  href={resolve('/(app)/reviews/[id]/screens/[key]', { id: reviewId, key: screen.key })}
  class="group flex w-full flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
>
  <div class="relative aspect-video border-b bg-muted">
    {#if screen.img}
      <img
        src={screen.img}
        alt="Captura: {screen.title}"
        loading="lazy"
        class="absolute inset-0 size-full object-cover object-top"
      />
    {:else}
      <div class="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <ImageOff class="size-6" />
      </div>
    {/if}
    {#if changedNow}
      <span
        class="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-info px-2 py-0.5 text-2xs font-semibold text-info-foreground shadow-sm"
      >
        <History class="size-3" /> Cambió en ronda {round}
      </span>
    {/if}
  </div>

  <div class="flex flex-1 flex-col gap-2 p-3">
    <div class="flex items-start justify-between gap-2">
      <p class="min-w-0 text-sm font-medium group-hover:underline">
        <span class="mr-1 font-mono text-xs text-muted-foreground uppercase">{screen.key}</span>
        {screen.title}
      </p>
      <ToneBadge tone={verdict.tone}>{verdict.label}</ToneBadge>
    </div>
    <p class="line-clamp-2 text-xs text-muted-foreground">{screen.lead}</p>
    <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span class="font-mono">{screen.viewport}</span>
      {#if screen.inherited && round > 1}
        <span>Veredicto de la ronda {screen.changedIn}</span>
      {/if}
      {#if openComments}
        <span class="inline-flex items-center gap-1">
          <MessageSquare class="size-3" />{openComments}
        </span>
      {/if}
      {#if followUps}
        <span class="inline-flex items-center gap-1 text-warning">
          <MessageSquareWarning class="size-3" />
          {followUps === 1 ? '1 por confirmar' : `${followUps} por confirmar`}
        </span>
      {/if}
    </div>
  </div>
</a>
