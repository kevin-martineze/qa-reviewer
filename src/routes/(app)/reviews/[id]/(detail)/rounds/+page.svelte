<script lang="ts">
  import { CircleCheck, CircleDot, TriangleAlert, Upload } from '@lucide/svelte';

  import type { PageData } from './$types';

  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { nameOf, personOf } from '$lib/domain/people';
  import { verdictCounts } from '$lib/domain/verdicts';
  import { cn } from '$lib/utils/cn';
  import { formatDateTime } from '$lib/utils/dates';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const review = $derived(data.review);
  // La más reciente arriba.
  const rounds = $derived([...review.rounds].sort((a, b) => b.n - a.n));
  const titleOf = (key: string) => review.screens.find((s) => s.key === key)?.title ?? key;
</script>

<ol class="max-w-3xl space-y-6">
  {#each rounds as round (round.n)}
    {@const current = round.n === review.round}
    {@const counts = round.submission
      ? { approved: round.submission.approved, changes: round.submission.changes, pending: 0 }
      : verdictCounts(review.screens.map((s) => s.verdict))}
    <li class="relative pl-8">
      <span
        class={cn(
          'absolute top-0.5 left-0 flex size-6 items-center justify-center rounded-full border bg-background',
          current && 'border-primary text-primary',
        )}
      >
        <CircleDot class="size-3.5" />
      </span>
      <div class="space-y-3 rounded-lg border p-4">
        <header class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-sm font-semibold">
            Ronda {round.n}
            {#if current}<span class="ml-1 text-xs font-normal text-muted-foreground">(actual)</span
              >{/if}
          </h2>
          <span class="text-xs text-muted-foreground">{formatDateTime(round.createdAt)}</span>
        </header>

        <div class="flex items-start gap-2 text-sm">
          <Upload class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div class="space-y-1">
            <p>
              <strong class="font-medium">{nameOf(data.people, round.by)}</strong>
              {round.n === 1 ? 'publicó' : 'subió cambios en'}
              {round.changed.length}
              {round.changed.length === 1 ? 'pantalla' : 'pantallas'}.
            </p>
            {#if round.note}<p class="text-muted-foreground">«{round.note}»</p>{/if}
            {#if round.n > 1}
              <ul class="flex flex-wrap gap-1 pt-1">
                {#each round.changed as key (key)}
                  <li class="rounded-sm bg-muted px-1.5 py-0.5 text-xs">
                    <span class="font-mono uppercase">{key}</span> · {titleOf(key)}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>

        {#if round.submission}
          {@const s = round.submission}
          <div class="flex items-start gap-2 border-t pt-3 text-sm">
            {#if s.result === 'approved'}
              <CircleCheck class="mt-0.5 size-4 shrink-0 text-success" />
            {:else}
              <TriangleAlert class="mt-0.5 size-4 shrink-0 text-warning" />
            {/if}
            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <UserAvatar {...personOf(data.people, s.by)} size="xs" />
                <strong class="font-medium">{nameOf(data.people, s.by)}</strong>
                {s.result === 'approved' ? 'aprobó' : 'pidió ajustes'}
                <span class="text-xs text-muted-foreground">{formatDateTime(s.createdAt)}</span>
              </div>
              {#if s.body}<p class="text-muted-foreground">«{s.body}»</p>{/if}
            </div>
          </div>
        {/if}

        <div class="flex flex-wrap gap-2 text-xs">
          <ToneBadge tone="success">{counts.approved} aprobadas</ToneBadge>
          {#if counts.changes}<ToneBadge tone="warning">{counts.changes} con ajuste</ToneBadge>{/if}
          {#if counts.pending}<ToneBadge tone="muted">{counts.pending} sin veredicto</ToneBadge
            >{/if}
        </div>
      </div>
    </li>
  {/each}
</ol>
