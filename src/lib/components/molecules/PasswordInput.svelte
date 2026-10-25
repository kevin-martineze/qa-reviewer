<script lang="ts">
  import { Eye, EyeOff } from '@lucide/svelte';

  import { Input } from '$lib/components/atoms/input';

  interface Props {
    id: string;
    name: string;
    autocomplete: 'current-password' | 'new-password';
    value?: string;
    invalid?: boolean;
    describedBy?: string;
    required?: boolean;
  }

  let {
    id,
    name,
    autocomplete,
    value = $bindable(''),
    invalid = false,
    describedBy,
    required = true,
  }: Props = $props();

  let visible = $state(false);
</script>

<div class="relative">
  <Input
    {id}
    {name}
    {autocomplete}
    {required}
    type={visible ? 'text' : 'password'}
    bind:value
    aria-invalid={invalid || undefined}
    aria-describedby={describedBy}
    class="pr-9"
  />
  <button
    type="button"
    class="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    aria-pressed={visible}
    onclick={() => (visible = !visible)}
  >
    {#if visible}<EyeOff class="size-4" />{:else}<Eye class="size-4" />{/if}
  </button>
</div>
