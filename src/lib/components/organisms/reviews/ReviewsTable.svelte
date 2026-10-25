<script lang="ts">
  import { resolve } from '$app/paths';

  import type { Review } from '$lib/api/types';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '$lib/components/atoms/table';
  import AvatarStack from '$lib/components/molecules/AvatarStack.svelte';
  import ProgressMeter from '$lib/components/molecules/ProgressMeter.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import { TONE_DOT } from '$lib/components/molecules/tone';
  import { dueState } from '$lib/domain/due';
  import { PRIORITY, REVIEW_STATUS } from '$lib/domain/labels';
  import { type People, nameOf, personOf } from '$lib/domain/people';
  import { progressOf } from '$lib/domain/review-progress';
  import { cn } from '$lib/utils/cn';
  import { formatRelative } from '$lib/utils/dates';

  interface Props {
    reviews: Review[];
    people: People;
    now: Date;
  }

  let { reviews, people, now }: Props = $props();
</script>

<div class="overflow-hidden rounded-lg border">
  <Table class="min-w-4xl">
    <TableHeader>
      <TableRow>
        <TableHead class="w-full">Revisión</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead>Prioridad</TableHead>
        <TableHead>Plazo</TableHead>
        <TableHead>Pantallas</TableHead>
        <TableHead>Asignada a</TableHead>
        <TableHead class="text-right">Actividad</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each reviews as review (review.id)}
        {@const due = dueState(review, now)}
        {@const progress = progressOf(review.screens)}
        {@const status = REVIEW_STATUS[review.status]}
        {@const priority = PRIORITY[review.priority]}
        <TableRow class="relative">
          <TableCell class="max-w-0">
            <a
              href={resolve('/(app)/reviews/[id]/(detail)', { id: review.id })}
              class="block min-w-0 after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
            >
              <span class="block truncate font-medium">{review.title}</span>
              <span class="block truncate text-xs text-muted-foreground">
                <span class="font-mono">{review.id}</span> · {review.module} · #{review.pr.number} · Ronda
                {review.round} · {nameOf(people, review.author)}
              </span>
            </a>
          </TableCell>
          <TableCell><ToneBadge tone={status.tone}>{status.label}</ToneBadge></TableCell>
          <TableCell>
            <span class="inline-flex items-center gap-1.5 text-xs">
              <span class={cn('size-1.5 rounded-full', TONE_DOT[priority.tone])}></span>
              {priority.label}
            </span>
          </TableCell>
          <TableCell
            class={cn(
              'text-xs whitespace-nowrap',
              due.tone === 'danger' && 'font-medium text-danger',
              due.tone === 'warning' && 'text-warning',
              due.tone !== 'danger' && due.tone !== 'warning' && 'text-muted-foreground',
            )}
          >
            {due.label}
          </TableCell>
          <TableCell>
            <ProgressMeter
              approved={progress.approved}
              changes={progress.changes}
              total={progress.total}
            />
          </TableCell>
          <TableCell>
            <AvatarStack users={review.assignees.map((id) => personOf(people, id))} />
          </TableCell>
          <TableCell class="text-right text-xs whitespace-nowrap text-muted-foreground">
            {formatRelative(review.updatedAt, now)}
          </TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>
