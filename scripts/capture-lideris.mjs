// Captura pantallas reales de Lideris para el mock de QA Reviewer. SOLO LOCAL.
//
//   1. Levanta Lideris (p. ej. `pnpm vite dev --port 5190` en lideris-v2).
//   2. node scripts/capture-lideris.mjs
//   3. Si no hay sesión guardada, se abre Chrome: inicia sesión a mano; el script sigue solo.
//
// Escribe fixtures-private/lideris/<escena>.png + manifest.json. Esa carpeta está en
// .gitignore: las capturas pueden tener datos reales y el repo es público. El mock las usa
// si existen (src/lib/server/adapters/mock/private-captures.ts); si no, usa los SVG.
//
// Variables opcionales: LIDERIS_URL (http://localhost:5190), PO_ID, PO_QUOTED_ID, SUPPLIER_ID,
// PURCHASE_ORDER_ID para fijar las entidades en vez de descubrirlas en los listados.
import { existsSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { chromium } from '@playwright/test';

const BASE = (process.env.LIDERIS_URL ?? 'http://localhost:5190').replace(/\/$/, '');
const OUT = join(process.cwd(), 'fixtures-private', 'lideris');
const AUTH = join(OUT, '.auth.json');

/** Selectores de los componentes que el mock referencia (scenes.ts · EL y escenas genéricas). */
const SELECTORS = [
  'main header',
  'main nav:has(a[href$="/products-services"])',
  'main nav[aria-label]',
  'main [role="alert"]',
  '[role="alert"]',
  'input[name="search"]',
  'button:has(svg.lucide-pencil)',
  '[data-slot="card"]',
  '[data-slot="card"] [data-slot="input"]',
  '[data-slot="card"] .t-xs-regular',
  'form[action="?/updateItems"]',
  'form[action="?/updateItems"] .t-sm-medium',
  'form[action="?/updateItems"] button[type="submit"]',
  'main p.t-sm-regular',
  'main .bg-secondary',
  'main .bg-accent',
];

const VP = {
  normal: { width: 1280, height: 720 },
  wide: { width: 1440, height: 810 },
  narrow: { width: 1024, height: 720 },
};

/* ── Sesión ──────────────────────────────────────────────────────────── */

async function isLoggedIn(context) {
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}/preorders`, { waitUntil: 'load', timeout: 60_000 });
    return !/\/(login|verify-account)/.test(new URL(page.url()).pathname);
  } finally {
    await page.close();
  }
}

async function ensureSession(browser) {
  if (existsSync(AUTH)) {
    const context = await browser.newContext({ storageState: AUTH });
    if (await isLoggedIn(context)) return context;
    await context.close();
    console.warn('La sesión guardada venció; inicia sesión de nuevo.');
  }
  const headed = await chromium.launch({ channel: 'chrome', headless: false });
  const context = await headed.newContext({ viewport: VP.normal });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`);
  console.warn('Inicia sesión en la ventana de Chrome (tienes 10 minutos)…');
  await page.waitForURL((url) => !/\/(login|verify-account)/.test(url.pathname), {
    timeout: 600_000,
  });
  await page.waitForLoadState('load');
  await context.storageState({ path: AUTH });
  await headed.close();
  return browser.newContext({ storageState: AUTH });
}

/* ── Utilidades de página ────────────────────────────────────────────── */

async function open(context, path, viewport = VP.normal) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  // Lideris abre websockets: `networkidle` nunca llega, así que load + una pausa corta.
  await page.goto(`${BASE}${path}`, { waitUntil: 'load', timeout: 90_000 });
  await page.locator('main').first().waitFor({ timeout: 30_000 });
  await page.waitForTimeout(1500);
  return page;
}

/**
 * Ids de las primeras filas de un listado. Las tablas de Lideris navegan con clic en la
 * fila (no hay <a>), así que se hace clic en cada una y se lee la URL de destino.
 */
async function idsFrom(context, listPath, pattern, max = 1) {
  const ids = [];
  for (let i = 0; i < max; i++) {
    const page = await open(context, listPath);
    const row = page.locator('main tbody tr').nth(i);
    if (!(await row.count())) {
      await page.close();
      break;
    }
    await row.locator('td').nth(1).click();
    await page.waitForURL((url) => pattern.test(url.pathname), { timeout: 15_000 }).catch(() => {});
    const m = new URL(page.url()).pathname.match(pattern);
    if (m && !ids.includes(m[1])) ids.push(m[1]);
    await page.close();
  }
  return ids;
}

const editButton = (page) =>
  page
    .getByRole('button', { name: /editar cantidades/i })
    .or(page.locator(SELECTORS[6]))
    .first();

async function findPreorders(context) {
  if (process.env.PO_ID && process.env.PO_QUOTED_ID) {
    return { editable: process.env.PO_ID, quoted: process.env.PO_QUOTED_ID };
  }
  const ids = await idsFrom(context, '/preorders', /^\/preorders\/([^/]+)/, 10);
  let editable = process.env.PO_ID ?? null;
  let quoted = process.env.PO_QUOTED_ID ?? null;
  for (const id of ids) {
    if (editable && quoted) break;
    const page = await open(context, `/preorders/${id}/products-services`);
    const canEdit = await editButton(page)
      .isVisible()
      .catch(() => false);
    const rows = await page.locator(SELECTORS[7]).count();
    if (canEdit && rows >= 2 && !editable) editable = id;
    if (!canEdit && rows >= 1 && !quoted) quoted = id;
    await page.close();
  }
  return { editable, quoted };
}

/** Cajas en fracciones 0–1 del viewport, recortadas a lo visible. */
function measure(page) {
  return page.evaluate((selectors) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const round = (v) => Math.round(v * 10_000) / 10_000;
    const out = {};
    for (const selector of selectors) {
      let nodes;
      try {
        nodes = [...document.querySelectorAll(selector)];
      } catch {
        continue;
      }
      const boxes = nodes
        .map((n) => n.getBoundingClientRect())
        .filter((r) => r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < vh && r.right > 0)
        .map((r) => {
          const x = clamp(r.left / vw);
          const y = clamp(r.top / vh);
          return {
            x: round(x),
            y: round(y),
            w: round(clamp(r.right / vw) - x),
            h: round(clamp(r.bottom / vh) - y),
          };
        });
      if (boxes.length) out[selector] = boxes;
    }
    return out;
  }, SELECTORS);
}

async function startEditing(page) {
  await editButton(page).click();
  await page.waitForTimeout(600);
}

/** Baja la cantidad aprobada de las dos primeras filas con los botones del QuantityStepper. */
async function changeTwoRows(page) {
  // Si la cantidad ya está en 1, «Disminuir» está deshabilitado: se prueba con «Aumentar».
  let changed = 0;
  for (let i = 0; changed < 2 && i < 6; i++) {
    for (const verb of ['Disminuir', 'Aumentar']) {
      // El layout responsive pinta el stepper dos veces; solo cuentan los visibles.
      const button = page
        .locator(`button[aria-label^="${verb} cantidad aprobada"]`)
        .filter({ visible: true })
        .nth(i);
      if (!(await button.count()) || (await button.isDisabled())) continue;
      // La barra fija de «Guardar cambios» tapa las filas de abajo: el clic va por evento.
      await button.dispatchEvent('click');
      await button.dispatchEvent('click').catch(() => {});
      changed++;
      break;
    }
  }
  await page.waitForTimeout(500);
}

async function scrollToBottom(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
      const style = getComputedStyle(el);
      if (el.scrollHeight > el.clientHeight + 10 && /auto|scroll/.test(style.overflowY)) {
        el.scrollTop = el.scrollHeight;
      }
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(500);
}

/* ── Plan de escenas (ids de scenes.ts / seeds.ts) ───────────────────── */

function plan({ po, quoted, supplier, purchaseOrder }) {
  const products = po && `/preorders/${po}/products-services`;
  const changed = async (page) => {
    await startEditing(page);
    await changeTwoRows(page);
  };
  return [
    { id: 'po-normal', path: products },
    { id: 'po-edit', path: products, act: startEditing },
    { id: 'po-changed-r2', path: products, act: changed, alias: ['po-changed-r1'] },
    {
      id: 'po-scroll-r2',
      path: products,
      act: async (page) => {
        await changed(page);
        await scrollToBottom(page);
      },
      alias: ['po-scroll-r1'],
    },
    { id: 'po-wide-r2', path: products, vp: VP.wide, act: changed, alias: ['po-wide-r1'] },
    { id: 'po-narrow-r2', path: products, vp: VP.narrow, act: changed, alias: ['po-narrow-r1'] },
    { id: 'po-quoted', path: quoted && `/preorders/${quoted}/products-services` },
    { id: 'qr-0011-a', path: po && `/preorders/${po}/information` },
    { id: 'qr-0011-b', path: po && `/preorders/${po}/quote` },
    { id: 'qr-0011-c', path: supplier && `/suppliers/${supplier}/information` },
    { id: 'qr-0011-d', path: '/suppliers/new' },
    { id: 'qr-0010-a', path: supplier && `/suppliers/${supplier}/information` },
    { id: 'qr-0010-b', path: '/suppliers' },
    { id: 'qr-0010-c', path: supplier && `/suppliers/${supplier}/notes-documents` },
    { id: 'qr-0009-c', path: '/requests' },
    { id: 'qr-0005-a', path: '/suppliers' },
    { id: 'qr-0003-a', path: purchaseOrder && `/purchase-orders/${purchaseOrder}/information` },
    { id: 'qr-0002-b', path: '/cash-requests' },
  ];
}

/* ── Main ────────────────────────────────────────────────────────────── */

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const context = await ensureSession(browser);

const { editable, quoted } = await findPreorders(context);
const supplier =
  process.env.SUPPLIER_ID ??
  (await idsFrom(context, '/suppliers', /^\/suppliers\/([^/]+)\/information/))[0];
const purchaseOrder =
  process.env.PURCHASE_ORDER_ID ??
  (await idsFrom(context, '/purchase-orders', /^\/purchase-orders\/([^/]+)/))[0];
console.warn(
  `Pre-orden editable: ${editable ?? '—'} · cotizada: ${quoted ?? '—'} · proveedor: ${supplier ?? '—'} · OC: ${purchaseOrder ?? '—'}`,
);

const manifest = {};
for (const scene of plan({ po: editable, quoted, supplier, purchaseOrder })) {
  if (!scene.path) {
    console.warn(`· ${scene.id}: sin entidad, queda el SVG.`);
    continue;
  }
  const viewport = scene.vp ?? VP.normal;
  let page;
  try {
    page = await open(context, scene.path, viewport);
    if (/\/(login|verify-account)/.test(new URL(page.url()).pathname)) {
      throw new Error('la sesión venció');
    }
    if (scene.act) await scene.act(page);
    const file = `${scene.id}.png`;
    await page.screenshot({ path: join(OUT, file) });
    const entry = {
      file,
      width: viewport.width,
      height: viewport.height,
      boxes: await measure(page),
    };
    manifest[scene.id] = entry;
    for (const alias of scene.alias ?? []) {
      await copyFile(join(OUT, file), join(OUT, `${alias}.png`));
      manifest[alias] = { ...entry, file: `${alias}.png` };
    }
    console.warn(`✓ ${scene.id} (${Object.keys(entry.boxes).length} componentes medidos)`);
  } catch (err) {
    console.warn(`· ${scene.id}: ${err instanceof Error ? err.message.split('\n')[0] : err}`);
  } finally {
    await page?.close();
  }
}

await writeFile(join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await browser.close();
console.warn(
  `Listo: ${Object.keys(manifest).length} capturas en ${OUT}. Reinicia el dev server del mock.`,
);
