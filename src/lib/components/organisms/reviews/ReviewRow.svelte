<script lang="ts">
  import { Clock, GitPullRequest } from '@lucide/svelte';

  import { resolve } from '$app/paths';

  import type { Review } from '$lib/api/types';
  import AvatarStack from '$lib/components/molecules/AvatarStack.svelte';
  import ProgressMeter from '$lib/components/molecules/ProgressMeter.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import { dueState } from '$lib/domain/due';
  import { PRIORITY, REVIEW_STATUS } from '$lib/domain/labels';
  import { type People, nameOf, personOf } from '$lib/domain/people';
  import { progressOf } from '$lib/domain/review-progress';
  import { cn } from '$lib/utils/cn';
  import { formatRelative } from '$lib/utils/dates';

  interface Props {
    review: Review;
    people: People;
    now: Date;
  }

  let { review, people, now }: Props = $props();

  const due = $derived(dueState(review, now));
  const progress = $derived(progressOf(review.screens));
  const status = $derived(REVIEW_STATUS[review.status]);
  const priority = $derived(PRIORITY[review.priority]);
</script>

<a
  href={resolve('/(app)/reviews/[id]/(detail)', { id: review.id })}
  class="group flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-foreground/20 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
>
  <div class="min-w-0 flex-1 space-y-1">
    <div class="flex items-center gap-2">
      <span class="font-mono text-xs text-muted-foreground">{review.id}</span>
      {#if review.priority === 'urgent' || review.priority === 'high'}
        <ToneBadge tone={priority.tone}>{priority.label}</ToneBadge>
      {/if}
    </div>
    <p class="truncate text-sm font-medium group-hover:underline">{review.title}</p>
    <p class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
      <span>{review.module}</span>
      <span class="inline-flex items-center gap-1"
        ><GitPullRequest class="size-3" />#{review.pr.number}</span
      >
      <span>Ronda {review.round}</span>
      <span>De {nameOf(people, review.author)}</span>
      <span>{formatRelative(review.updatedAt, now)}</span>
    </p>
  </div>

  <ProgressMeter approved={progress.approved} changes={progress.changes} total={progress.total} />

  <div class="flex w-40 shrink-0 flex-col items-end gap-1">
    <ToneBadge tone={status.tone}>{status.label}</ToneBadge>
    <span
      class={cn(
        'inline-flex items-center gap-1 text-xs',
        due.tone === 'danger' && 'font-medium text-danger',
        due.tone === 'warning' && 'text-warning',
        due.tone !== 'danger' && due.tone !== 'warning' && 'text-muted-foreground',
      )}
    >
      <Clock class="size-3" />{due.label}
    </span>
  </div>

  <AvatarStack
    users={review.assignees.map((id) => personOf(people, id))}
    class="w-14 justify-end"
  />
</a>
