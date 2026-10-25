import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const SESSION_COOKIE = 'qa_session';
export const PROJECT_COOKIE = 'qa_project';
export const SIDEBAR_COOKIE = 'qa_sidebar';

const WEEK = 60 * 60 * 24 * 7;

export function setSession(cookies: Cookies, token: string): void {
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: !dev,
    maxAge: WEEK,
  });
}

export function clearSession(cookies: Cookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function setProject(cookies: Cookies, projectId: string): void {
  cookies.set(PROJECT_COOKIE, projectId, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: !dev,
    maxAge: 60 * 60 * 24 * 365,
  });
}

/**
 * Destino tras cambiar de proyecto: lo que pertenece a un proyecto concreto
 * (una revisión, los ajustes del proyecto) no tiene sentido en el otro.
 */
export function afterProjectSwitch(target: string, projectId: string): string {
  const path = target.split('?')[0] ?? '/';
  if (path.startsWith('/reviews/')) return '/reviews';
  if (path.startsWith('/projects/')) return `/projects/${encodeURIComponent(projectId)}/settings`;
  return target;
}
