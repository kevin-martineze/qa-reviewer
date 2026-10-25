<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    label: string;
    value: string;
    /** Contexto corto bajo el valor, p. ej. «mediana desde que se abre». */
    hint?: string;
    /** Resalta el valor cuando es una alerta (p. ej. vencidas > 0). */
    alert?: boolean;
    class?: string;
  }

  let { label, value, hint, alert = false, class: className }: Props = $props();
</script>

<div class={cn('rounded-lg border bg-card px-4 py-3', className)}>
  <p class="text-sm text-muted-foreground">{label}</p>
  <p class={cn('mt-1 text-2xl font-semibold', alert && 'text-danger')}>{value}</p>
  {#if hint}<p class="mt-0.5 text-xs text-muted-foreground">{hint}</p>{/if}
</div>
