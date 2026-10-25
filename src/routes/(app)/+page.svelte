<script lang="ts">
  import type { PageData } from './$types';
  import { Badge } from '$lib/components/atoms/badge';
  import { Card } from '$lib/components/atoms/card';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  const permissions = $derived([...(data.permissions ?? [])].sort());
</script>

<div class="space-y-6 p-6">
  <div class="space-y-1">
    <h1 class="text-2xl font-semibold">QA Reviewer · maqueta</h1>
    <p class="text-sm text-muted-foreground">
      Fase 1 — datos mock en memoria, listos para integrar las pantallas.
    </p>
  </div>

  {#if data.user}
    <Card class="max-w-xl space-y-4 p-6">
      <div class="space-y-1">
        <p class="text-xs font-medium text-muted-foreground">Sesión</p>
        <p class="text-lg font-semibold">{data.user.name}</p>
        <p class="text-sm text-muted-foreground">{data.user.email}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Badge>organización: {data.user.orgRole}</Badge>
        {#if data.projectRole}
          <Badge>proyecto: {data.projectRole}</Badge>
        {/if}
      </div>

      <div class="space-y-1">
        <p class="text-xs font-medium text-muted-foreground">Permisos</p>
        <p class="text-sm">{permissions.join(', ')}</p>
      </div>
    </Card>
  {:else}
    <p class="text-sm text-muted-foreground">Sin sesión.</p>
  {/if}
</div>
