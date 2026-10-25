<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-2 p-4 text-center">
  <p class="text-2xl font-semibold">{page.status}</p>
  <p class="text-sm text-muted-foreground">{page.error?.message ?? 'Algo salió mal.'}</p>
</div>
