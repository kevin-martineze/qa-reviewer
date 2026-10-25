<script lang="ts">
  import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/atoms/select';
  import { cn } from '$lib/utils/cn';

  import type { FilterOption } from './filter';

  interface Props {
    /** Campo del form: bits-ui crea el input oculto con este nombre. */
    name: string;
    value: string;
    options: FilterOption[];
    id?: string;
    /** Nombre accesible cuando no hay `<Label for>`. */
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    describedBy?: string;
    size?: 'sm' | 'default';
    class?: string;
    onChange?: (value: string) => void;
  }

  let {
    name,
    value = $bindable(),
    options,
    id,
    label,
    placeholder = 'Elige una opción',
    disabled = false,
    invalid = false,
    describedBy,
    size = 'default',
    class: className,
    onChange,
  }: Props = $props();

  const selected = $derived(options.find((o) => o.value === value)?.label);
</script>

<Select type="single" {name} bind:value {disabled} onValueChange={(v) => onChange?.(v)}>
  <SelectTrigger
    {id}
    {size}
    class={cn('w-full min-w-0', className)}
    aria-label={label}
    aria-invalid={invalid || undefined}
    aria-describedby={describedBy}
  >
    <span class={cn('truncate', !selected && 'text-muted-foreground')}>
      {selected ?? placeholder}
    </span>
  </SelectTrigger>
  <SelectContent>
    {#each options as option (option.value)}
      <SelectItem value={option.value} label={option.label}>{option.label}</SelectItem>
    {/each}
  </SelectContent>
</Select>
