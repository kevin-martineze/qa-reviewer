// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest';
import { createRawSnippet, mount, unmount } from 'svelte';

import AppShell from './AppShell.svelte';
import AuthTemplate from './AuthTemplate.svelte';
import DashboardTemplate from './DashboardTemplate.svelte';
import DetailTemplate from './DetailTemplate.svelte';
import ListTemplate from './ListTemplate.svelte';
import SettingsTemplate from './SettingsTemplate.svelte';
import ViewerTemplate from './ViewerTemplate.svelte';

const mounted: ReturnType<typeof mount>[] = [];

function createTarget(): HTMLDivElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function raw(html: string) {
  return createRawSnippet(() => ({ render: () => html }));
}

function body(testId = 'body') {
  return raw(`<p data-testid="${testId}">contenido</p>`);
}

afterEach(() => {
  for (const instance of mounted.splice(0)) unmount(instance);
});

function scrollCount(el: HTMLElement): number {
  return el.querySelectorAll('[data-scroll]').length;
}

describe('AuthTemplate', () => {
  it('dibuja título y contenido, y solo un contenedor de scroll', () => {
    const el = createTarget();
    mounted.push(mount(AuthTemplate, { target: el, props: { title: 'Entrar', children: body() } }));
    expect(el.textContent).toContain('Entrar');
    expect(el.querySelector('[data-testid="body"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(1);
  });

  it('no deja huecos para descripción y footer opcionales', () => {
    const el = createTarget();
    mounted.push(mount(AuthTemplate, { target: el, props: { title: 'Entrar', children: body() } }));
    expect(el.querySelector('[data-slot="card-description"]')).toBeNull();
    expect(el.querySelector('[data-slot="card-footer"]')).toBeNull();
  });
});

describe('ListTemplate', () => {
  it('dibuja título y contenido, y solo un contenedor de scroll', () => {
    const el = createTarget();
    mounted.push(
      mount(ListTemplate, { target: el, props: { title: 'Bandeja', children: body() } }),
    );
    expect(el.textContent).toContain('Bandeja');
    expect(el.querySelector('[data-testid="body"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(1);
  });

  it('omite footer cuando no hay paginación', () => {
    const el = createTarget();
    mounted.push(
      mount(ListTemplate, { target: el, props: { title: 'Bandeja', children: body() } }),
    );
    expect(el.querySelector('footer')).toBeNull();
  });
});

describe('DetailTemplate', () => {
  const tabs = [
    { key: 'screens', label: 'Pantallas', href: '/reviews/QR-0012' },
    { key: 'summary', label: 'Resumen', href: '/reviews/QR-0012/summary' },
  ];

  it('dibuja cabecera, tabs y contenido con un solo scroll', () => {
    const el = createTarget();
    mounted.push(
      mount(DetailTemplate, {
        target: el,
        props: {
          header: raw('<h2 data-testid="header">QR-0012</h2>'),
          tabs,
          currentTab: 'screens',
          children: body(),
        },
      }),
    );
    expect(el.querySelector('[data-testid="header"]')).not.toBeNull();
    expect(el.textContent).toContain('Resumen');
    expect(el.querySelector('[data-testid="body"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(1);
  });

  it('omite footer cuando no hay región footer', () => {
    const el = createTarget();
    mounted.push(
      mount(DetailTemplate, {
        target: el,
        props: {
          header: raw('<h2>QR-0012</h2>'),
          tabs,
          currentTab: 'screens',
          children: body(),
        },
      }),
    );
    expect(el.querySelector('footer')).toBeNull();
  });
});

describe('ViewerTemplate', () => {
  it('sin aside tiene un único scroll (el lienzo)', () => {
    const el = createTarget();
    mounted.push(
      mount(ViewerTemplate, {
        target: el,
        props: { toolbar: raw('<div data-testid="toolbar">barra</div>'), children: body() },
      }),
    );
    expect(el.querySelector('[data-testid="toolbar"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="body"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(1);
  });

  it('con aside suma un segundo contenedor de scroll', () => {
    const el = createTarget();
    mounted.push(
      mount(ViewerTemplate, {
        target: el,
        props: {
          toolbar: raw('<div>barra</div>'),
          aside: raw('<div data-testid="aside">comentarios</div>'),
          children: body(),
        },
      }),
    );
    expect(el.querySelector('[data-testid="aside"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(2);
  });
});

describe('SettingsTemplate', () => {
  const nav = [
    { key: 'profile', label: 'Perfil', href: '/settings/profile' },
    { key: 'tokens', label: 'Tokens', href: '/settings/tokens' },
  ];

  it('dibuja título, navegación lateral y contenido con un solo scroll', () => {
    const el = createTarget();
    mounted.push(
      mount(SettingsTemplate, {
        target: el,
        props: { title: 'Ajustes', nav, currentNav: 'profile', children: body() },
      }),
    );
    expect(el.textContent).toContain('Ajustes');
    expect(el.textContent).toContain('Tokens');
    expect(el.querySelector('[data-testid="body"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(1);
  });
});

describe('DashboardTemplate', () => {
  it('dibuja título y contenido con un solo scroll', () => {
    const el = createTarget();
    mounted.push(
      mount(DashboardTemplate, { target: el, props: { title: 'Métricas', children: body() } }),
    );
    expect(el.textContent).toContain('Métricas');
    expect(el.querySelector('[data-testid="body"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(1);
  });

  it('omite la fila de kpis si no se pasa', () => {
    const el = createTarget();
    mounted.push(
      mount(DashboardTemplate, { target: el, props: { title: 'Métricas', children: body() } }),
    );
    expect(el.querySelector('[data-testid="kpis"]')).toBeNull();
  });
});

describe('AppShell', () => {
  it('dibuja migas, sidebar, topbar y contenido con un solo scroll', () => {
    const el = createTarget();
    mounted.push(
      mount(AppShell, {
        target: el,
        props: {
          sidebar: raw('<div data-testid="sidebar">nav</div>'),
          topbar: raw('<div data-testid="topbar">acciones</div>'),
          crumbs: [{ label: 'Revisión', href: '/reviews' }, { label: 'QR-0012' }],
          children: body(),
        },
      }),
    );
    expect(el.querySelector('[data-testid="sidebar"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="topbar"]')).not.toBeNull();
    expect(el.textContent).toContain('QR-0012');
    expect(el.querySelector('[data-testid="body"]')).not.toBeNull();
    expect(scrollCount(el)).toBe(1);
  });

  it('esconde el sidebar cuando arranca colapsado', () => {
    const el = createTarget();
    mounted.push(
      mount(AppShell, {
        target: el,
        props: {
          sidebar: raw('<div data-testid="sidebar">nav</div>'),
          topbar: raw('<div>acciones</div>'),
          crumbs: [],
          collapsed: true,
          children: body(),
        },
      }),
    );
    expect(el.querySelector('[data-testid="sidebar"]')).toBeNull();
  });
});
