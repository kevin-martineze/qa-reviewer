// Capturas del mock. Con REVIEWS_SOURCE=api las imágenes vienen firmadas de S3.
// `.svg`: escena sintética. `.png`: captura real local de fixtures-private (nunca en el repo).
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PRIVATE_DIR, privateCapture } from '$lib/server/adapters/mock/private-captures';
import { renderSvg, sceneById } from '$lib/server/adapters/mock/scenes';
import { isMock } from '$lib/server/gateway';

const notFound = () => error(404, { message: 'Captura no encontrada.', code: 'not_found' });

export const GET: RequestHandler = async ({ params }) => {
  if (!isMock) throw error(404, { message: 'No encontramos esta página.', code: 'not_found' });

  if (params.file.endsWith('.png')) {
    // El id solo vale si está en el manifest: nada de rutas arbitrarias en disco.
    const capture = privateCapture(params.file.slice(0, -4));
    if (!capture) throw notFound();
    const body = await readFile(join(PRIVATE_DIR, capture.file)).catch(() => null);
    if (!body) throw notFound();
    return new Response(body, {
      headers: { 'content-type': 'image/png', 'cache-control': 'private, max-age=300' },
    });
  }

  const scene = sceneById(params.file.replace(/\.svg$/, ''));
  if (!scene) throw notFound();
  return new Response(renderSvg(scene), {
    headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=3600' },
  });
};
