<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();
</script>

<!-- Isotipo: marco de pantalla, check de aprobación y lupa de revisión. Misma forma que static/favicon.svg. -->
<svg
  viewBox="0 0 32 32"
  fill="none"
  aria-hidden="true"
  class={cn('size-7 shrink-0', className)}
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path
    d="M19 4H11a7 7 0 0 0-7 7v10a7 7 0 0 0 7 7h10a7 7 0 0 0 7-7v-6"
    class="stroke-foreground"
    stroke-width="3"
  />
  <path d="M10 15.5l5 5L26 6" class="stroke-brand" stroke-width="4" />
  <circle cx="19" cy="21" r="3.6" class="fill-background stroke-foreground" stroke-width="2.4" />
  <path d="M21.8 23.8 25 27" class="stroke-foreground" stroke-width="2.4" />
</svg>
