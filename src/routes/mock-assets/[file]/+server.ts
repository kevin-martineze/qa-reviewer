// Escenas SVG sintéticas del mock. Con REVIEWS_SOURCE=api las imágenes vienen firmadas de S3.
// Las capturas reales de Lideris (anonimizadas) son estáticas: static/demo/lideris/.
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { renderSvg, sceneById } from '$lib/server/adapters/mock/scenes';
import { isMock } from '$lib/server/gateway';

export const GET: RequestHandler = ({ params }) => {
  if (!isMock) throw error(404, { message: 'No encontramos esta página.', code: 'not_found' });

  const scene = sceneById(params.file.replace(/\.svg$/, ''));
  if (!scene) throw error(404, { message: 'Captura no encontrada.', code: 'not_found' });
  return new Response(renderSvg(scene), {
    headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=3600' },
  });
};
