// Capturas sintéticas del mock. Con REVIEWS_SOURCE=api las imágenes vienen firmadas de S3.
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { renderSvg, sceneById } from '$lib/server/adapters/mock/scenes';
import { isMock } from '$lib/server/gateway';

export const GET: RequestHandler = ({ params }) => {
  if (!isMock) throw error(404, { message: 'No encontramos esta página.', code: 'not_found' });
  const id = params.file.replace(/\.svg$/, '');
  const scene = sceneById(id);
  if (!scene) throw error(404, { message: 'Captura no encontrada.', code: 'not_found' });
  return new Response(renderSvg(scene), {
    headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=3600' },
  });
};
