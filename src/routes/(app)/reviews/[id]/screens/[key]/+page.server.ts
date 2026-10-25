import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolve } from '$app/paths';
import { toElementRef } from '$lib/domain/anchors';
import { parseViewerQuery } from '$lib/domain/viewer-query';
import { commentSchema, followUpSchema, replySchema, verdictSchema } from '$lib/schemas/comment';
import { fieldErrors } from '$lib/schemas/form-errors';
import { gateway } from '$lib/server/gateway';
import { requireUser } from '$lib/server/guards';

export const load: PageServerLoad = async ({ parent, params, url }) => {
  const { review } = await parent();
  const index = review.screens.findIndex((s) => s.key === params.key);
  const screen = review.screens[index];
  if (!screen)
    throw error(404, { message: 'Esta pantalla no existe en la revisión.', code: 'not_found' });

  return {
    screen,
    prevKey: review.screens[index - 1]?.key ?? null,
    nextKey: review.screens[index + 1]?.key ?? null,
    query: parseViewerQuery(url.searchParams, screen),
    meta: {
      title: `${screen.key.toUpperCase()} · ${screen.title} · ${review.id}`,
      crumbs: [
        { label: 'Revisiones', href: resolve('/reviews') },
        { label: review.id, href: resolve('/(app)/reviews/[id]/(detail)', { id: review.id }) },
        { label: screen.title },
      ],
    },
  };
};

function str(data: FormData, key: string): string {
  const v = data.get(key);
  return typeof v === 'string' ? v : '';
}

export const actions: Actions = {
  verdict: async ({ request, params, locals, fetch }) => {
    requireUser(locals);
    const parsed = verdictSchema.safeParse({ verdict: str(await request.formData(), 'verdict') });
    if (!parsed.success) return fail(400, { error: 'Veredicto no válido.' });
    const result = await gateway(locals, fetch).feedback.setVerdict(
      params.id,
      params.key,
      parsed.data.verdict,
    );
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return { verdictSaved: parsed.data.verdict };
  },

  comment: async ({ request, params, locals, fetch }) => {
    requireUser(locals);
    const data = await request.formData();
    const parsed = commentSchema.safeParse({
      body: str(data, 'body'),
      ax: str(data, 'ax'),
      ay: str(data, 'ay'),
      elementId: str(data, 'elementId') || undefined,
    });
    if (!parsed.success)
      return fail(400, { commentErrors: fieldErrors(parsed.error), body: str(data, 'body') });

    const g = gateway(locals, fetch);
    // El componente se toma del contrato de la pantalla, no del navegador.
    const review = await g.reviews.get(params.id);
    if (!review.ok) return fail(review.error.status || 400, { error: review.error.message });
    const screen = review.data.screens.find((s) => s.key === params.key);
    const element = screen?.elements.find((e) => e.id === parsed.data.elementId);
    const { ax, ay } = parsed.data;
    const anchor = typeof ax === 'number' && typeof ay === 'number' ? { x: ax, y: ay } : null;

    const result = await g.feedback.addComment(params.id, params.key, {
      body: parsed.data.body,
      anchor,
      el: element ? toElementRef(element) : null,
    });
    if (!result.ok)
      return fail(result.error.status || 400, {
        error: result.error.message,
        body: parsed.data.body,
      });
    return { commentCreated: result.data.id, message: 'Comentario publicado.' };
  },

  reply: async ({ request, locals, fetch }) => {
    requireUser(locals);
    const data = await request.formData();
    const parsed = replySchema.safeParse({
      commentId: str(data, 'commentId'),
      body: str(data, 'body'),
    });
    if (!parsed.success) return fail(400, { error: 'Escribe la respuesta.' });
    const result = await gateway(locals, fetch).feedback.reply(
      parsed.data.commentId,
      parsed.data.body,
    );
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return { replied: parsed.data.commentId };
  },

  resolve: async ({ request, locals, fetch }) => {
    requireUser(locals);
    const data = await request.formData();
    const id = str(data, 'commentId');
    const resolved = str(data, 'resolved') === '1';
    const result = await gateway(locals, fetch).feedback.resolveComment(id, resolved);
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return { message: resolved ? 'Comentario resuelto.' : 'Comentario reabierto.' };
  },

  followUp: async ({ request, locals, fetch }) => {
    requireUser(locals);
    const data = await request.formData();
    const parsed = followUpSchema.safeParse({
      commentId: str(data, 'commentId'),
      followUp: str(data, 'followUp'),
    });
    if (!parsed.success) return fail(400, { error: 'Respuesta no válida.' });
    const result = await gateway(locals, fetch).feedback.setFollowUp(
      parsed.data.commentId,
      parsed.data.followUp,
    );
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return {
      message:
        parsed.data.followUp === 'resolved' ? 'Marcado como resuelto.' : 'Anotado: sigue igual.',
    };
  },

  delete: async ({ request, locals, fetch }) => {
    requireUser(locals);
    const id = str(await request.formData(), 'commentId');
    const result = await gateway(locals, fetch).feedback.deleteComment(id);
    if (!result.ok) return fail(result.error.status || 400, { error: result.error.message });
    return { message: 'Comentario eliminado.' };
  },
};
