<script lang="ts">
  import { Plus, Trash2 } from '@lucide/svelte';

  import { enhance } from '$app/forms';

  import type { AssignmentStrategy, ModuleRule } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import { Input } from '$lib/components/atoms/input';
  import { Label } from '$lib/components/atoms/label';
  import { RadioGroup, RadioGroupItem } from '$lib/components/atoms/radio-group';
  import type { FilterOption } from '$lib/components/molecules/filter';
  import FormSelect from '$lib/components/molecules/FormSelect.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import { STRATEGY } from '$lib/domain/labels';
  import { ASSIGNMENT_STRATEGIES } from '$lib/schemas/project';
  import { cn } from '$lib/utils/cn';

  interface Props {
    strategy: AssignmentStrategy;
    rules: ModuleRule[];
    designers: FilterOption[];
    errors: Record<string, string>;
    rowErrors: Record<string, string>;
  }

  let { strategy, rules, designers, errors, rowErrors }: Props = $props();

  interface Row extends ModuleRule {
    key: number;
  }

  // Copia editable de los props. La página monta el form dentro de `{#key project}`,
  // así que se reinicia cuando el server devuelve el proyecto guardado.
  let nextKey = 0;
  const initialRows = (): Row[] => rules.map((r) => ({ ...r, key: nextKey++ }));
  const initialStrategy = (): string => strategy;
  let current = $state(initialStrategy());
  let rows = $state(initialRows());
  let sending = $state(false);

  function addRow() {
    rows = [...rows, { pattern: '/', userId: designers[0]?.value ?? '', key: nextKey++ }];
  }

  function removeRow(key: number) {
    rows = rows.filter((r) => r.key !== key);
  }
</script>

<form
  method="post"
  novalidate
  use:enhance={() => {
    sending = true;
    return async ({ update }) => {
      await update({ reset: false });
      sending = false;
    };
  }}
>
  <SettingsSection
    title="Asignación automática"
    description="A quién le llega cada revisión nueva que sube la skill. El líder de diseño puede reasignar después."
  >
    <RadioGroup name="strategy" bind:value={current} class="gap-2">
      {#each ASSIGNMENT_STRATEGIES as s (s)}
        <Label
          for="strategy-{s}"
          class={cn(
            'flex cursor-pointer items-start gap-3 rounded-md border p-3 font-normal',
            current === s && 'border-primary/50 bg-primary/5',
          )}
        >
          <RadioGroupItem id="strategy-{s}" value={s} class="mt-0.5" />
          <span>
            <span class="block font-medium">{STRATEGY[s].label}</span>
            <span class="block text-sm text-muted-foreground">{STRATEGY[s].description}</span>
          </span>
        </Label>
      {/each}
    </RadioGroup>

    {#if current === 'by_module'}
      <fieldset class="mt-5 space-y-2">
        <legend class="mb-1 text-sm font-medium">Reglas por módulo</legend>
        <p class="text-xs text-muted-foreground">
          La primera ruta que coincide gana. Usa <code>*</code> para todo lo que cuelga de la ruta. Si
          ninguna coincide, se reparte por turnos.
        </p>
        {#if errors.moduleRules}
          <Notice tone="danger">{errors.moduleRules}</Notice>
        {/if}
        <ol class="space-y-2">
          {#each rows as row, i (row.key)}
            <li class="flex items-start gap-2">
              <div class="flex-1 space-y-1">
                <Input
                  name="pattern"
                  bind:value={row.pattern}
                  class="font-mono"
                  aria-label="Ruta de la regla {i + 1}"
                  aria-invalid={rowErrors[`${i}.pattern`] ? true : undefined}
                  placeholder="/preorders/*"
                />
                {#if rowErrors[`${i}.pattern`]}
                  <p class="text-xs text-danger">{rowErrors[`${i}.pattern`]}</p>
                {/if}
              </div>
              <div class="w-56 space-y-1">
                <FormSelect
                  name="userId"
                  bind:value={row.userId}
                  options={designers}
                  label="Diseñador de la regla {i + 1}"
                  placeholder="Elige un diseñador"
                  invalid={Boolean(rowErrors[`${i}.userId`])}
                />
                {#if rowErrors[`${i}.userId`]}
                  <p class="text-xs text-danger">{rowErrors[`${i}.userId`]}</p>
                {/if}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Quitar la regla {i + 1}"
                onclick={() => removeRow(row.key)}
              >
                <Trash2 />
              </Button>
            </li>
          {/each}
        </ol>
        <Button type="button" size="sm" variant="outline" onclick={addRow}>
          <Plus /> Agregar regla
        </Button>
      </fieldset>
    {:else}
      <!-- Las reglas se guardan igual, para no perderlas al cambiar de estrategia. -->
      {#each rows as row (row.key)}
        <input type="hidden" name="pattern" value={row.pattern} />
        <input type="hidden" name="userId" value={row.userId} />
      {/each}
    {/if}

    {#snippet footer()}
      <Button type="submit" size="sm" disabled={sending}>Guardar</Button>
    {/snippet}
  </SettingsSection>
</form>
