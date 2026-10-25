<script lang="ts">
  import { asset } from '$app/paths';

  import { initials } from '$lib/domain/labels';
  import { AVATAR_IDS, AVATAR_LABEL } from '$lib/domain/avatars';
  import { cn } from '$lib/utils/cn';

  interface Props {
    /** Nombre del campo en el form: envía el id o '' (iniciales). */
    name?: string;
    /** Nombre de la persona, para la opción de iniciales. */
    personName: string;
    /** Avatar con el que arranca el selector. */
    initial?: string | null;
    error?: string;
    class?: string;
  }

  let { name = 'avatar', personName, initial = null, error, class: className }: Props = $props();

  // Estado local que parte del prop: el form lo envía y el server responde con el valor guardado.
  const start = () => initial ?? '';
  let selected = $state(start());

  const option =
    'relative flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-secondary text-sm font-medium text-secondary-foreground ring-offset-2 ring-offset-background transition-shadow hover:ring-2 hover:ring-border has-checked:ring-2 has-checked:ring-primary has-focus-visible:ring-2 has-focus-visible:ring-ring';
</script>

<fieldset class={cn('space-y-2', className)} aria-describedby={error ? `${name}-error` : undefined}>
  <legend class="text-sm font-medium">Foto de perfil</legend>
  <p class="text-xs text-muted-foreground">Elige uno del banco o quédate con tus iniciales.</p>
  <div class="grid w-fit grid-cols-7 gap-2 pt-1">
    <label class={option} title="Usar iniciales">
      <input type="radio" {name} value="" bind:group={selected} class="sr-only" />
      <span aria-hidden="true">{initials(personName || '?')}</span>
      <span class="sr-only">Usar iniciales</span>
    </label>
    {#each AVATAR_IDS as id (id)}
      <label class={option} title={AVATAR_LABEL[id]}>
        <input type="radio" {name} value={id} bind:group={selected} class="sr-only" />
        <img
          src={asset(`/avatars/${id}.webp`)}
          alt={AVATAR_LABEL[id]}
          width="256"
          height="256"
          loading="lazy"
          class="size-full object-cover"
        />
      </label>
    {/each}
  </div>
  {#if error}
    <p id="{name}-error" class="text-xs text-destructive">{error}</p>
  {/if}
</fieldset>
