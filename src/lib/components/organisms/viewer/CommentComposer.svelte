<script lang="ts">
  import { Code, MapPin } from '@lucide/svelte';
  import { tick } from 'svelte';

  import { enhance } from '$app/forms';

  import type { Anchor, ScreenElement } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import { Textarea } from '$lib/components/atoms/textarea';

  interface Props {
    anchor: Anchor | null;
    element: ScreenElement | null;
    error?: string;
    onCancel: () => void;
    onDone: () => void;
  }

  let { anchor, element, error, onCancel, onDone }: Props = $props();

  let textarea = $state<HTMLTextAreaElement | null>(null);
  let sending = $state(false);

  // Enfoca al abrir o al mover el pin.
  $effect(() => {
    void anchor;
    tick().then(() => textarea?.focus());
  });
</script>

<form
  method="post"
  action="?/comment"
  class="space-y-2 rounded-lg border border-primary/40 p-3"
  use:enhance={() => {
    sending = true;
    return async ({ result, update }) => {
      await update();
      sending = false;
      if (result.type === 'success') onDone();
    };
  }}
>
  <input type="hidden" name="ax" value={anchor?.x ?? ''} />
  <input type="hidden" name="ay" value={anchor?.y ?? ''} />
  <input type="hidden" name="elementId" value={element?.id ?? ''} />

  <p class="flex items-center gap-1.5 text-xs text-muted-foreground">
    {#if element}
      <Code class="size-3" />
      <span class="font-mono text-foreground">{element.name}</span>
      <span class="truncate font-mono">{element.file.split('/').pop()}:{element.line}</span>
    {:else if anchor}
      <MapPin class="size-3" /> Punto en la captura (sin componente detectado)
    {:else}
      Comentario general de la pantalla
    {/if}
  </p>

  <Textarea
    bind:ref={textarea}
    name="body"
    rows={3}
    required
    maxlength={2000}
    placeholder="Qué cambiarías y por qué…"
    aria-label="Comentario"
    aria-invalid={error ? true : undefined}
    onkeydown={(e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
      if (e.key === 'Escape') onCancel();
    }}
  />
  {#if error}<p class="text-xs text-danger">{error}</p>{/if}
  <div class="flex items-center justify-between gap-2">
    <span class="text-2xs text-muted-foreground">⌘ Enter para enviar · Esc para cancelar</span>
    <div class="flex gap-2">
      <Button type="button" size="xs" variant="ghost" onclick={onCancel}>Cancelar</Button>
      <Button type="submit" size="xs" disabled={sending}>Comentar</Button>
    </div>
  </div>
</form>
