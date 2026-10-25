<script lang="ts">
  import { CircleHelp, ListChecks } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { resolve } from '$app/paths';

  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import { VERDICT } from '$lib/domain/labels';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const review = $derived(data.review);
  const questions = $derived(review.screens.filter((s) => s.questions.length));
</script>

<div class="grid max-w-6xl gap-8 xl:grid-cols-[1fr_22rem]">
  <div class="space-y-8">
    <section aria-labelledby="flow">
      <h2 id="flow" class="mb-3 text-sm font-semibold">El flujo</h2>
      {#if review.summary.steps.length}
        <ol class="grid gap-3 sm:grid-cols-2">
          {#each review.summary.steps as step, i (step.title)}
            <li class="flex gap-3 rounded-lg border p-3">
              <span
                class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground tabular-nums"
              >
                {i + 1}
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium">{step.title}</p>
                <p class="text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          {/each}
        </ol>
      {:else}
        <EmptyState
          title="Sin resumen del flujo"
          description="La skill no envió pasos para esta revisión."
          class="py-8"
        />
      {/if}
    </section>

    <section aria-labelledby="per-screen">
      <h2 id="per-screen" class="mb-3 text-sm font-semibold">Qué cambia en cada pantalla</h2>
      <ol class="divide-y rounded-lg border">
        {#each review.screens as screen (screen.key)}
          <li class="flex gap-4 p-4">
            <span class="w-5 shrink-0 font-mono text-xs text-muted-foreground uppercase">
              {screen.key}
            </span>
            <div class="min-w-0 flex-1 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <a
                  href={resolve('/(app)/reviews/[id]/screens/[key]', {
                    id: review.id,
                    key: screen.key,
                  })}
                  class="text-sm font-medium hover:underline"
                >
                  {screen.title}
                </a>
                <ToneBadge tone={VERDICT[screen.verdict].tone}>
                  {VERDICT[screen.verdict].label}
                </ToneBadge>
              </div>
              {#if screen.changes.length}
                <ul class="list-disc space-y-0.5 pl-4 text-sm text-muted-foreground">
                  {#each screen.changes as change (change)}
                    <li>{change}</li>
                  {/each}
                </ul>
              {:else}
                <p class="text-sm text-muted-foreground">{screen.lead}</p>
              {/if}
            </div>
          </li>
        {/each}
      </ol>
    </section>
  </div>

  <aside class="space-y-6">
    <section aria-labelledby="rules" class="rounded-lg border p-4">
      <h2 id="rules" class="mb-2 flex items-center gap-2 text-sm font-semibold">
        <ListChecks class="size-4 text-muted-foreground" /> Reglas de negocio
      </h2>
      {#if review.summary.rules.length}
        <ul class="space-y-1.5 text-sm">
          {#each review.summary.rules as rule (rule)}
            <li class="flex gap-2"><span class="text-muted-foreground">·</span>{rule}</li>
          {/each}
        </ul>
      {:else}
        <p class="text-sm text-muted-foreground">No se declararon reglas.</p>
      {/if}
    </section>

    {#if questions.length}
      <section aria-labelledby="questions" class="rounded-lg border p-4">
        <h2 id="questions" class="mb-2 flex items-center gap-2 text-sm font-semibold">
          <CircleHelp class="size-4 text-muted-foreground" /> Preguntas del autor
        </h2>
        <ul class="space-y-3 text-sm">
          {#each questions as screen (screen.key)}
            <li>
              <p class="text-xs text-muted-foreground">
                <span class="font-mono uppercase">{screen.key}</span> · {screen.title}
              </p>
              {#each screen.questions as q (q)}<p>{q}</p>{/each}
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </aside>
</div>
