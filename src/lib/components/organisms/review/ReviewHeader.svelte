<script lang="ts">
  import {
    Check,
    ChevronDown,
    Clock,
    ExternalLink,
    GitPullRequest,
    UserPlus,
  } from '@lucide/svelte';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';

  import type { Review } from '$lib/api/types';
  import { Button, buttonVariants } from '$lib/components/atoms/button';
  import { Checkbox } from '$lib/components/atoms/checkbox';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/atoms/popover';
  import AvatarStack from '$lib/components/molecules/AvatarStack.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import { TONE_DOT } from '$lib/components/molecules/tone';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { dueState } from '$lib/domain/due';
  import { PRIORITY, REVIEW_STATUS } from '$lib/domain/labels';
  import { type People, nameOf, personOf } from '$lib/domain/people';
  import type { ReviewAbilities } from '$lib/domain/review-abilities';
  import { cn } from '$lib/utils/cn';

  interface Props {
    review: Review;
    people: People;
    now: Date;
    can: ReviewAbilities;
    /** Ids que pueden quedar asignados (diseño del proyecto). */
    designers: string[];
  }

  let { review, people, now, can, designers }: Props = $props();

  const status = $derived(REVIEW_STATUS[review.status]);
  const priority = $derived(PRIORITY[review.priority]);
  const due = $derived(dueState(review, now));
  const actionBase = $derived(resolve('/(app)/reviews/[id]/(detail)', { id: review.id }));
  const PRIORITIES = ['urgent', 'high', 'medium', 'low'] as const;

  let assignOpen = $state(false);
  let priorityOpen = $state(false);
  let saving = $state(false);
</script>

<header class="space-y-3">
  <div class="flex flex-wrap items-center gap-2 text-xs">
    <span class="font-mono text-muted-foreground">{review.id}</span>
    <ToneBadge tone={status.tone}>{status.label}</ToneBadge>

    {#if can.assign}
      <Popover bind:open={priorityOpen}>
        <PopoverTrigger
          class={cn(buttonVariants({ variant: 'ghost', size: 'xs' }), 'gap-1.5')}
          aria-label="Prioridad: {priority.label}. Cambiar"
        >
          <span class={cn('size-1.5 rounded-full', TONE_DOT[priority.tone])}></span>
          {priority.label}
          <ChevronDown class="size-3" />
        </PopoverTrigger>
        <PopoverContent align="start" class="w-44 p-1">
          <form
            method="post"
            action="{actionBase}?/priority"
            use:enhance={() =>
              async ({ update }) => {
                await update();
                priorityOpen = false;
              }}
          >
            {#each PRIORITIES as key (key)}
              <button
                type="submit"
                name="priority"
                value={key}
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span class={cn('size-1.5 rounded-full', TONE_DOT[PRIORITY[key].tone])}></span>
                <span class="flex-1 text-left">{PRIORITY[key].label}</span>
                {#if key === review.priority}<Check class="size-4" />{/if}
              </button>
            {/each}
          </form>
        </PopoverContent>
      </Popover>
    {:else}
      <span class="inline-flex items-center gap-1.5 px-1">
        <span class={cn('size-1.5 rounded-full', TONE_DOT[priority.tone])}></span>
        {priority.label}
      </span>
    {/if}

    <span
      class={cn(
        'inline-flex items-center gap-1',
        due.tone === 'danger' && 'font-medium text-danger',
        due.tone === 'warning' && 'text-warning',
        due.tone !== 'danger' && due.tone !== 'warning' && 'text-muted-foreground',
      )}
    >
      <Clock class="size-3" />{due.label}
    </span>
  </div>

  <div class="flex flex-wrap items-start justify-between gap-4">
    <div class="min-w-0">
      <h1 class="text-xl font-semibold">{review.title}</h1>
      <p class="text-sm text-muted-foreground">{review.context}</p>
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <!-- eslint-disable svelte/no-navigation-without-resolve -- enlace externo a GitHub -->
      <a
        href={review.pr.url}
        target="_blank"
        rel="noopener noreferrer"
        class={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        <GitPullRequest /> PR #{review.pr.number}
        <ExternalLink class="size-3 text-muted-foreground" />
      </a>
      <!-- eslint-enable svelte/no-navigation-without-resolve -->

      {#if can.assign}
        <Popover bind:open={assignOpen}>
          <PopoverTrigger
            class={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2')}
            aria-label="Asignada a {review.assignees.map((id) => nameOf(people, id)).join(', ') ||
              'nadie'}. Cambiar"
          >
            {#if review.assignees.length}
              <AvatarStack users={review.assignees.map((id) => personOf(people, id))} />
            {:else}
              <UserPlus />
            {/if}
            Asignar
          </PopoverTrigger>
          <PopoverContent align="end" class="w-64 p-0">
            <form
              method="post"
              action="{actionBase}?/assign"
              use:enhance={() => {
                saving = true;
                return async ({ update }) => {
                  await update();
                  saving = false;
                  assignOpen = false;
                };
              }}
            >
              <p class="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
                Diseño del proyecto
              </p>
              <ul class="max-h-64 overflow-y-auto p-1">
                {#each designers as id (id)}
                  <li>
                    <label
                      class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <Checkbox
                        name="assignees"
                        value={id}
                        checked={review.assignees.includes(id)}
                      />
                      <UserAvatar {...personOf(people, id)} size="xs" />
                      <span class="truncate">{nameOf(people, id)}</span>
                    </label>
                  </li>
                {/each}
              </ul>
              <div class="flex justify-end border-t p-2">
                <Button type="submit" size="sm" disabled={saving}>Guardar</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      {:else}
        <span class="flex items-center gap-2 text-xs text-muted-foreground">
          Revisa
          <AvatarStack users={review.assignees.map((id) => personOf(people, id))} />
        </span>
      {/if}
    </div>
  </div>

  <dl class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
    <div class="flex gap-1">
      <dt>Tarjeta</dt>
      <dd class="font-mono text-foreground">{review.card}</dd>
    </div>
    <div class="flex gap-1">
      <dt>Módulo</dt>
      <dd class="text-foreground">{review.module}</dd>
    </div>
    <div class="flex gap-1">
      <dt>Autor</dt>
      <dd class="text-foreground">{nameOf(people, review.author)}</dd>
    </div>
    <div class="flex gap-1">
      <dt>Rama</dt>
      <dd class="font-mono text-foreground">{review.pr.head} → {review.pr.base}</dd>
    </div>
  </dl>
</header>
