<script lang="ts">
  import type { AuditEvent } from '$lib/api/types';
  import UserAvatar from '$lib/components/molecules/UserAvatar.svelte';
  import { AUDIT_TYPE } from '$lib/domain/labels';
  import { type People, nameOf, personOf } from '$lib/domain/people';
  import { formatTime } from '$lib/utils/dates';
  import { groupByDay } from '$lib/utils/group-by-day';

  interface Props {
    events: AuditEvent[];
    people: People;
    now: Date;
  }

  let { events, people, now }: Props = $props();

  const groups = $derived(groupByDay(events, now));
</script>

<div class="space-y-5">
  {#each groups as group (group.key)}
    <section aria-label={group.label}>
      <h3 class="mb-2 text-xs font-medium text-muted-foreground">{group.label}</h3>
      <ol class="divide-y rounded-lg border">
        {#each group.items as event (event.id)}
          <li class="flex items-start gap-3 px-4 py-2.5">
            <UserAvatar {...personOf(people, event.actor)} size="xs" class="mt-0.5" />
            <div class="min-w-0 flex-1">
              <p class="text-sm">
                <strong class="font-medium">{nameOf(people, event.actor)}</strong>
                {event.text}
              </p>
              <p class="text-xs text-muted-foreground">{AUDIT_TYPE[event.type]}</p>
            </div>
            <time
              datetime={event.createdAt}
              class="text-xs whitespace-nowrap text-muted-foreground"
            >
              {formatTime(event.createdAt)}
            </time>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</div>
