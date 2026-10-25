<script lang="ts">
  import { Avatar, AvatarFallback } from '$lib/components/atoms/avatar';
  import { initials } from '$lib/domain/labels';
  import { cn } from '$lib/utils/cn';

  interface Props {
    name: string;
    size?: 'xs' | 'sm' | 'md';
    class?: string;
  }

  let { name, size = 'sm', class: className }: Props = $props();

  const SIZE = { xs: 'size-5 text-2xs', sm: 'size-7 text-xs', md: 'size-9 text-sm' };
</script>

<Avatar class={cn(SIZE[size], className)} title={name}>
  <AvatarFallback class="bg-secondary font-medium text-secondary-foreground">
    {initials(name)}
  </AvatarFallback>
</Avatar>
