<script lang="ts">
  import { ArrowRight } from '@lucide/svelte';

  import type { PageData } from './$types';

  import { resolve } from '$app/paths';

  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import Notice from '$lib/components/molecules/Notice.svelte';
  import ReviewRow from '$lib/components/organisms/reviews/ReviewRow.svelte';
  import ListTemplate from '$lib/components/templates/ListTemplate.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
  const firstName = $derived(data.user.name.split(' ')[0] ?? data.user.name);
  const project = $derived(data.projects.find((p) => p.id === data.projectId));
</script>

<ListTemplate
  title="Hola, {firstName}"
  description={project ? `Lo pendiente en ${project.name}.` : 'Lo pendiente en tus proyectos.'}
>
  <div class="space-y-8">
    {#if data.waitingOnMe > 0}
      <Notice tone="warning" title="Diseño te pidió ajustes">
        {data.waitingOnMe === 1
          ? 'Una revisión tuya espera una ronda nueva.'
          : `${data.waitingOnMe} revisiones tuyas esperan una ronda nueva.`}
        Sube los cambios con /design-review en la misma rama.
      </Notice>
    {/if}

    {#each data.sections as section (section.key)}
      <section class="space-y-3" aria-labelledby="sec-{section.key}">
        <header class="flex items-end justify-between gap-4">
          <div>
            <h2 id="sec-{section.key}" class="flex items-center gap-2 text-sm font-semibold">
              {section.title}
              {#if section.total}
                <span
                  class="rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums"
                >
                  {section.total}
                </span>
              {/if}
            </h2>
            <p class="text-xs text-muted-foreground">{section.description}</p>
          </div>
          {#if section.total > section.items.length}
            <a
              href="{resolve('/reviews')}{section.more}"
              class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Ver las {section.total}
              <ArrowRight class="size-3" />
            </a>
          {/if}
        </header>

        {#if section.items.length}
          <ul class="space-y-2">
            {#each section.items as review (review.id)}
              <li><ReviewRow {review} people={data.people} {now} /></li>
            {/each}
          </ul>
        {:else}
          <div class="rounded-lg border border-dashed">
            <EmptyState title={section.empty} class="py-8" />
          </div>
        {/if}
      </section>
    {/each}
  </div>
</ListTemplate>
