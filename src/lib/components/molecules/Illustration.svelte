<script lang="ts">
  import { asset } from '$app/paths';

  import { ILLUSTRATIONS, type IllustrationName } from '$lib/components/molecules/illustrations';
  import { cn } from '$lib/utils/cn';

  interface Props {
    name: IllustrationName;
    class?: string;
  }

  let { name, class: className }: Props = $props();

  const size = $derived(ILLUSTRATIONS[name]);
</script>

<!-- Decorativa: el título del estado ya dice lo que pasa. -->
<img
  src={asset(`/illustrations/${name}.webp`)}
  alt=""
  aria-hidden="true"
  width={size.width}
  height={size.height}
  loading="lazy"
  decoding="async"
  draggable="false"
  class={cn('pointer-events-none h-auto w-40 select-none dark:opacity-90', className)}
/>
