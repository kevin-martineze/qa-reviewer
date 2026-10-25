<script lang="ts">
  import type { PageData } from './$types';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  import EmptyState from '$lib/components/molecules/EmptyState.svelte';
  import FilterSelect from '$lib/components/molecules/FilterSelect.svelte';
  import Pagination from '$lib/components/molecules/Pagination.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import AuditLog from '$lib/components/organisms/admin/AuditLog.svelte';
  import { auditQueryHref, isAuditType, type AuditQuery } from '$lib/domain/audit-query';
  import { AUDIT_TYPE } from '$lib/domain/labels';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const now = $derived(new Date(data.now));
  const base = resolve('/admin/audit');

  const typeOptions = Object.entries(AUDIT_TYPE).map(([value, label]) => ({ value, label }));
  const actorOptions = $derived(
    Object.entries(data.people).map(([value, p]) => ({ value, label: p.name })),
  );

  function apply(patch: Partial<AuditQuery>) {
    // eslint-disable-next-line svelte/no-navigation-without-resolve -- `base` sale de resolve(); solo se agrega la query
    goto(`${base}${auditQueryHref(data.query, patch)}`, { keepFocus: true, noScroll: true });
  }
</script>

<SettingsSection
  title="Auditoría"
  description="Cambios de acceso y configuración: invitaciones, roles, miembros, tokens y proyectos."
>
  <div class="mb-4 flex flex-wrap gap-2">
    <FilterSelect
      label="Evento"
      value={data.query.type}
      options={typeOptions}
      anyLabel="Todos"
      onChange={(type) => apply({ type: isAuditType(type) ? type : '' })}
    />
    <FilterSelect
      label="Quién"
      value={data.query.actor}
      options={actorOptions}
      anyLabel="Cualquiera"
      onChange={(actor) => apply({ actor })}
    />
  </div>

  {#if data.events.length}
    <AuditLog events={data.events} people={data.people} {now} />
    <Pagination
      class="mt-4"
      page={data.pagination.page}
      limit={data.pagination.limit}
      total={data.pagination.total}
      hrefFor={(page) => `${base}${auditQueryHref(data.query, { page })}`}
    />
  {:else}
    <EmptyState title="Sin eventos" description="Nada coincide con estos filtros." class="py-10" />
  {/if}
</SettingsSection>
