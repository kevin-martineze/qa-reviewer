<script lang="ts">
  import { asset } from '$app/paths';

  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/atoms/avatar';
  import { isAvatarId } from '$lib/domain/avatars';
  import { initials } from '$lib/domain/labels';
  import { cn } from '$lib/utils/cn';

  interface Props {
    name: string;
    /** Id del banco de avatares; sin él (o si no existe) se ven las iniciales. */
    avatar?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    class?: string;
  }

  let { name, avatar = null, size = 'sm', class: className }: Props = $props();

  const SIZE = {
    xs: 'size-5 text-2xs',
    sm: 'size-7 text-xs',
    md: 'size-9 text-sm',
    lg: 'size-16 text-lg',
  };

  const src = $derived(isAvatarId(avatar) ? asset(`/avatars/${avatar}.webp`) : null);
</script>

<Avatar class={cn(SIZE[size], className)} title={name}>
  {#if src}
    <AvatarImage {src} alt="" />
  {/if}
  <AvatarFallback class="bg-secondary font-medium text-secondary-foreground">
    {initials(name)}
  </AvatarFallback>
</Avatar>
