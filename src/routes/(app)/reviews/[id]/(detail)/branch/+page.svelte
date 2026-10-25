<script lang="ts">
  import {
    CircleCheck,
    CircleDashed,
    CircleX,
    ExternalLink,
    GitBranch,
    GitCommit,
    GitPullRequest,
  } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { buttonVariants } from '$lib/components/atoms/button';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const pr = $derived(data.review.pr);
  const PR_STATE = {
    open: { label: 'Abierto', tone: 'info' },
    merged: { label: 'Fusionado', tone: 'success' },
    closed: { label: 'Cerrado', tone: 'muted' },
  } as const;
  const CHECK = {
    success: { label: 'Diseño aprobó', icon: CircleCheck, class: 'text-success' },
    failure: { label: 'Diseño pidió ajustes', icon: CircleX, class: 'text-danger' },
    pending: { label: 'Esperando a diseño', icon: CircleDashed, class: 'text-warning' },
  } as const;
  const check = $derived(pr.check ? CHECK[pr.check] : null);
</script>

<div class="max-w-3xl space-y-6">
  <section class="space-y-4 rounded-lg border p-4">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="flex items-center gap-2 text-sm font-semibold">
        <GitPullRequest class="size-4" /> Pull request #{pr.number}
        <ToneBadge tone={PR_STATE[pr.state].tone}>{PR_STATE[pr.state].label}</ToneBadge>
      </h2>
      <!-- eslint-disable svelte/no-navigation-without-resolve -- enlace externo a GitHub -->
      <a
        href={pr.url}
        target="_blank"
        rel="noopener noreferrer"
        class={buttonVariants({ variant: 'outline', size: 'sm' })}
      >
        Abrir en GitHub <ExternalLink />
      </a>
      <!-- eslint-enable svelte/no-navigation-without-resolve -->
    </header>

    <dl class="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-2 text-sm">
      <dt class="text-muted-foreground">Rama</dt>
      <dd class="flex items-center gap-1.5 font-mono text-xs">
        <GitBranch class="size-3.5 text-muted-foreground" />{pr.head}
        <span class="text-muted-foreground">→</span>{pr.base}
      </dd>
      <dt class="text-muted-foreground">Último commit</dt>
      <dd class="flex items-center gap-1.5 font-mono text-xs">
        <GitCommit class="size-3.5 text-muted-foreground" />{pr.commit}
      </dd>
      <dt class="text-muted-foreground">Check de diseño</dt>
      <dd>
        {#if check}
          {@const Icon = check.icon}
          <span class="inline-flex items-center gap-1.5 {check.class}">
            <Icon class="size-4" />{check.label}
          </span>
          <span class="ml-1 font-mono text-xs text-muted-foreground">design-review</span>
        {:else}
          <span class="text-muted-foreground">El proyecto no publica el check.</span>
        {/if}
      </dd>
      <dt class="text-muted-foreground">Tarjeta</dt>
      <dd class="font-mono text-xs">{data.review.card}</dd>
    </dl>
  </section>

  <Notice tone="info" title="Cómo sube el autor la ronda siguiente">
    Desde la misma rama, <code class="font-mono">/design-review</code> vuelve a capturar solo las
    pantallas que cambiaron y abre la ronda {data.review.round + 1}. Las demás conservan su
    veredicto.
  </Notice>
</div>
