import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireUser } from '$lib/server/guards';
import { gateway, REVIEWS_SOURCE } from '$lib/server/gateway';
import { SESSION_COOKIE } from '$lib/server/session';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
  requireUser(locals);

  if (REVIEWS_SOURCE === 'http') throw error(404, 'No disponible fuera del mock.');

  const data = await request.formData();
  const userId = String(data.get('userId') ?? '');

  const usersResult = await gateway(locals).directory.listUsers();
  if (!usersResult.ok) throw error(usersResult.error.status ?? 400, usersResult.error.message);
  const target = usersResult.data.find((u) => u.id === userId && u.status === 'active');
  if (!target) throw error(400, 'Usuario no válido.');

  cookies.set(SESSION_COOKIE, target.id, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  });

  throw redirect(303, '/');
};
