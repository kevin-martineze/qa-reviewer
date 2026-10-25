<script lang="ts">
  import type { SubmitFunction } from '@sveltejs/kit';
  import { Check, CircleCheck, Code, MoreHorizontal, RotateCcw, Trash2 } from '@lucide/svelte';

  import { enhance } from '$app/forms';

  import type { Comment } from '$lib/api/types';
  import { Button, buttonVariants } from '$lib/components/atoms/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '$lib/components/atoms/dropdown-menu';
  import { Textarea } from '$lib/components/atoms/textarea';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { awaitingFollowUp } from '$lib/domain/follow-ups';
  import { nameOf, type People } from '$lib/domain/people';
  import type { ReviewAbilities } from '$lib/domain/review-abilities';
  import { cn } from '$lib/utils/cn';
  import { formatRelative } from '$lib/utils/dates';

  interface Props {
    comment: Comment;
    /** Número del pin (si tiene ancla). */
    n: number | null;
    round: number;
    people: People;
    now: Date;
    me: string;
    can: ReviewAbilities;
    active: boolean;
    onSelect: () => void;
  }

  let { comment, n, round, people, now, me, can, active, onSelect }: Props = $props();

  const followUp = $derived(can.verdict && awaitingFollowUp(comment, round));
  const canDelete = $derived(comment.author === me || can.moderate);

  let replying = $state(false);
  let sending = $state(false);
  let deleteForm = $state<HTMLFormElement | null>(null);
  let resolveForm = $state<HTMLFormElement | null>(null);

  const done: SubmitFunction = () => {
    sending = true;
    return async ({ update }) => {
      await update();
      sending = false;
      replying = false;
    };
  };
</script>

<article
  id="comment-{comment.id}"
  class={cn(
    'space-y-2 rounded-lg border p-3 transition-colors',
    active && 'border-foreground/40 bg-muted/40',
    comment.resolved && 'opacity-70',
  )}
  aria-current={active ? 'true' : undefined}
>
  <header class="flex items-start gap-2">
    <button
      type="button"
      onclick={onSelect}
      class={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        n === null
          ? 'bg-muted text-muted-foreground'
          : comment.resolved
            ? 'bg-muted-foreground text-background'
            : 'bg-pin text-primary-foreground',
      )}
      aria-label={n === null ? 'Comentario general' : `Ver el pin ${n} en la captura`}
    >
      {n ?? '·'}
    </button>
    <div class="min-w-0 flex-1">
      <p class="flex flex-wrap items-center gap-x-2 text-sm">
        <span class="font-medium">{nameOf(people, comment.author)}</span>
        <span class="text-xs text-muted-foreground">{formatRelative(comment.createdAt, now)}</span>
        {#if comment.round < round}
          <span class="rounded-sm bg-muted px-1 text-2xs text-muted-foreground"
            >Ronda {comment.round}</span
          >
        {/if}
        {#if comment.resolved}
          <span class="inline-flex items-center gap-0.5 text-2xs text-success">
            <CircleCheck class="size-3" /> Resuelto
          </span>
        {/if}
      </p>
    </div>
    {#if can.resolve || canDelete}
      <DropdownMenu>
        <DropdownMenuTrigger
          class={buttonVariants({ variant: 'ghost', size: 'icon-xs' })}
          aria-label="Acciones del comentario"
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {#if can.resolve}
            <DropdownMenuItem onSelect={() => resolveForm?.requestSubmit()}>
              {#if comment.resolved}<RotateCcw /> Reabrir{:else}<Check /> Marcar resuelto{/if}
            </DropdownMenuItem>
          {/if}
          {#if canDelete}
            <DropdownMenuItem variant="destructive" onSelect={() => deleteForm?.requestSubmit()}>
              <Trash2 /> Eliminar
            </DropdownMenuItem>
          {/if}
        </DropdownMenuContent>
      </DropdownMenu>
      <form bind:this={resolveForm} method="post" action="?/resolve" use:enhance class="hidden">
        <input type="hidden" name="commentId" value={comment.id} />
        <input type="hidden" name="resolved" value={comment.resolved ? '0' : '1'} />
      </form>
      <form bind:this={deleteForm} method="post" action="?/delete" use:enhance class="hidden">
        <input type="hidden" name="commentId" value={comment.id} />
      </form>
    {/if}
  </header>

  {#if comment.el}
    <p
      class="flex items-center gap-1.5 truncate rounded-sm bg-muted px-2 py-1 font-mono text-2xs text-muted-foreground"
      title="{comment.el.file}:{comment.el.line} · {comment.el.selector}"
    >
      <Code class="size-3 shrink-0" />
      <span class="text-foreground">{comment.el.name}</span>
      <span class="truncate">{comment.el.file.split('/').pop()}:{comment.el.line}</span>
    </p>
  {/if}

  <p class="text-sm whitespace-pre-line">{comment.body}</p>

  {#if comment.replies.length}
    <ul class="space-y-2 border-l-2 pl-3">
      {#each comment.replies as reply (reply.id)}
        <li class="space-y-0.5">
          <div class="flex items-center gap-1.5 text-xs">
            <UserAvatar name={nameOf(people, reply.author)} size="xs" />
            <span class="font-medium">{nameOf(people, reply.author)}</span>
            <span class="text-muted-foreground">{formatRelative(reply.createdAt, now)}</span>
          </div>
          <p class="text-sm whitespace-pre-line">{reply.body}</p>
        </li>
      {/each}
    </ul>
  {/if}

  {#if followUp}
    <form
      method="post"
      action="?/followUp"
      use:enhance={done}
      class="space-y-2 rounded-md bg-warning-soft p-2"
    >
      <input type="hidden" name="commentId" value={comment.id} />
      <p class="text-xs font-medium text-warning">¿Quedó resuelto en la ronda {round}?</p>
      <div class="flex gap-2">
        <Button type="submit" name="followUp" value="resolved" size="xs" disabled={sending}>
          Sí, resuelto
        </Button>
        <Button
          type="submit"
          name="followUp"
          value="still"
          size="xs"
          variant="outline"
          disabled={sending}
        >
          Sigue igual
        </Button>
      </div>
    </form>
  {:else if comment.followUp === 'still' && !comment.resolved}
    <p class="text-xs text-warning">Diseño indicó que sigue igual.</p>
  {/if}

  {#if can.comment}
    {#if replying}
      <form method="post" action="?/reply" use:enhance={done} class="space-y-2">
        <input type="hidden" name="commentId" value={comment.id} />
        <Textarea name="body" rows={2} required placeholder="Responder…" aria-label="Respuesta" />
        <div class="flex justify-end gap-2">
          <Button type="button" size="xs" variant="ghost" onclick={() => (replying = false)}
            >Cancelar</Button
          >
          <Button type="submit" size="xs" disabled={sending}>Responder</Button>
        </div>
      </form>
    {:else}
      <button
        type="button"
        class="text-xs font-medium text-muted-foreground hover:text-foreground"
        onclick={() => (replying = true)}
      >
        Responder
      </button>
    {/if}
  {/if}
</article>
