<script lang="ts">
  import type { Anchor, Box, ScreenElement } from '$lib/api/types';
  import { elementAt, pixelsToAnchor } from '$lib/domain/anchors';
  import { cn } from '$lib/utils/cn';

  import type { Pin } from './pins';

  interface Props {
    src: string;
    alt: string;
    elements: ScreenElement[];
    diff: Box[];
    pins: Pin[];
    showDiff: boolean;
    /** Resalta el componente bajo el cursor con su archivo y línea. */
    inspect: boolean;
    /** Modo comentar: el clic deja un pin. */
    placing: boolean;
    /** Pin en curso (todavía sin enviar). */
    pending: Anchor | null;
    activePin: string | null;
    onPlace: (anchor: Anchor, element: ScreenElement | null) => void;
    onPin: (id: string) => void;
  }

  let {
    src,
    alt,
    elements,
    diff,
    pins,
    showDiff,
    inspect,
    placing,
    pending,
    activePin,
    onPlace,
    onPin,
  }: Props = $props();

  let stage = $state<HTMLDivElement | null>(null);
  let hovered = $state<ScreenElement | null>(null);

  const pct = (n: number) => `${n * 100}%`;

  function anchorOf(event: MouseEvent): Anchor | null {
    if (!stage) return null;
    const rect = stage.getBoundingClientRect();
    return pixelsToAnchor({ x: event.clientX - rect.left, y: event.clientY - rect.top }, rect);
  }

  function move(event: MouseEvent) {
    if (!inspect && !placing) return;
    const a = anchorOf(event);
    hovered = a ? elementAt(elements, a) : null;
  }

  function click(event: MouseEvent) {
    if (!placing) return;
    const a = anchorOf(event);
    if (a) onPlace(a, elementAt(elements, a));
  }

  const highlight = $derived(inspect || placing ? hovered : null);
</script>

<!-- El clic solo coloca pins (modo comentar). Con teclado se comenta sin ancla desde el panel. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  bind:this={stage}
  class={cn('relative w-full select-none', placing && 'cursor-crosshair')}
  onmousemove={move}
  onmouseleave={() => (hovered = null)}
  onclick={click}
>
  <img {src} {alt} class="block h-auto w-full" draggable="false" />

  {#if showDiff}
    {#each diff as box, i (i)}
      <div
        class="pointer-events-none absolute rounded-sm bg-warning/15 ring-2 ring-warning"
        style:left={pct(box.x)}
        style:top={pct(box.y)}
        style:width={pct(box.w)}
        style:height={pct(box.h)}
        aria-hidden="true"
      ></div>
    {/each}
  {/if}

  {#if highlight}
    <div
      class="pointer-events-none absolute rounded-sm bg-info/10 ring-2 ring-info"
      style:left={pct(highlight.box.x)}
      style:top={pct(highlight.box.y)}
      style:width={pct(highlight.box.w)}
      style:height={pct(highlight.box.h)}
    >
      <span
        class="absolute -top-6 left-0 rounded-sm bg-info px-1.5 py-0.5 font-mono text-2xs whitespace-nowrap text-info-foreground shadow"
      >
        {highlight.name} · {highlight.file.split('/').pop()}:{highlight.line}
      </span>
    </div>
  {/if}

  {#each pins as pin (pin.id)}
    <button
      type="button"
      class={cn(
        'absolute flex size-6 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full rounded-bl-none text-xs font-semibold shadow-md ring-2 ring-background transition-transform hover:scale-110',
        pin.resolved ? 'bg-muted-foreground text-background' : 'bg-pin text-primary-foreground',
        activePin === pin.id && 'scale-125 ring-foreground',
      )}
      style:left={pct(pin.anchor.x)}
      style:top={pct(pin.anchor.y)}
      aria-label="Comentario {pin.n}{pin.resolved ? ' (resuelto)' : ''}"
      onclick={(e) => {
        e.stopPropagation();
        onPin(pin.id);
      }}
    >
      {pin.n}
    </button>
  {/each}

  {#if pending}
    <span
      class="pointer-events-none absolute flex size-6 -translate-x-1/2 -translate-y-full animate-pulse items-center justify-center rounded-full rounded-bl-none bg-primary text-xs font-semibold text-primary-foreground shadow-md ring-2 ring-background"
      style:left={pct(pending.x)}
      style:top={pct(pending.y)}
      aria-hidden="true"
    >
      +
    </span>
  {/if}
</div>
