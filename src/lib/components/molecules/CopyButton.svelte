<script lang="ts">
  import { Check, Copy } from '@lucide/svelte';

  import { Button } from '$lib/components/atoms/button';
  import { toast } from '$lib/components/atoms/sonner';

  interface Props {
    text: string;
    label?: string;
    /** Toast al copiar; sin él solo cambia el ícono. */
    successMessage?: string;
    size?: 'xs' | 'sm' | 'default';
    variant?: 'outline' | 'ghost' | 'default';
  }

  let {
    text,
    label = 'Copiar',
    successMessage,
    size = 'sm',
    variant = 'outline',
  }: Props = $props();

  let copied = $state(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      if (successMessage) toast.success(successMessage);
      setTimeout(() => (copied = false), 2000);
    } catch {
      toast.error('No se pudo copiar. Selecciona el texto a mano.');
    }
  }
</script>

<Button type="button" {size} {variant} onclick={copy}>
  {#if copied}<Check />{:else}<Copy />{/if}
  {copied ? 'Copiado' : label}
</Button>
