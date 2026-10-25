<script lang="ts">
  import { RotateCcw } from '@lucide/svelte';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';

  import type { Review } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '$lib/components/atoms/dialog';
  import { Label } from '$lib/components/atoms/label';
  import { Textarea } from '$lib/components/atoms/textarea';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import { nameOf, type People } from '$lib/domain/people';
  import { formatRelative } from '$lib/utils/dates';

  interface Props {
    review: Review;
    people: People;
    now: Date;
    canReopen: boolean;
  }

  let { review, people, now, canReopen }: Props = $props();

  const round = $derived(review.rounds.find((r) => r.n === review.round));
  const submission = $derived(round?.submission ?? null);
  const base = $derived(resolve('/(app)/reviews/[id]/(detail)', { id: review.id }));

  let reopenOpen = $state(false);
  let sending = $state(false);
</script>

{#if review.status === 'closed'}
  <Notice tone="info" title="Revisión cerrada">
    {review.pr.state === 'merged' ? 'El PR se fusionó.' : 'El PR se cerró sin fusionar.'} Ya no se aceptan
    veredictos ni comentarios.
  </Notice>
{:else if submission}
  <Notice
    tone={submission.result === 'approved' ? 'success' : 'warning'}
    title={submission.result === 'approved'
      ? `${nameOf(people, submission.by)} aprobó la ronda ${review.round}`
      : `${nameOf(people, submission.by)} pidió ajustes en ${submission.changes} ${submission.changes === 1 ? 'pantalla' : 'pantallas'}`}
  >
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="space-y-1">
        {#if submission.body}<p class="max-w-2xl">«{submission.body}»</p>{/if}
        <p class="text-xs text-muted-foreground">
          {formatRelative(submission.createdAt, now)}.
          {submission.result === 'approved'
            ? 'El check de diseño del PR quedó en verde.'
            : `Esperando la ronda ${review.round + 1} del autor.`}
        </p>
      </div>
      {#if canReopen}
        <Button type="button" variant="outline" size="sm" onclick={() => (reopenOpen = true)}>
          <RotateCcw /> Reabrir el envío
        </Button>
      {/if}
    </div>
  </Notice>
{:else if review.round > 1 && round}
  <Notice tone="info" title="Ronda {review.round}: {nameOf(people, round.by)} subió cambios">
    {#if round.note}<p class="max-w-2xl">«{round.note}»</p>{/if}
    <p class="text-xs text-muted-foreground">
      {formatRelative(round.createdAt, now)} · {round.changed.length}
      {round.changed.length === 1 ? 'pantalla cambió' : 'pantallas cambiaron'}; el resto conserva el
      veredicto de la ronda {review.round - 1}.
    </p>
  </Notice>
{/if}

<Dialog bind:open={reopenOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Reabrir el envío de la ronda {review.round}</DialogTitle>
      <DialogDescription>
        La revisión vuelve a «En revisión» y diseño puede cambiar los veredictos. El autor recibe un
        aviso con el motivo.
      </DialogDescription>
    </DialogHeader>
    <form
      method="post"
      action="{base}?/reopen"
      class="space-y-4"
      use:enhance={() => {
        sending = true;
        return async ({ update }) => {
          await update();
          sending = false;
          reopenOpen = false;
        };
      }}
    >
      <div class="space-y-1.5">
        <Label for="reopen-reason">Motivo</Label>
        <Textarea
          id="reopen-reason"
          name="reason"
          required
          minlength={5}
          placeholder="Ej.: Aprobé por error la pantalla de desplazamiento."
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onclick={() => (reopenOpen = false)}>Cancelar</Button>
        <Button type="submit" disabled={sending}>Reabrir</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
