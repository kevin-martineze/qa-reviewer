<script lang="ts">
  import { Check, Copy, Terminal } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { Button } from '$lib/components/atoms/button';
  import { toast } from '$lib/components/atoms/sonner';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import { feedbackText } from '$lib/domain/feedback-text';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
  const names = $derived(
    Object.fromEntries(Object.entries(data.people).map(([id, p]) => [id, p.name])),
  );
  const text = $derived(feedbackText(data.review, data.comments, names, now));

  let copied = $state(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      toast.success('Copiado. Pégalo en la sesión de Claude Code de la feature.');
      setTimeout(() => (copied = false), 2000);
    } catch {
      toast.error('No se pudo copiar. Selecciona el texto a mano.');
    }
  }
</script>

<div class="max-w-4xl space-y-4">
  <Notice tone="info" title="Lo mismo que ve Claude Code">
    En la sesión de la feature, <code class="font-mono">/design-review status {data.review.id}</code
    >
    trae este texto. Claude Code lo usa para aplicar los ajustes y subir la ronda siguiente.
  </Notice>

  <div class="overflow-hidden rounded-lg border">
    <div class="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
      <span class="flex items-center gap-2 text-xs text-muted-foreground">
        <Terminal class="size-3.5" /> design-review status
      </span>
      <Button type="button" size="xs" variant="ghost" onclick={copy}>
        {#if copied}<Check /> Copiado{:else}<Copy /> Copiar{/if}
      </Button>
    </div>
    <pre
      class="max-h-128 overflow-auto p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">{text}</pre>
  </div>
</div>
