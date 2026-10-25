// Capturas sintéticas del mock. Cada escena es una lista de bloques: de la misma
// definición salen el SVG (que sirve `/mock-assets/[file]`) y las cajas de los
// componentes y del diff. Así el inspector y los pins siempre calzan con la imagen.
// Los colores hex son de la «captura» simulada, no de la UI: no aplican los tokens.
import type { Box, ElementRef, ScreenElement } from '$lib/api/types';

import { measuredBox, privateCapture } from './private-captures';

export interface SceneNode {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  r?: number;
  text?: string;
  color?: string;
  size?: number;
  weight?: number;
  /** Componente del código al que corresponde el bloque (inspector y pins). */
  el?: ElementRef;
  /** Bloque que cambió respecto de la ronda anterior. */
  diff?: boolean;
}

export interface Scene {
  w: number;
  h: number;
  nodes: SceneNode[];
}

/* ── Paleta de la captura (imita una app con shadcn) ─────────────────── */

const C = {
  bg: '#ffffff',
  side: '#fafafa',
  border: '#e4e4e7',
  text: '#18181b',
  muted: '#71717a',
  faint: '#a1a1aa',
  soft: '#f4f4f5',
  primary: '#18181b',
  ring: '#5b5b63',
  tint: '#f2f2f3',
  infoBg: '#eff6ff',
  info: '#1d4ed8',
  infoBar: '#3b82f6',
  white: '#ffffff',
};

/* ── Mapa de elementos: archivo, línea y selector del commit revisado ── */

const F_TAB = 'src/lib/components/organisms/preorders/detail/PreOrderProductsTab.svelte';
const F_LAYOUT = 'src/routes/(app)/(purchases)/preorders/[id]/+layout.svelte';
const F_NAV = 'src/lib/components/molecules/navigation/NavTabs.svelte';
const F_HEADER = 'src/lib/components/molecules/headers/PageHeader.svelte';

export const EL = {
  header: { name: 'PageHeader', file: F_HEADER, line: 24, selector: 'main header' },
  tabs: {
    name: 'NavTabs',
    file: F_LAYOUT,
    line: 123,
    selector: 'main nav:has(a[href$="/products-services"])',
  },
  alert: { name: 'PreOrderAlerts', file: F_LAYOUT, line: 126, selector: 'main [role="alert"]' },
  search: {
    name: 'TextField · Buscar productos',
    file: F_TAB,
    line: 388,
    selector: 'input[name="search"]',
  },
  edit: {
    name: 'Button · Editar cantidades',
    file: F_TAB,
    line: 400,
    selector: 'button:has(svg.lucide-pencil)',
  },
  row: { name: 'itemRow · Card', file: F_TAB, line: 316, selector: '[data-slot="card"]' },
  stepper: {
    name: 'QuantityStepper',
    file: F_TAB,
    line: 298,
    selector: '[data-slot="card"] [data-slot="input"]',
  },
  before: {
    name: 'Texto «Antes: N»',
    file: F_TAB,
    line: 307,
    selector: '[data-slot="card"] .t-xs-regular',
  },
  bar: {
    name: 'Barra de guardado',
    file: F_TAB,
    line: 454,
    selector: 'form[action="?/updateItems"]',
  },
  count: {
    name: 'Contador de cambios',
    file: F_TAB,
    line: 462,
    selector: 'form[action="?/updateItems"] .t-sm-medium',
  },
  save: {
    name: 'Button · Guardar cambios',
    file: F_TAB,
    line: 475,
    selector: 'form[action="?/updateItems"] button[type="submit"]',
  },
  reason: { name: 'Texto «no editable»', file: F_TAB, line: 409, selector: 'main p.t-sm-regular' },
  budget: { name: 'Presupuesto', file: F_TAB, line: 436, selector: 'main .bg-secondary' },
  total: { name: 'Total aproximado', file: F_TAB, line: 443, selector: 'main .bg-accent' },
  moduleNav: {
    name: 'ModuleNav · NavTabs',
    file: F_NAV,
    line: 18,
    selector: 'main nav[aria-label]',
  },
} satisfies Record<string, ElementRef>;

function named(el: ElementRef, name: string): ElementRef {
  return { ...el, name };
}

/* ── Piezas ──────────────────────────────────────────────────────────── */

function label(
  x: number,
  y: number,
  text: string,
  size = 13,
  color = C.text,
  weight = 400,
): SceneNode {
  return { x, y, w: 0, h: 0, text, size, color, weight };
}

function button(
  x: number,
  y: number,
  w: number,
  text: string,
  primary = false,
  el?: ElementRef,
): SceneNode[] {
  return [
    {
      x,
      y,
      w,
      h: 36,
      r: 6,
      fill: primary ? C.primary : C.white,
      stroke: primary ? undefined : C.border,
      el,
    },
    label(x + 14, y + 23, text, 13, primary ? C.white : C.text, 500),
  ];
}

function sidebar(h: number, w: number, active: string): SceneNode[] {
  const items = ['Inicio', 'Solicitudes', 'Pre-órdenes', 'Órdenes de compra', 'Proveedores'];
  return [
    { x: 0, y: 0, w, h, fill: C.side },
    { x: w - 1, y: 0, w: 1, h, fill: C.border },
    { x: 20, y: 20, w: 28, h: 28, r: 6, fill: C.primary },
    label(58, 39, 'Lideris', 15, C.text, 600),
    ...items.flatMap((item, i): SceneNode[] => {
      const y = 76 + i * 36;
      const on = item === active;
      return [
        ...(on ? [{ x: 12, y, w: w - 24, h: 30, r: 6, fill: C.soft }] : []),
        label(28, y + 20, item, 13, on ? C.text : C.muted, on ? 500 : 400),
      ];
    }),
  ];
}

interface Frame {
  W: number;
  H: number;
  L: number;
  R: number;
}

function frame(W: number, H: number, side: number): Frame {
  return { W, H, L: side + 24, R: W - 24 };
}

function preorderTop(f: Frame): SceneNode[] {
  const width = f.R - f.L;
  const tabs = ['Información', 'Productos / Servicios', 'Cotizaciones', 'Documentos'];
  let tx = f.L + 6;
  return [
    { x: f.L, y: 20, w: width, h: 48, el: EL.header },
    label(f.L, 42, 'Pre-orden de compra', 20, C.text, 600),
    { x: f.L + 210, y: 26, w: 110, h: 22, r: 11, fill: C.soft },
    label(f.L + 222, 41, 'Media prioridad', 11, C.muted, 500),
    label(f.L, 62, 'ID #PRE-000123', 12, C.muted),
    { x: f.R - 120, y: 24, w: 120, h: 28, r: 6, fill: C.infoBg },
    label(f.R - 104, 42, 'Por cotizar', 12, C.info, 500),
    { x: f.L, y: 84, w: width, h: 40, r: 8, fill: C.soft, el: EL.tabs },
    ...tabs.flatMap((tab): SceneNode[] => {
      const w = tab.length * 7.4 + 28;
      const on = tab === 'Productos / Servicios';
      const nodes: SceneNode[] = [
        ...(on ? [{ x: tx, y: 89, w, h: 30, r: 6, fill: C.white, stroke: C.border }] : []),
        label(tx + 14, 109, tab, 13, on ? C.text : C.muted, on ? 500 : 400),
      ];
      tx += w + 6;
      return nodes;
    }),
    { x: f.L, y: 136, w: width, h: 52, r: 8, fill: C.infoBg, el: EL.alert },
    { x: f.L, y: 136, w: 4, h: 52, fill: C.infoBar },
    label(f.L + 18, 158, 'Pendiente de cotizar', 13, C.info, 600),
    label(
      f.L + 18,
      176,
      'Ajusta las cantidades aprobadas antes de pedir cotizaciones.',
      12,
      C.info,
    ),
  ];
}

type RowStyle = 'plain' | 'ring' | 'tint';

interface RowOpts {
  y: number;
  h?: number;
  name: string;
  requested: number;
  value: number;
  edit: boolean;
  previous?: number;
  style?: RowStyle;
  rowName?: string;
  stacked?: boolean;
}

function itemRow(f: Frame, o: RowOpts): SceneNode[] {
  const width = f.R - f.L;
  const h = o.h ?? 120;
  const style = o.style ?? 'plain';
  const changed = o.previous !== undefined;
  const row: SceneNode = {
    x: f.L,
    y: o.y,
    w: width,
    h,
    r: 8,
    fill: style === 'tint' ? C.tint : C.white,
    stroke: style === 'plain' ? C.border : style === 'ring' ? C.ring : C.primary,
    strokeWidth: style === 'plain' ? 1 : style === 'ring' ? 1.5 : 2,
    el: o.rowName ? named(EL.row, o.rowName) : EL.row,
    diff: changed && style !== 'plain',
  };
  const qtyX = o.stacked ? f.L + 88 : f.L + width * 0.6;
  const qtyY = o.stacked ? o.y + 92 : o.y + 24;
  const nodes: SceneNode[] = [
    row,
    { x: f.L + 16, y: o.y + 16, w: 56, h: 56, r: 6, fill: C.soft },
    label(f.L + 88, o.y + 34, o.name, 14, C.text, 500),
    label(f.L + 88, o.y + 56, `Solicitada: ${o.requested} und`, 12, C.muted),
    label(qtyX, qtyY, 'Cantidad aprobada', 11, C.muted, 500),
  ];
  if (o.edit) {
    const sx = qtyX;
    const sy = qtyY + 12;
    nodes.push(
      { x: sx, y: sy, w: 120, h: 32, el: EL.stepper },
      { x: sx, y: sy, w: 32, h: 32, r: 6, fill: C.soft },
      label(sx + 12, sy + 21, '−', 14),
      { x: sx + 38, y: sy, w: 44, h: 32, r: 6, fill: C.white, stroke: C.border },
      label(sx + 54, sy + 21, String(o.value), 13, C.text, 500),
      { x: sx + 88, y: sy, w: 32, h: 32, r: 6, fill: C.soft },
      label(sx + 99, sy + 21, '+', 14),
    );
    if (changed) {
      nodes.push(
        { x: sx, y: sy + 38, w: 70, h: 16, el: EL.before },
        label(sx, sy + 50, `Antes: ${o.previous}`, 11, C.muted),
      );
    }
  } else {
    nodes.push(label(qtyX, qtyY + 26, `${o.value} und`, 14, C.text, 500));
  }
  if (!o.stacked) {
    const ax = f.L + width * 0.8;
    nodes.push(
      label(ax, o.y + 24, 'Adjudicada', 11, C.muted, 500),
      label(ax, o.y + 50, `${o.value} und`, 14, C.text),
    );
  }
  return nodes;
}

function toolbar(f: Frame, edit: boolean, y = 204): SceneNode[] {
  if (edit) {
    return [
      { x: f.R - 280, y, w: 280, h: 36, r: 6, fill: C.white, stroke: C.border, el: EL.search },
      label(f.R - 264, y + 23, 'Buscar productos', 13, C.faint),
    ];
  }
  return [
    { x: f.R - 410, y, w: 280, h: 36, r: 6, fill: C.white, stroke: C.border, el: EL.search },
    label(f.R - 394, y + 23, 'Buscar productos', 13, C.faint),
    ...button(f.R - 120, y, 120, '✎  Editar cantidades', false, EL.edit),
  ];
}

function saveBar(f: Frame, changes: number): SceneNode[] {
  const y = f.H - 76;
  const width = f.R - f.L;
  return [
    { x: f.L, y, w: width, h: 60, r: 10, fill: C.white, stroke: C.border, el: EL.bar },
    { x: f.L + 18, y: y + 14, w: 120, h: 18, el: EL.count },
    label(f.L + 18, y + 28, changes ? `${changes} cambios` : 'Sin cambios', 13, C.text, 500),
    label(f.L + 18, y + 46, 'De 1 hasta la cantidad solicitada.', 11, C.muted),
    ...button(f.R - 252, y + 12, 104, 'Cancelar'),
    ...button(f.R - 140, y + 12, 124, 'Guardar cambios', changes > 0, EL.save),
  ];
}

/* ── Escenas de QR-0012 (LIDER-628) ──────────────────────────────────── */

type Variant = 'r1' | 'r2';

function changedStyle(v: Variant): RowStyle {
  return v === 'r1' ? 'ring' : 'tint';
}

function poScene(W: number, H: number, side: number, build: (f: Frame) => SceneNode[]): Scene {
  const f = frame(W, H, side);
  return {
    w: W,
    h: H,
    nodes: [
      { x: 0, y: 0, w: W, h: H, fill: C.bg },
      ...sidebar(H, side, 'Pre-órdenes'),
      ...build(f),
    ],
  };
}

const ROW_A = { name: 'Guantes de nitrilo talla M', requested: 10 };
const ROW_B = { name: 'Tapabocas quirúrgico triple capa', requested: 17 };
const ROW_C = { name: 'Alcohol antiséptico 1 L', requested: 6 };

const poNormal = poScene(1280, 720, 232, (f) => [
  ...preorderTop(f),
  ...toolbar(f, false),
  ...itemRow(f, { y: 256, ...ROW_A, value: 10, edit: false }),
  ...itemRow(f, { y: 388, ...ROW_B, value: 17, edit: false, rowName: 'itemRow · Card, fila 2' }),
  ...itemRow(f, { y: 520, ...ROW_C, value: 6, edit: false, rowName: 'itemRow · Card, fila 3' }),
]);

const poEdit = poScene(1280, 720, 232, (f) => [
  ...preorderTop(f),
  ...toolbar(f, true),
  ...itemRow(f, { y: 256, ...ROW_A, value: 10, edit: true }),
  ...itemRow(f, { y: 388, ...ROW_B, value: 17, edit: true, rowName: 'itemRow · Card, fila 2' }),
  ...saveBar(f, 0),
]);

const poChanged = (v: Variant): Scene =>
  poScene(1280, 720, 232, (f) => [
    ...preorderTop(f),
    ...toolbar(f, true),
    ...itemRow(f, { y: 256, ...ROW_A, value: 7, previous: 10, edit: true, style: changedStyle(v) }),
    ...itemRow(f, {
      y: 388,
      ...ROW_B,
      value: 12,
      previous: 17,
      edit: true,
      style: changedStyle(v),
      rowName: 'itemRow · Card, fila 2',
    }),
    ...saveBar(f, 2),
  ]);

const poScroll = (v: Variant): Scene =>
  poScene(1280, 720, 232, (f) => [
    ...preorderTop(f),
    ...toolbar(f, true),
    ...itemRow(f, {
      y: 256,
      ...ROW_B,
      value: 12,
      previous: 17,
      edit: true,
      style: changedStyle(v),
      rowName: 'itemRow · Card, fila 2',
    }),
    ...itemRow(f, { y: 388, ...ROW_C, value: 6, edit: true, rowName: 'itemRow · Card, fila 3' }),
    ...saveBar(f, 2),
  ]);

const poWide = (v: Variant): Scene =>
  poScene(1440, 810, 248, (f) => [
    ...preorderTop(f),
    ...toolbar(f, true),
    ...itemRow(f, { y: 256, ...ROW_A, value: 7, previous: 10, edit: true, style: changedStyle(v) }),
    ...itemRow(f, {
      y: 388,
      ...ROW_B,
      value: 12,
      previous: 17,
      edit: true,
      style: changedStyle(v),
      rowName: 'itemRow · Card, fila 2',
    }),
    ...itemRow(f, { y: 520, ...ROW_C, value: 6, edit: true, rowName: 'itemRow · Card, fila 3' }),
    ...saveBar(f, 2),
  ]);

const poNarrow = (v: Variant): Scene =>
  poScene(1024, 720, 200, (f) => [
    ...preorderTop(f),
    ...toolbar(f, true),
    ...itemRow(f, {
      y: 256,
      h: 170,
      ...ROW_A,
      value: 7,
      previous: 10,
      edit: true,
      style: changedStyle(v),
      stacked: true,
    }),
    ...itemRow(f, {
      y: 440,
      h: 170,
      ...ROW_B,
      value: 12,
      previous: 17,
      edit: true,
      style: changedStyle(v),
      stacked: true,
      rowName: 'itemRow · Card, fila 2',
    }),
    ...saveBar(f, 2),
  ]);

const poQuoted = poScene(1280, 720, 232, (f) => {
  const width = f.R - f.L;
  return [
    // Sin la alerta «Pendiente de cotizar» (franja y = 136–188): ya está cotizada.
    ...preorderTop(f).filter((n) => n.y < 130 || n.y > 190),
    { x: f.L, y: 140, w: 560, h: 20, el: EL.reason },
    label(f.L, 155, 'No se puede editar: la pre-orden ya tiene cotizaciones.', 13, C.muted),
    { x: f.R - 280, y: 132, w: 280, h: 36, r: 6, fill: C.white, stroke: C.border, el: EL.search },
    label(f.R - 264, 155, 'Buscar productos', 13, C.faint),
    ...itemRow(f, { y: 188, ...ROW_A, value: 10, edit: false }),
    ...itemRow(f, { y: 320, ...ROW_B, value: 17, edit: false, rowName: 'itemRow · Card, fila 2' }),
    { x: f.L, y: 470, w: width * 0.7, h: 60, r: 8, fill: C.soft, el: EL.budget },
    label(f.L + 18, 495, 'Presupuesto del centro de costo', 12, C.muted),
    label(f.L + 18, 517, '$ 4.250.000', 15, C.text, 600),
    { x: f.R - width * 0.27, y: 462, w: width * 0.27, h: 76, r: 8, fill: C.soft, el: EL.total },
    label(f.R - width * 0.27 + 18, 490, 'Total aproximado', 12, C.muted),
    label(f.R - width * 0.27 + 18, 518, '$ 1.982.400', 18, C.text, 600),
  ];
});

/* ── Escenas genéricas para el resto de revisiones ───────────────────── */

export type GenericKind = 'list' | 'detail' | 'dialog' | 'form';

export interface GenericOpts {
  kind: GenericKind;
  module: string;
  title: string;
  /** Agrega la 2.ª navegación del módulo (lo que revisa QR-0011). */
  moduleNav?: boolean;
  /** Agrega una alerta nueva (lo que revisa QR-0010). */
  alert?: string;
}

export function genericScene(o: GenericOpts): Scene {
  return poScene(1280, 720, 232, (f) => {
    const width = f.R - f.L;
    const nodes: SceneNode[] = [
      { x: f.L, y: 20, w: width, h: 48, el: EL.header },
      label(f.L, 42, o.title, 20, C.text, 600),
      label(f.L, 62, o.module, 12, C.muted),
    ];
    let y = 84;
    if (o.moduleNav) {
      nodes.push(
        { x: f.L, y, w: width, h: 40, r: 8, fill: C.soft, diff: true, el: EL.moduleNav },
        label(
          f.L + 16,
          y + 25,
          `${o.module}   ·   Listado   ·   Tablero   ·   Reportes`,
          13,
          C.muted,
        ),
      );
      y += 52;
    }
    if (o.alert) {
      nodes.push(
        {
          x: f.L,
          y,
          w: width,
          h: 52,
          r: 8,
          fill: '#fffbeb',
          stroke: '#f59e0b',
          diff: true,
          el: {
            name: 'Alert',
            file: 'src/lib/components/atoms/alert/index.ts',
            line: 1,
            selector: '[role="alert"]',
          },
        },
        label(f.L + 18, y + 31, o.alert, 13, '#92400e', 500),
      );
      y += 64;
    }
    if (o.kind === 'list') {
      for (let i = 0; i < 6; i += 1) {
        const ry = y + 12 + i * 52;
        nodes.push(
          {
            x: f.L,
            y: ry,
            w: width,
            h: 44,
            r: 6,
            fill: i % 2 ? C.white : C.side,
            stroke: C.border,
          },
          { x: f.L + 16, y: ry + 16, w: 180, h: 12, r: 3, fill: C.border },
          { x: f.L + width * 0.45, y: ry + 16, w: 120, h: 12, r: 3, fill: C.soft },
          { x: f.R - 110, y: ry + 12, w: 90, h: 20, r: 10, fill: C.soft },
        );
      }
    } else if (o.kind === 'detail') {
      nodes.push(
        { x: f.L, y: y + 12, w: width * 0.64, h: 300, r: 8, fill: C.white, stroke: C.border },
        { x: f.L + 20, y: y + 36, w: 220, h: 14, r: 3, fill: C.border },
        { x: f.L + 20, y: y + 64, w: width * 0.5, h: 10, r: 3, fill: C.soft },
        { x: f.L + 20, y: y + 84, w: width * 0.45, h: 10, r: 3, fill: C.soft },
        {
          x: f.L + width * 0.67,
          y: y + 12,
          w: width * 0.33,
          h: 300,
          r: 8,
          fill: C.side,
          stroke: C.border,
        },
      );
    } else if (o.kind === 'dialog') {
      nodes.push(
        { x: 0, y: 0, w: f.W, h: f.H, fill: '#0000004d' },
        { x: f.W / 2 - 240, y: 180, w: 480, h: 280, r: 12, fill: C.white, stroke: C.border },
        label(f.W / 2 - 216, 220, o.title, 16, C.text, 600),
        { x: f.W / 2 - 216, y: 244, w: 380, h: 10, r: 3, fill: C.soft },
        ...button(f.W / 2 + 92, 404, 124, 'Confirmar', true),
      );
    } else {
      for (let i = 0; i < 4; i += 1) {
        const fy = y + 16 + i * 72;
        nodes.push(label(f.L, fy + 12, `Campo ${i + 1}`, 12, C.muted, 500), {
          x: f.L,
          y: fy + 20,
          w: width * 0.5,
          h: 36,
          r: 6,
          fill: C.white,
          stroke: C.border,
        });
      }
      nodes.push(...button(f.L, y + 320, 120, 'Guardar', true));
    }
    return nodes;
  });
}

/* ── Registro y render ───────────────────────────────────────────────── */

const REGISTRY = new Map<string, Scene>([
  ['po-normal', poNormal],
  ['po-edit', poEdit],
  ['po-changed-r1', poChanged('r1')],
  ['po-changed-r2', poChanged('r2')],
  ['po-scroll-r1', poScroll('r1')],
  ['po-scroll-r2', poScroll('r2')],
  ['po-wide-r1', poWide('r1')],
  ['po-wide-r2', poWide('r2')],
  ['po-narrow-r1', poNarrow('r1')],
  ['po-narrow-r2', poNarrow('r2')],
  ['po-quoted', poQuoted],
]);

export function registerScene(id: string, scene: Scene): string {
  REGISTRY.set(id, scene);
  return assetUrl(id);
}

export function sceneById(id: string): Scene | undefined {
  return REGISTRY.get(id);
}

/** Captura real local (fixtures-private) si existe; si no, el SVG sintético. */
export function assetUrl(id: string): string {
  return privateCapture(id) ? `/mock-assets/${id}.png` : `/mock-assets/${id}.svg`;
}

export function isRealCapture(id: string): boolean {
  return privateCapture(id) !== undefined;
}

/**
 * URL de la captura para comparar (develop o ronda anterior) solo si es del mismo tipo
 * que la principal: comparar una captura real con un SVG no dice nada.
 */
export function pairedUrl(img: string, other: string | null | undefined): string | null {
  if (!other) return null;
  return isRealCapture(img) === isRealCapture(other) ? assetUrl(other) : null;
}

function frac(n: SceneNode, s: Scene): Box {
  const round = (v: number) => Math.round(v * 10_000) / 10_000;
  return { x: round(n.x / s.w), y: round(n.y / s.h), w: round(n.w / s.w), h: round(n.h / s.h) };
}

/** Componentes de la escena con su caja en fracciones 0–1. */
export function elementsOf(scene: Scene): ScreenElement[] {
  return scene.nodes
    .filter((n): n is SceneNode & { el: ElementRef } => n.el !== undefined)
    .map((n) => ({ ...n.el, id: `${n.el.line}-${n.x}-${n.y}`, box: frac(n, scene) }));
}

/** Zonas que cambiaron respecto de la ronda anterior. */
export function diffOf(scene: Scene): Box[] {
  return scene.nodes.filter((n) => n.diff).map((n) => frac(n, scene));
}

/**
 * En una captura real, cada bloque con componente toma la caja medida en la página
 * (k-ésima coincidencia de su selector). Los que no aparecieron se descartan.
 */
function realNodes(id: string, scene: Scene): Array<{ node: SceneNode; el: ElementRef; box: Box }> {
  const seen: Record<string, number> = {};
  return scene.nodes.flatMap((node) => {
    if (!node.el) return [];
    const k = seen[node.el.selector] ?? 0;
    seen[node.el.selector] = k + 1;
    const box = measuredBox(id, node.el.selector, k);
    return box ? [{ node, el: node.el, box }] : [];
  });
}

export function sceneElements(id: string): ScreenElement[] {
  const scene = REGISTRY.get(id);
  if (!scene) return [];
  if (!isRealCapture(id)) return elementsOf(scene);
  return realNodes(id, scene).map(({ el, box }, i) => ({ ...el, id: `${el.line}-real-${i}`, box }));
}

export function sceneDiff(id: string): Box[] {
  const scene = REGISTRY.get(id);
  if (!scene) return [];
  if (!isRealCapture(id)) return diffOf(scene);
  return realNodes(id, scene)
    .filter(({ node }) => node.diff)
    .map(({ box }) => box);
}

/** Centro del componente en la captura real, para que los pins de los comentarios caigan encima. */
export function anchorOn(
  id: string,
  name: string,
  fallback: { x: number; y: number },
): { x: number; y: number } {
  if (!isRealCapture(id)) return fallback;
  const el = sceneElements(id).find((e) => e.name === name);
  if (!el) return fallback;
  const round = (v: number) => Math.round(v * 1000) / 1000;
  return { x: round(el.box.x + el.box.w / 2), y: round(el.box.y + el.box.h / 2) };
}

function esc(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function renderSvg(scene: Scene): string {
  const parts = scene.nodes.map((n) => {
    if (n.text !== undefined) {
      return `<text x="${n.x}" y="${n.y}" font-size="${n.size ?? 13}" font-weight="${n.weight ?? 400}" fill="${n.color ?? C.text}">${esc(n.text)}</text>`;
    }
    if (!n.fill && !n.stroke) return '';
    const stroke = n.stroke ? ` stroke="${n.stroke}" stroke-width="${n.strokeWidth ?? 1}"` : '';
    return `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.r ?? 0}" fill="${n.fill ?? 'none'}"${stroke}/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${scene.w} ${scene.h}" width="${scene.w}" height="${scene.h}" font-family="ui-sans-serif, system-ui, sans-serif">${parts.join('')}</svg>`;
}
