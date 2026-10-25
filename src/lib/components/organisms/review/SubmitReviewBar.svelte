<script lang="ts">
  import { Send } from '@lucide/svelte';

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
  import ProgressMeter from '$lib/components/molecules/ProgressMeter.svelte';
  import { progressOf } from '$lib/domain/review-progress';

  interface Props {
    review: Review;
  }

  let { review }: Props = $props();

  const progress = $derived(progressOf(review.screens));
  const firstPending = $derived(review.screens.find((s) => s.verdict === 'pending'));
  const result = $derived(progress.changes > 0 ? 'changes' : 'approved');

  let open = $state(false);
  let sending = $state(false);
</script>

<div class="flex flex-wrap items-center justify-between gap-3">
  <div class="flex items-center gap-3 text-sm">
    <ProgressMeter
      approved={progress.approved}
      changes={progress.changes}
      total={progress.total}
      showCount={false}
      class="[&>div]:w-28"
    />
    <span>
      <strong class="font-semibold tabular-nums">{progress.done} de {progress.total}</strong>
      con veredicto
      {#if progress.changes}
        · <span class="text-warning">{progress.changes} con ajuste</span>
      {/if}
    </span>
  </div>

  <div class="flex items-center gap-2">
    {#if firstPending}
      <a
        href={resolve('/(app)/reviews/[id]/screens/[key]', {
          id: review.id,
          key: firstPending.key,
        })}
        class="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Ir a la siguiente sin veredicto
      </a>
    {/if}
    <Button
      type="button"
      disabled={progress.pending > 0}
      title={progress.pending > 0 ? `Faltan ${progress.pending} pantallas` : undefined}
      onclick={() => (open = true)}
    >
      <Send /> Enviar revisión
    </Button>
  </div>
</div>

<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {result === 'approved' ? 'Aprobar la ronda ' : 'Pedir ajustes en la ronda '}{review.round}
      </DialogTitle>
      <DialogDescription>
        {#if result === 'approved'}
          Las {progress.total} pantallas quedan aprobadas y el check de diseño del PR pasa a verde.
        {:else}
          {progress.approved} aprobadas y {progress.changes} con ajuste. El autor recibe el feedback para
          Claude Code y sube la ronda {review.round + 1}.
        {/if}
      </DialogDescription>
    </DialogHeader>
    <form
      method="post"
      action="{resolve('/(app)/reviews/[id]/(detail)', { id: review.id })}?/submit"
      class="space-y-4"
      use:enhance={() => {
        sending = true;
        return async ({ update }) => {
          await update();
          sending = false;
          open = false;
        };
      }}
    >
      <div class="space-y-1.5">
        <Label for="submit-body">Mensaje para el autor (opcional)</Label>
        <Textarea
          id="submit-body"
          name="body"
          rows={4}
          maxlength={2000}
          placeholder="Lo general de la ronda. Lo de cada pantalla va en sus comentarios."
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onclick={() => (open = false)}>Cancelar</Button>
        <Button type="submit" disabled={sending}>
          {result === 'approved' ? 'Aprobar' : 'Enviar ajustes'}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
