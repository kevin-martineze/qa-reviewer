<script lang="ts">
  import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/atoms/select';
  import { cn } from '$lib/utils/cn';

  import type { FilterOption } from './filter';

  interface Props {
    /** Nombre del filtro (accesible y prefijo visible). */
    label: string;
    value: string;
    options: FilterOption[];
    /** Texto cuando no hay valor; `''` significa «cualquiera». */
    anyLabel?: string;
    onChange: (value: string) => void;
    class?: string;
  }

  let { label, value, options, anyLabel, onChange, class: className }: Props = $props();

  // bits-ui no acepta '' como valor de un ítem: lo traducimos a un centinela.
  const ANY = '__any';
  const current = $derived(value || ANY);
  const selected = $derived(options.find((o) => o.value === value)?.label ?? anyLabel ?? '');
</script>

<Select type="single" value={current} onValueChange={(v) => onChange(v === ANY ? '' : v)}>
  <SelectTrigger
    size="sm"
    class={cn('min-w-0', value && 'border-primary/40', className)}
    aria-label={label}
  >
    <span class="truncate">
      <span class="text-muted-foreground">{label}:</span>
      {selected}
    </span>
  </SelectTrigger>
  <SelectContent>
    {#if anyLabel}
      <SelectItem value={ANY} label={anyLabel}>{anyLabel}</SelectItem>
    {/if}
    {#each options as option (option.value)}
      <SelectItem value={option.value} label={option.label}>{option.label}</SelectItem>
    {/each}
  </SelectContent>
</Select>
