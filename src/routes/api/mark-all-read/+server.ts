import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/guards';
import { gateway } from '$lib/server/gateway';

export const POST: RequestHandler = async ({ locals }) => {
  requireUser(locals);

  const result = await gateway(locals).notifications.markAllRead();
  if (!result.ok) throw error(result.error.status ?? 400, result.error.message);

  return json({ ok: true });
};
