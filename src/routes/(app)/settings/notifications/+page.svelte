<script lang="ts">
  import type { PageData } from './$types';

  import { enhance } from '$app/forms';

  import type { NotificationType } from '$lib/api/types';
  import { Button } from '$lib/components/atoms/button';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import SwitchField from '$lib/components/molecules/SwitchField.svelte';
  import { NOTIFICATION_TYPE } from '$lib/domain/labels';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const types: NotificationType[] = [
    'review_assigned',
    'round_uploaded',
    'review_submitted',
    'mention',
    'reply',
    'due_soon',
    'overdue',
  ];
  let sending = $state(false);
</script>

<form
  method="post"
  use:enhance={() => {
    sending = true;
    return async ({ update }) => {
      await update({ reset: false });
      sending = false;
    };
  }}
>
  <SettingsSection
    title="Avisos por correo"
    description="Todo llega siempre a la campana de la app. Aquí eliges qué te llega también al correo {data
      .user.email}."
  >
    <div class="divide-y">
      {#each types as type (type)}
        <div class="py-3 first:pt-0 last:pb-0">
          <SwitchField
            id="pref-{type}"
            name={type}
            label={NOTIFICATION_TYPE[type].label}
            description={NOTIFICATION_TYPE[type].email}
            checked={data.prefs[type]}
          />
        </div>
      {/each}
    </div>
    {#snippet footer()}
      <Button type="submit" size="sm" disabled={sending}>Guardar</Button>
    {/snippet}
  </SettingsSection>
</form>
