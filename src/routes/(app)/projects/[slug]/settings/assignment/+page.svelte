<script lang="ts">
  import type { PageData } from './$types';

  import { page } from '$app/state';

  import AssignmentForm from '$lib/components/organisms/project/AssignmentForm.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

{#key data.project}
  <AssignmentForm
    strategy={data.project.strategy}
    rules={data.project.moduleRules}
    designers={data.designers}
    errors={page.form?.errors ?? {}}
    rowErrors={page.form?.rowErrors ?? {}}
  />
{/key}
