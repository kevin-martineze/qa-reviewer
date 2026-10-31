#!/usr/bin/env node
// Exporta los datos del mock como semilla de demo del API (qa-reviewer-api/seed/demo).
// Así la demo con el API real muestra lo mismo que el modo mock y las e2e sirven en ambos.
//
//   node scripts/export-demo-seed.mjs [carpeta-destino]
//
// Escribe data.json (forma del contrato, fechas ISO + `exportedAt` para que el API las
// desplace al cargar) y assets/ con cada imagen: los PNG anonimizados de static/demo/lideris
// tal cual y las escenas sintéticas renderizadas a SVG. Las URLs de imagen quedan como
// `asset:<archivo>`.
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? join(root, '../../backend/qa-reviewer-api/seed/demo'));

const vite = await createServer({
  root,
  configFile: join(root, 'vite.config.ts'),
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});

try {
  const seeds = await vite.ssrLoadModule('/src/lib/server/adapters/mock/seeds.ts');
  const scenes = await vite.ssrLoadModule('/src/lib/server/adapters/mock/scenes.ts');

  await rm(join(out, 'assets'), { recursive: true, force: true });
  await mkdir(join(out, 'assets'), { recursive: true });

  /** URL del mock → `asset:<archivo>`, copiando o renderizando la imagen una vez. */
  const assets = new Map();
  async function asset(url) {
    if (url === null || url === undefined) return null;
    const cached = assets.get(url);
    if (cached) return cached;

    let file;
    const png = /^\/demo\/lideris\/([a-z0-9-]+\.png)$/.exec(url);
    const svg = /^\/mock-assets\/([a-z0-9-]+)\.svg$/.exec(url);
    if (png) {
      file = png[1];
      await copyFile(join(root, 'static/demo/lideris', file), join(out, 'assets', file));
    } else if (svg) {
      const scene = scenes.sceneById(svg[1]);
      if (!scene) throw new Error(`Escena sin registrar: ${svg[1]}`);
      file = `${svg[1]}.svg`;
      await writeFile(join(out, 'assets', file), scenes.renderSvg(scene));
    } else {
      throw new Error(`URL de imagen desconocida: ${url}`);
    }
    const ref = `asset:${file}`;
    assets.set(url, ref);
    return ref;
  }

  const reviews = [];
  for (const review of seeds.SEED_REVIEWS) {
    const screens = [];
    for (const screen of review.screens) {
      screens.push({
        ...screen,
        img: await asset(screen.img),
        before: await asset(screen.before),
        previous: await asset(screen.previous),
      });
    }
    reviews.push({ ...review, screens });
  }

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    password: seeds.DEMO_PASSWORD,
    org: seeds.ORG,
    users: seeds.USERS,
    projects: seeds.PROJECTS,
    memberships: seeds.MEMBERSHIPS,
    invites: seeds.SEED_INVITES,
    recoveries: seeds.SEED_RECOVERIES,
    tokens: seeds.SEED_TOKENS,
    reviews,
    comments: seeds.SEED_COMMENTS,
    notifications: seeds.SEED_NOTIFICATIONS,
    activity: seeds.SEED_ACTIVITY,
    audit: seeds.SEED_AUDIT,
  };
  await writeFile(join(out, 'data.json'), `${JSON.stringify(data, null, 2)}\n`);
  console.warn(
    `Semilla exportada a ${out}: ${reviews.length} revisiones, ${assets.size} imágenes.`,
  );
} finally {
  await vite.close();
}
