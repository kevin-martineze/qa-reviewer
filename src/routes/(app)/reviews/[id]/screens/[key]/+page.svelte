<script lang="ts">
  import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Layers,
    MessageSquarePlus,
    ScanSearch,
  } from '@lucide/svelte';
  import { onMount, tick } from 'svelte';

  import type { PageData } from './$types';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  import type { Anchor, ScreenElement } from '$lib/api/types';
  import { Button, buttonVariants } from '$lib/components/atoms/button';
  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import ToneBadge from '$lib/components/molecules/ToneBadge.svelte';
  import { COMPARE_MODES } from '$lib/components/organisms/compare';
  import AnnotatedScreen from '$lib/components/organisms/viewer/AnnotatedScreen.svelte';
  import CommentComposer from '$lib/components/organisms/viewer/CommentComposer.svelte';
  import CommentThread from '$lib/components/organisms/viewer/CommentThread.svelte';
  import type { Pin } from '$lib/components/organisms/viewer/pins';
  import VerdictControl from '$lib/components/organisms/viewer/VerdictControl.svelte';
  import ViewerTemplate from '$lib/components/templates/ViewerTemplate.svelte';
  import { VERDICT } from '$lib/domain/labels';
  import {
    compareSrc,
    compareTargets,
    MODE_LABEL,
    viewerQueryHref,
    type CompareMode,
    type CompareTarget,
  } from '$lib/domain/viewer-query';
  import { cn } from '$lib/utils/cn';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const review = $derived(data.review);
  const screen = $derived(data.screen);
  const query = $derived(data.query);
  const now = $derived(new Date(data.now));
  const index = $derived(review.screens.findIndex((s) => s.key === screen.key));

  const screenHref = (key: string) =>
    resolve('/(app)/reviews/[id]/screens/[key]', { id: review.id, key });
  const here = $derived(screenHref(screen.key));

  /* ── Comparación (en la URL) ───────────────────────────────────────── */
  const targets = $derived(compareTargets(screen));
  const TARGET_LABEL = $derived<Record<CompareTarget, string>>({
    none: 'Sin comparar',
    previous: `Ronda ${review.round - 1}`,
    base: review.pr.base,
  });
  const beforeSrc = $derived(compareSrc(screen, query.compare));
  const Compare = $derived(COMPARE_MODES[query.mode]);
  const MODES: CompareMode[] = ['side', 'slider', 'toggle'];

  /* ── Capas y modo comentar (estado local) ──────────────────────────── */
  let showDiff = $state(false);
  let inspect = $state(false);
  let placing = $state(false);
  let pending = $state<{ anchor: Anchor | null; element: ScreenElement | null } | null>(null);
  let active = $state<string | null>(null);
  let showResolved = $state(false);

  // Al cambiar de pantalla: reinicia el modo comentar y aplica el comentario de la URL.
  let lastKey = '';
  $effect(() => {
    if (screen.key === lastKey) return;
    lastKey = screen.key;
    placing = false;
    pending = null;
    showDiff = screen.diff.length > 0 && screen.changedIn === review.round && review.round > 1;
    active = query.comment;
  });

  /* ── Comentarios de la pantalla ────────────────────────────────────── */
  const comments = $derived(
    data.comments
      .filter((c) => c.screen === screen.key)
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
  );
  const pinNumber = $derived.by(() => {
    const numbers: Record<string, number> = {};
    let n = 0;
    for (const c of comments) if (c.anchor) numbers[c.id] = ++n;
    return numbers;
  });
  const pins = $derived<Pin[]>(
    comments
      .filter((c) => c.anchor && (showResolved || !c.resolved))
      .map((c) => ({
        id: c.id,
        n: pinNumber[c.id] ?? 0,
        anchor: c.anchor ?? { x: 0, y: 0 },
        resolved: c.resolved,
      })),
  );
  const visible = $derived(showResolved ? comments : comments.filter((c) => !c.resolved));
  const resolvedCount = $derived(comments.filter((c) => c.resolved).length);

  const formError = $derived.by(() => {
    const f: unknown = page.form;
    if (typeof f === 'object' && f !== null && 'commentErrors' in f) {
      const errors = f.commentErrors;
      if (
        typeof errors === 'object' &&
        errors !== null &&
        'body' in errors &&
        typeof errors.body === 'string'
      ) {
        return errors.body;
      }
    }
    return undefined;
  });

  const verdictReason = $derived(
    data.can.isAuthor
      ? 'Eres el autor: el veredicto lo da diseño.'
      : review.status === 'approved' || review.status === 'changes_requested'
        ? 'La ronda ya se envió. Para cambiarla hay que reabrir el envío.'
        : review.status === 'closed'
          ? 'La revisión está cerrada.'
          : 'Solo diseño da veredicto.',
  );

  function select(id: string) {
    active = active === id ? null : id;
    tick().then(() =>
      document
        .getElementById(`comment-${id}`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
    );
  }

  function place(anchor: Anchor, element: ScreenElement | null) {
    pending = { anchor, element };
  }

  function startGeneral() {
    placing = false;
    pending = { anchor: null, element: null };
  }

  function cancelComposer() {
    pending = null;
    placing = false;
  }

  function setQuery(patch: { compare?: CompareTarget; mode?: CompareMode }) {
    // eslint-disable-next-line svelte/no-navigation-without-resolve -- `here` sale de resolve()
    goto(`${here}${viewerQueryHref(query, { ...patch, comment: null })}`, {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  }

  function go(key: string | null) {
    if (!key) return;
    // eslint-disable-next-line svelte/no-navigation-without-resolve -- screenHref usa resolve()
    goto(`${screenHref(key)}${viewerQueryHref(query, { comment: null })}`, { noScroll: true });
  }

  /* ── Atajos de teclado ─────────────────────────────────────────────── */
  onMount(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      )
        return;
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      const k = e.key.toLowerCase();
      const click = (sel: string) => document.querySelector<HTMLButtonElement>(sel)?.click();
      if (k === 'a') click('[data-verdict="approved"]:not([disabled])');
      else if (k === 'r') click('[data-verdict="changes_requested"]:not([disabled])');
      else if (k === 'c' && data.can.comment) placing = !placing;
      else if (k === 'i') inspect = !inspect;
      else if (k === 'd' && screen.diff.length) showDiff = !showDiff;
      else if (k === 'arrowleft' || k === 'k') go(data.prevKey);
      else if (k === 'arrowright' || k === 'j') go(data.nextKey);
      else if (k === 'escape') {
        if (pending || placing) cancelComposer();
        else active = null;
      } else return;
      e.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#snippet toggle(
  on: boolean,
  label: string,
  key: string,
  Icon: typeof Layers,
  onclick: () => void,
  disabled = false,
)}
  <Button
    type="button"
    size="sm"
    variant={on ? 'secondary' : 'ghost'}
    aria-pressed={on}
    {disabled}
    {onclick}
    title="{label} ({key})"
  >
    <Icon />{label}
  </Button>
{/snippet}

{#snippet toolbar()}
  <!-- Navegación entre pantallas al centro: que no se confunda con «Volver». -->
  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 px-4 py-2">
    <a
      href={resolve('/(app)/reviews/[id]/(detail)', { id: review.id })}
      class={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'justify-self-start')}
      aria-label="Volver a la revisión"
    >
      <ArrowLeft />
    </a>

    <div class="flex min-w-0 items-center gap-1">
      <button
        type="button"
        class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
        disabled={!data.prevKey}
        onclick={() => go(data.prevKey)}
        aria-label="Pantalla anterior (←)"
      >
        <ChevronLeft />
      </button>
      <div class="min-w-0 px-1 text-center">
        <p class="flex items-center justify-center gap-2 truncate text-sm font-medium">
          <span class="font-mono text-xs text-muted-foreground uppercase">{screen.key}</span>
          {screen.title}
          <ToneBadge tone={VERDICT[screen.verdict].tone}>{VERDICT[screen.verdict].label}</ToneBadge>
        </p>
        <p class="truncate text-xs text-muted-foreground">
          {index + 1} de {review.screens.length} · <span class="font-mono">{screen.viewport}</span>
          ·
          <span class="font-mono">{screen.route}</span>
        </p>
      </div>
      <button
        type="button"
        class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
        disabled={!data.nextKey}
        onclick={() => go(data.nextKey)}
        aria-label="Pantalla siguiente (→)"
      >
        <ChevronRight />
      </button>
    </div>

    <div class="flex min-w-0 flex-wrap items-center justify-end gap-2">
      {#if targets.length > 1}
        <div
          class="inline-flex rounded-md border p-0.5 text-xs"
          role="group"
          aria-label="Comparar con"
        >
          {#each targets as t (t)}
            <button
              type="button"
              aria-pressed={query.compare === t}
              class={cn(
                'rounded-sm px-2 py-1 text-muted-foreground hover:text-foreground',
                query.compare === t && 'bg-secondary font-medium text-foreground',
              )}
              onclick={() => setQuery({ compare: t })}
            >
              {t === 'none' ? TARGET_LABEL[t] : `vs ${TARGET_LABEL[t]}`}
            </button>
          {/each}
        </div>
        {#if query.compare !== 'none'}
          <div
            class="inline-flex rounded-md border p-0.5 text-xs"
            role="group"
            aria-label="Modo de comparación"
          >
            {#each MODES as m (m)}
              <button
                type="button"
                aria-pressed={query.mode === m}
                class={cn(
                  'rounded-sm px-2 py-1 text-muted-foreground hover:text-foreground',
                  query.mode === m && 'bg-secondary font-medium text-foreground',
                )}
                onclick={() => setQuery({ mode: m })}
              >
                {MODE_LABEL[m]}
              </button>
            {/each}
          </div>
        {/if}
      {/if}
      {#if screen.diff.length}
        {@render toggle(showDiff, 'Diff', 'D', Layers, () => (showDiff = !showDiff))}
      {/if}
      {@render toggle(inspect, 'Inspector', 'I', ScanSearch, () => (inspect = !inspect))}
      {#if data.can.comment}
        {@render toggle(placing, 'Comentar', 'C', MessageSquarePlus, () => (placing = !placing))}
      {/if}
    </div>
  </div>
{/snippet}

{#snippet stage()}
  {#if screen.img}
    <AnnotatedScreen
      src={screen.img}
      alt="Captura: {screen.title}"
      elements={screen.elements}
      diff={screen.diff}
      {pins}
      {showDiff}
      {inspect}
      {placing}
      pending={pending?.anchor ?? null}
      activePin={active}
      onPlace={place}
      onPin={select}
    />
  {/if}
{/snippet}

{#snippet aside()}
  <div class="space-y-5 p-4">
    <section aria-label="Veredicto" class="space-y-2">
      <VerdictControl
        verdict={screen.verdict}
        enabled={data.can.verdict}
        reason={verdictReason}
        inherited={screen.inherited}
        inheritedFrom={screen.changedIn}
      />
    </section>

    {#if screen.changes.length || screen.questions.length || (screen.roundNote && screen.changedIn === review.round)}
      <details class="group rounded-lg border" open>
        <summary class="cursor-pointer list-none px-3 py-2 text-sm font-medium">Qué cambió</summary>
        <div class="space-y-3 border-t px-3 py-3 text-sm">
          {#if screen.roundNote && screen.changedIn === review.round}
            <p class="rounded-md bg-info-soft px-2 py-1.5 text-info">
              Ronda {review.round}: «{screen.roundNote}»
            </p>
          {/if}
          {#if screen.changes.length}
            <ul class="list-disc space-y-1 pl-4 text-muted-foreground">
              {#each screen.changes as c (c)}<li>{c}</li>{/each}
            </ul>
          {/if}
          {#if screen.questions.length}
            <div>
              <p class="text-xs font-medium text-muted-foreground">El autor pregunta</p>
              {#each screen.questions as q (q)}<p>{q}</p>{/each}
            </div>
          {/if}
        </div>
      </details>
    {/if}

    <section aria-labelledby="comments-title" class="space-y-3">
      <header class="flex items-center justify-between gap-2">
        <h2 id="comments-title" class="text-sm font-semibold">
          Comentarios <span class="text-muted-foreground tabular-nums"
            >({comments.length - resolvedCount})</span
          >
        </h2>
        <div class="flex items-center gap-1">
          {#if resolvedCount}
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onclick={() => (showResolved = !showResolved)}
            >
              {showResolved ? 'Ocultar resueltos' : `Ver resueltos (${resolvedCount})`}
            </Button>
          {/if}
          {#if data.can.comment && !pending}
            <Button type="button" size="xs" variant="outline" onclick={startGeneral}>General</Button
            >
          {/if}
        </div>
      </header>

      {#if placing && !pending}
        <p class="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
          Haz clic en la captura donde va el comentario. El componente se detecta solo.
        </p>
      {/if}

      {#if pending}
        <CommentComposer
          anchor={pending.anchor}
          element={pending.element}
          error={formError}
          onCancel={cancelComposer}
          onDone={cancelComposer}
        />
      {/if}

      {#if visible.length}
        <div class="space-y-2">
          {#each visible as comment (comment.id)}
            <CommentThread
              {comment}
              n={pinNumber[comment.id] ?? null}
              round={review.round}
              people={data.people}
              {now}
              me={data.user.id}
              can={data.can}
              active={active === comment.id}
              onSelect={() => select(comment.id)}
            />
          {/each}
        </div>
      {:else if !pending}
        <EmptyState
          title="Sin comentarios"
          illustration="empty-comments"
          description={data.can.comment
            ? 'Pulsa C y haz clic en la captura para comentar un componente.'
            : undefined}
          class="py-8"
        />
      {/if}
    </section>
  </div>
{/snippet}

{#snippet footer()}
  <p class="flex flex-wrap gap-x-4 gap-y-1 px-4 py-1.5 text-2xs text-muted-foreground">
    {#each [['A', 'aprobar'], ['R', 'pedir ajuste'], ['C', 'comentar'], ['I', 'inspector'], ['D', 'diff'], ['← →', 'pantallas'], ['Esc', 'cancelar']] as [k, label] (k)}
      <span><kbd class="rounded-sm border px-1 font-mono">{k}</kbd> {label}</span>
    {/each}
  </p>
{/snippet}

<ViewerTemplate {toolbar} {aside} {footer}>
  <div
    class="mx-auto p-6"
    style:max-width="{Number.parseInt(screen.viewport, 10) *
      (beforeSrc && query.mode === 'side' ? 2 : 1) +
      48}px"
  >
    {#if !screen.img}
      <EmptyState title="Esta pantalla no tiene captura" />
    {:else if beforeSrc}
      <Compare
        {beforeSrc}
        beforeLabel={TARGET_LABEL[query.compare]}
        afterLabel="Ronda {review.round}"
        after={stage}
      />
    {:else}
      <div class="overflow-hidden rounded-md border shadow-sm">{@render stage()}</div>
    {/if}
  </div>
</ViewerTemplate>
