<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { Tone } from '$lib/domain/tone';
  import { cn } from '$lib/utils/cn';

  import { TONE_CLASS } from './tone';

  interface Props {
    tone: Tone;
    class?: string;
    children: Snippet;
  }

  let { tone, class: className, children }: Props = $props();
</script>

<span
  class={cn(
    'inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap [&_svg]:size-3',
    TONE_CLASS[tone],
    className,
  )}
>
  {@render children()}
</span>
