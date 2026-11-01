import { test, type Page } from '@playwright/test';

import { login } from '../../e2e/helpers';

const OUT = 'docs/assets/screens';

async function shot(page: Page, path: string, name: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  // Deja terminar transiciones y la carga de imágenes.
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

test('login', async ({ page }) => {
  await shot(page, '/login', 'login');
});

test('diseño', async ({ page }) => {
  await login(page, 'laura.rios@ejemplo.co');
  await shot(page, '/', 'inbox');
  await shot(page, '/reviews', 'reviews');
  await shot(page, '/reviews/QR-0012', 'review-detail');
  await shot(page, '/reviews/QR-0012/screens/c', 'viewer');
  await shot(page, '/metrics', 'metrics');
  await shot(page, '/projects/lideris/settings/members', 'project-settings');
});

test('dev', async ({ page }) => {
  await login(page, 'kevin@ejemplo.co');
  await shot(page, '/', 'dev-inbox');
  await shot(page, '/reviews/QR-0012/feedback', 'feedback');
});

// Banner de los README: la imagen de marca con el logo y el lema encima.
const BANNERS = [
  { name: 'banner', kicker: 'Plataforma web', title: 'QA Reviewer' },
  { name: 'banner-api', kicker: 'API', title: 'QA Reviewer API' },
];

for (const banner of BANNERS) {
  test(banner.name, async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 420 });
    const logo = await (await page.request.get(`${baseURL}/favicon.svg`)).text();
    await page.setContent(`
      <style>
        * { margin: 0; box-sizing: border-box; }
        body { width: 1280px; height: 420px; font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          background: #0f172a url('${baseURL}/brand/og.jpg') center 30% / cover no-repeat; color: #f8fafc; }
        .wrap { position: absolute; left: 72px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 18px; width: 540px; }
        .logo { width: 64px; height: 64px; background: #fff; border-radius: 16px; padding: 10px; }
        .logo svg { width: 100%; height: 100%; }
        .kicker { font-size: 15px; letter-spacing: .14em; text-transform: uppercase; color: #7cb0ff; font-weight: 600; }
        h1 { font-size: 56px; font-weight: 700; letter-spacing: -.02em; }
        p { font-size: 22px; line-height: 1.4; color: #cbd5e1; }
      </style>
      <div class="wrap">
        <div class="logo">${logo}</div>
        <div class="kicker">${banner.kicker}</div>
        <h1>${banner.title}</h1>
        <p>Cada pantalla revisada antes de llegar a producción: capturas por ronda, comparación con develop y comentarios sobre el componente exacto.</p>
      </div>`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `docs/assets/${banner.name}.png` });
  });
}
