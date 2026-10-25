<script lang="ts">
  import { Label } from '$lib/components/atoms/label';
  import { Switch } from '$lib/components/atoms/switch';

  interface Props {
    id: string;
    /** Campo del form: viaja solo si está activo (como un checkbox). */
    name: string;
    label: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
  }

  let { id, name, label, description, checked, disabled = false }: Props = $props();
</script>

<div class="flex items-start justify-between gap-4">
  <div class="min-w-0">
    <Label for={id} class="font-medium">{label}</Label>
    {#if description}
      <p id="{id}-hint" class="mt-1 text-sm text-muted-foreground">{description}</p>
    {/if}
  </div>
  <Switch
    {id}
    {name}
    value="on"
    {checked}
    {disabled}
    aria-describedby={description ? `${id}-hint` : undefined}
  />
</div>
