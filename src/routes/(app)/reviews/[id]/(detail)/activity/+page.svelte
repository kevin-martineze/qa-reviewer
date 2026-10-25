<script lang="ts">
  import type { PageData } from './$types';

  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import { TONE_CLASS } from '$lib/components/molecules/tone';
  import { ACTIVITY_ICON } from '$lib/components/organisms/review/activity-icons';
  import { ACTIVITY_TYPE } from '$lib/domain/labels';
  import { nameOf } from '$lib/domain/people';
  import { cn } from '$lib/utils/cn';
  import { formatTime } from '$lib/utils/dates';
  import { groupByDay } from '$lib/utils/group-by-day';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
  const groups = $derived(groupByDay(data.events, now));
</script>

{#if groups.length}
  <div class="max-w-3xl space-y-6">
    {#each groups as group (group.key)}
      <section aria-labelledby="act-{group.key}">
        <h2 id="act-{group.key}" class="mb-2 text-xs font-medium text-muted-foreground">
          {group.label}
        </h2>
        <ol class="space-y-3 border-l pl-5">
          {#each group.items as event (event.id)}
            {@const Icon = ACTIVITY_ICON[event.type]}
            <li class="relative">
              <span
                class={cn(
                  'absolute top-0 -left-8 flex size-6 items-center justify-center rounded-full ring-4 ring-background',
                  TONE_CLASS[ACTIVITY_TYPE[event.type].tone],
                )}
              >
                <Icon class="size-3.5" />
              </span>
              <p class="text-sm">
                <strong class="font-medium">{nameOf(data.people, event.actor)}</strong>
                {event.text}
              </p>
              <p class="text-xs text-muted-foreground">{formatTime(event.createdAt)}</p>
            </li>
          {/each}
        </ol>
      </section>
    {/each}
  </div>
{:else}
  <EmptyState
    title="Sin actividad"
    description="Aquí queda el historial de rondas, veredictos y comentarios."
  />
{/if}
