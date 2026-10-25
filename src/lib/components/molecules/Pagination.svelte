<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  import { buttonVariants } from '$lib/components/atoms/button';
  import { cn } from '$lib/utils/cn';

  interface Props {
    page: number;
    limit: number;
    total: number;
    /** Enlace a una página (con el resto de filtros). */
    hrefFor: (page: number) => string;
    class?: string;
  }

  let { page, limit, total, hrefFor, class: className }: Props = $props();

  const pages = $derived(Math.max(1, Math.ceil(total / limit)));
  const from = $derived(total === 0 ? 0 : (page - 1) * limit + 1);
  const to = $derived(Math.min(total, page * limit));

  /** 1 … 4 5 6 … 12 */
  const items = $derived.by(() => {
    const out: Array<number | 'gap'> = [];
    for (let p = 1; p <= pages; p++) {
      if (p === 1 || p === pages || Math.abs(p - page) <= 1) out.push(p);
      else if (out[out.length - 1] !== 'gap') out.push('gap');
    }
    return out;
  });
</script>

<nav
  class={cn('flex items-center justify-between gap-4 text-sm', className)}
  aria-label="Paginación"
>
  <p class="text-muted-foreground tabular-nums">
    {#if total}{from}–{to} de {total}{:else}Sin resultados{/if}
  </p>
  {#if pages > 1}
    <ul class="flex items-center gap-1">
      <li>
        {#if page > 1}
          <a
            href={hrefFor(page - 1)}
            class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
            aria-label="Página anterior"
          >
            <ChevronLeft />
          </a>
        {/if}
      </li>
      {#each items as item, i (`${i}-${item}`)}
        <li>
          {#if item === 'gap'}
            <span class="px-1 text-muted-foreground">…</span>
          {:else}
            <a
              href={hrefFor(item)}
              aria-current={item === page ? 'page' : undefined}
              class={cn(
                buttonVariants({ variant: item === page ? 'secondary' : 'ghost', size: 'icon-sm' }),
                'tabular-nums',
              )}
            >
              {item}
            </a>
          {/if}
        </li>
      {/each}
      <li>
        {#if page < pages}
          <a
            href={hrefFor(page + 1)}
            class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
            aria-label="Página siguiente"
          >
            <ChevronRight />
          </a>
        {/if}
      </li>
    </ul>
  {/if}
</nav>
