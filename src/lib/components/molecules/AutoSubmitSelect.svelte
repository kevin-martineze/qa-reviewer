<script lang="ts">
  import { enhance } from '$app/forms';

  import type { FilterOption } from './filter';
  import FormSelect from './FormSelect.svelte';

  interface Props {
    /** URL de la form action, p. ej. `?/role`. */
    action: string;
    name: string;
    value: string;
    options: FilterOption[];
    /** Nombre accesible del select. */
    label: string;
    /** Campos ocultos que identifican la fila (p. ej. `{ userId }`). */
    hidden: Record<string, string>;
    class?: string;
  }

  let { action, name, value, options, label, hidden, class: className }: Props = $props();

  let form = $state<HTMLFormElement>();
</script>

<!-- Envía al elegir: sin botón Guardar para cambios de una sola fila. -->
<form bind:this={form} method="post" {action} use:enhance>
  {#each Object.entries(hidden) as [key, val] (key)}
    <input type="hidden" name={key} value={val} />
  {/each}
  <FormSelect
    {name}
    {value}
    {options}
    {label}
    size="sm"
    class={className}
    onChange={() => queueMicrotask(() => form?.requestSubmit())}
  />
</form>
