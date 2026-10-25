<script lang="ts">
  import Notice from '$lib/components/molecules/Notice.svelte';
  import SettingsSection from '$lib/components/molecules/SettingsSection.svelte';
  import PermissionMatrix from '$lib/components/organisms/admin/PermissionMatrix.svelte';
  import { orgRoleColumns, projectRoleColumns } from '$lib/domain/role-matrix';

  const orgColumns = orgRoleColumns();
  const projectColumns = projectRoleColumns();
</script>

<div class="space-y-6">
  <Notice tone="info">
    Los roles son fijos. Una persona tiene un rol en la organización y, si es miembro, un rol en
    cada proyecto. Owner y admin ven todos los proyectos como admin del proyecto.
  </Notice>

  <SettingsSection
    title="Roles de la organización"
    description="Se asignan en Usuarios. Solo el owner da o quita el rol owner."
  >
    <PermissionMatrix columns={orgColumns} caption="Permisos por rol de organización" />
  </SettingsSection>

  <SettingsSection
    title="Roles de proyecto"
    description="Se asignan en los miembros de cada proyecto. El autor de una revisión nunca da veredicto sobre ella."
  >
    <PermissionMatrix columns={projectColumns} caption="Permisos por rol de proyecto" />
  </SettingsSection>
</div>
