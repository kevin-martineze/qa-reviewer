<script lang="ts">
  import { Check, PencilLine } from '@lucide/svelte';

  import { enhance } from '$app/forms';

  import type { Verdict } from '$lib/api/types';
  import { cn } from '$lib/utils/cn';

  interface Props {
    verdict: Verdict;
    /** Puede cambiarlo (diseño, ronda abierta, no es el autor). */
    enabled: boolean;
    /** Por qué no puede, si no puede. */
    reason?: string;
    inherited: boolean;
    inheritedFrom: number;
  }

  let { verdict, enabled, reason, inherited, inheritedFrom }: Props = $props();

  let saving = $state(false);

  const OPTIONS = [
    {
      value: 'approved',
      label: 'Aprobar',
      key: 'A',
      icon: Check,
      on: 'border-success bg-success-soft text-success',
    },
    {
      value: 'changes_requested',
      label: 'Pedir ajuste',
      key: 'R',
      icon: PencilLine,
      on: 'border-warning bg-warning-soft text-warning',
    },
  ] as const;
</script>

<form
  method="post"
  action="?/verdict"
  class="space-y-2"
  use:enhance={() => {
    saving = true;
    return async ({ update }) => {
      await update({ reset: false });
      saving = false;
    };
  }}
>
  <div class="grid grid-cols-2 gap-2" role="group" aria-label="Veredicto de la pantalla">
    {#each OPTIONS as opt (opt.value)}
      {@const active = verdict === opt.value}
      {@const Icon = opt.icon}
      <button
        type="submit"
        name="verdict"
        value={active ? 'pending' : opt.value}
        disabled={!enabled || saving}
        aria-pressed={active}
        data-verdict={opt.value}
        class={cn(
          'flex h-9 items-center justify-center gap-1.5 rounded-md border text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60',
          active && opt.on,
        )}
      >
        <Icon class="size-4" />
        {opt.label}
        <kbd class="ml-1 rounded-sm border border-current/30 px-1 font-mono text-2xs opacity-60">
          {opt.key}
        </kbd>
      </button>
    {/each}
  </div>
  {#if !enabled && reason}
    <p class="text-xs text-muted-foreground">{reason}</p>
  {:else if inherited && verdict !== 'pending'}
    <p class="text-xs text-muted-foreground">
      Veredicto de la ronda {inheritedFrom}: la pantalla no cambió. Puedes cambiarlo.
    </p>
  {:else if enabled && verdict !== 'pending'}
    <p class="text-xs text-muted-foreground">Pulsa otra vez para quitar el veredicto.</p>
  {/if}
</form>
