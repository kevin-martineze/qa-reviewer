import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import type { Notification } from '$lib/api/types';
import { gateway } from '$lib/server/gateway';
import { unwrap } from '$lib/server/guards';

const TABS = ['all', 'unread', 'mentions'] as const;
type Tab = (typeof TABS)[number];

function isTab(value: string | null): value is Tab {
  return TABS.some((t) => t === value);
}

/** Lugar exacto al que lleva una notificación. */
function targetOf(n: Notification): string {
  if (n.review && n.screen) {
    const href = resolve('/(app)/reviews/[id]/screens/[key]', { id: n.review, key: n.screen });
    return n.comment ? `${href}?comment=${encodeURIComponent(n.comment)}` : href;
  }
  if (n.review) return resolve('/(app)/reviews/[id]/(detail)', { id: n.review });
  return resolve('/notifications');
}

export const load: PageServerLoad = async ({ locals, fetch, url, depends }) => {
  depends('app:notifications');
  const raw = url.searchParams.get('tab');
  const tab: Tab = isTab(raw) ? raw : 'all';
  const items = unwrap(
    await gateway(locals, fetch).notifications.list({
      unread: tab === 'unread',
      mentions: tab === 'mentions',
    }),
    url,
  );
  return {
    tab,
    items,
    meta: {
      title: 'Notificaciones',
      crumbs: [{ label: 'Bandeja', href: resolve('/') }, { label: 'Notificaciones' }],
    },
  };
};

export const actions: Actions = {
  open: async ({ request, locals, fetch }) => {
    const id = String((await request.formData()).get('id') ?? '');
    const g = gateway(locals, fetch);
    const list = await g.notifications.list({});
    const n = list.ok ? list.data.find((x) => x.id === id) : undefined;
    if (!n) return fail(404, { error: 'La notificación ya no existe.' });
    await g.notifications.markRead(id);
    throw redirect(303, targetOf(n));
  },

  markAllRead: async ({ locals, fetch }) => {
    const result = await gateway(locals, fetch).notifications.markAllRead();
    if (!result.ok) return fail(result.error.status, { error: result.error.message });
    return { done: true };
  },
};
