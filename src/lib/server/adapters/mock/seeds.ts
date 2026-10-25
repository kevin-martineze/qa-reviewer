// Datos semilla del mock (basados en el prototipo validado).
// Las fechas son relativas al arranque del server para que «Hace 2 h» siga siendo cierto.
// Contraseñas SOLO de mock: viven aquí, nunca en .env.
//
// Usuarios para probar (contraseña de todos: demo1234):
//   laura.rios@ejemplo.co     admin de la organización · líder de diseño en Lideris
//   kevin@ejemplo.co          miembro · developer en Lideris · project_admin en Auralis
//   andres.pena@ejemplo.co    miembro · diseñador en Lideris · developer en Auralis
//   camila.torres@ejemplo.co  miembro · lectora en Lideris
//   valentina.ruiz@ejemplo.co owner de la organización
//
// Tokens para probar cada estado:
//   /invite/invite-valid-0001     válida · mariana@ejemplo.co · miembro · Lideris
//   /invite/invite-expired-0001   vencida (7 días)
//   /invite/invite-used-0001      usada
//   /invite/invite-revoked-0001   revocada
//   /recover/recover-valid-0001   válido
//   /recover/recover-expired-0001 vencido (1 h)
//   /recover/recover-used-0001    usado
import type {
  ActivityEvent,
  ApiToken,
  AuditEvent,
  Comment,
  ElementRef,
  Membership,
  Notification,
  NotificationPrefs,
  Organization,
  OrgRole,
  Project,
  ProjectMember,
  PullRequest,
  Review,
  Round,
  Screen,
  User,
  Verdict,
} from '$lib/api/types';
import {
  assetUrl,
  genericScene,
  registerScene,
  sceneDiff,
  sceneElements,
  type GenericKind,
} from './scenes';

export const DEMO_PASSWORD = 'demo1234';

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const ahead = (ms: number) => new Date(NOW + ms).toISOString();

export const ORG: Organization = { id: 'pangea', name: 'Pangea' };

/* ── Usuarios ────────────────────────────────────────────────────────── */

function user(
  id: string,
  name: string,
  email: string,
  orgRole: OrgRole,
  lastSeen: number | null,
): User {
  return {
    id,
    name,
    email,
    orgRole,
    status: lastSeen === null ? 'inactive' : 'active',
    lastSeenAt: lastSeen === null ? ago(62 * DAY) : ago(lastSeen),
    createdAt: ago(120 * DAY),
  };
}

export const USERS: User[] = [
  user('u1', 'Kevin Martínez', 'kevin@ejemplo.co', 'member', 5 * MIN),
  user('u2', 'Laura Ríos', 'laura.rios@ejemplo.co', 'admin', 12 * MIN),
  user('u3', 'Andrés Peña', 'andres.pena@ejemplo.co', 'member', 3 * HOUR),
  user('u4', 'Sofía Vargas', 'sofia.vargas@ejemplo.co', 'member', DAY),
  user('u5', 'Mateo Cárdenas', 'mateo.cardenas@ejemplo.co', 'member', 2 * HOUR),
  user('u6', 'Camila Torres', 'camila.torres@ejemplo.co', 'member', 3 * DAY),
  user('u7', 'Valentina Ruiz', 'valentina.ruiz@ejemplo.co', 'owner', 2 * HOUR),
  user('u8', 'Julián Ospina', 'julian.ospina@ejemplo.co', 'member', null),
];

/* ── Proyectos y miembros ────────────────────────────────────────────── */

export const PROJECTS: Project[] = [
  {
    id: 'lideris',
    name: 'Lideris',
    repo: 'pangea-soluciones/lideris-v2',
    planeKey: 'LIDER',
    slaDays: 2,
    strategy: 'by_module',
    moduleRules: [
      { pattern: '/preorders/*', userId: 'u2' },
      { pattern: '/requests/*', userId: 'u3' },
      { pattern: '/suppliers/*', userId: 'u4' },
      { pattern: '/authorizations/*', userId: 'u4' },
    ],
    integrations: {
      github: {
        connected: true,
        repo: 'pangea-soluciones/lideris-v2',
        checkName: 'design-review',
        commentOnPr: true,
      },
      plane: { connected: true, projectKey: 'LIDER', commentOnCard: true },
    },
    maskSelectors: ['[data-patient-name]', '[data-document-number]', 'input[type="email"]'],
    designRules: [
      'Botones con type="button" salvo el submit del formulario.',
      'Íconos solo de lucide; nada de emojis.',
      'Sin desbordes horizontales a 1024 px.',
      'Contraste AA en texto y estados.',
    ],
    reviewsCount: 6,
  },
  {
    id: 'auralis',
    name: 'Auralis',
    repo: 'pangea-soluciones/auralis-admin',
    planeKey: 'AUR',
    slaDays: 3,
    strategy: 'round_robin',
    moduleRules: [],
    integrations: {
      github: {
        connected: true,
        repo: 'pangea-soluciones/auralis-admin',
        checkName: 'design-review',
        commentOnPr: false,
      },
      plane: { connected: false, projectKey: 'AUR', commentOnCard: false },
    },
    maskSelectors: [],
    designRules: ['Contraste AA en texto y estados.'],
    reviewsCount: 2,
  },
];

export const MEMBERSHIPS: ProjectMember[] = [
  { userId: 'u1', projectId: 'lideris', role: 'developer' },
  { userId: 'u2', projectId: 'lideris', role: 'design_lead' },
  { userId: 'u3', projectId: 'lideris', role: 'designer' },
  { userId: 'u4', projectId: 'lideris', role: 'designer' },
  { userId: 'u5', projectId: 'lideris', role: 'developer' },
  { userId: 'u6', projectId: 'lideris', role: 'viewer' },
  { userId: 'u7', projectId: 'lideris', role: 'project_admin' },
  { userId: 'u8', projectId: 'lideris', role: 'designer' },
  { userId: 'u1', projectId: 'auralis', role: 'project_admin' },
  { userId: 'u2', projectId: 'auralis', role: 'designer' },
  { userId: 'u3', projectId: 'auralis', role: 'developer' },
  { userId: 'u5', projectId: 'auralis', role: 'viewer' },
];

/* ── Invitaciones y recuperaciones ───────────────────────────────────── */

export interface InviteSeed {
  id: string;
  token: string;
  email: string;
  inviter: string;
  role: OrgRole;
  projects: Membership[];
  createdAt: string;
  expiresAt: string;
  used: boolean;
  revoked: boolean;
}

export interface RecoverySeed {
  token: string;
  userId: string;
  expiresAt: string;
  used: boolean;
}

export const SEED_INVITES: InviteSeed[] = [
  {
    id: 'i1',
    token: 'invite-valid-0001',
    email: 'mariana@ejemplo.co',
    inviter: 'u2',
    role: 'member',
    projects: [{ projectId: 'lideris', role: 'designer' }],
    createdAt: ago(HOUR),
    expiresAt: ahead(7 * DAY - HOUR),
    used: false,
    revoked: false,
  },
  {
    id: 'i2',
    token: 'invite-expired-0001',
    email: 'luis@ejemplo.co',
    inviter: 'u2',
    role: 'member',
    projects: [{ projectId: 'lideris', role: 'viewer' }],
    createdAt: ago(8 * DAY),
    expiresAt: ago(DAY),
    used: false,
    revoked: false,
  },
  {
    id: 'i3',
    token: 'invite-used-0001',
    email: 'caro@ejemplo.co',
    inviter: 'u7',
    role: 'member',
    projects: [{ projectId: 'auralis', role: 'developer' }],
    createdAt: ago(3 * DAY),
    expiresAt: ahead(4 * DAY),
    used: true,
    revoked: false,
  },
  {
    id: 'i4',
    token: 'invite-revoked-0001',
    email: 'pablo@ejemplo.co',
    inviter: 'u2',
    role: 'admin',
    projects: [],
    createdAt: ago(2 * DAY),
    expiresAt: ahead(5 * DAY),
    used: false,
    revoked: true,
  },
];

export const SEED_RECOVERIES: RecoverySeed[] = [
  { token: 'recover-valid-0001', userId: 'u1', expiresAt: ahead(HOUR), used: false },
  { token: 'recover-expired-0001', userId: 'u2', expiresAt: ago(HOUR), used: false },
  { token: 'recover-used-0001', userId: 'u3', expiresAt: ahead(HOUR), used: true },
];

/* ── Tokens personales de la skill ───────────────────────────────────── */

export interface TokenSeed extends ApiToken {
  owner: string;
}

export const SEED_TOKENS: TokenSeed[] = [
  {
    id: 't1',
    owner: 'u1',
    label: 'MacBook · Lideris',
    prefix: 'qa_pat_7f3a',
    project: 'lideris',
    createdAt: ago(12 * DAY),
    lastUsedAt: ago(5 * HOUR),
  },
  {
    id: 't2',
    owner: 'u1',
    label: 'MacBook · Auralis',
    prefix: 'qa_pat_c91e',
    project: 'auralis',
    createdAt: ago(40 * DAY),
    lastUsedAt: null,
  },
  {
    id: 't3',
    owner: 'u5',
    label: 'Portátil Mateo',
    prefix: 'qa_pat_02bd',
    project: 'lideris',
    createdAt: ago(20 * DAY),
    lastUsedAt: ago(2 * DAY),
  },
];

/* ── QR-0012 · LIDER-628 (dos rondas, capturas generadas) ────────────── */

const R2_NOTE =
  'Ronda 2: la fila editada lleva fondo primary/5 y borde de 2 px (antes, anillo primary/60).';

type ScreenSeed = Omit<Screen, 'verdict'>;
type ScreenText = Omit<ScreenSeed, 'img' | 'previous' | 'before' | 'elements' | 'diff'>;

function poScreen(
  base: ScreenText,
  scenes: { img: string; previous?: string; before?: string },
): ScreenSeed {
  return {
    ...base,
    img: assetUrl(scenes.img),
    previous: scenes.previous ? assetUrl(scenes.previous) : null,
    before: scenes.before ? assetUrl(scenes.before) : null,
    elements: sceneElements(scenes.img),
    diff: scenes.previous ? sceneDiff(scenes.img) : [],
  };
}

const PO_ROUTE = '/preorders/[id]/products-services';

const SCREENS_628: ScreenSeed[] = [
  poScreen(
    {
      key: 'a',
      title: 'Vista normal de Productos / Servicios',
      lead: 'Así se ve la pestaña antes de editar.',
      viewport: '1280 × 720',
      route: PO_ROUTE,
      changedIn: 1,
      inherited: true,
      roundNote: null,
      changes: [
        'Nuevo botón «Editar cantidades» (outline, ícono lápiz) junto al buscador.',
        'Solo aparece si la pre-orden no tiene cotizaciones y el usuario tiene permiso.',
      ],
      questions: ['¿Variante, tamaño y ubicación del botón están bien?'],
    },
    { img: 'po-normal' },
  ),
  poScreen(
    {
      key: 'b',
      title: 'Modo edición, sin cambios',
      lead: 'Después de pulsar «Editar cantidades».',
      viewport: '1280 × 720',
      route: PO_ROUTE,
      changedIn: 1,
      inherited: true,
      roundNote: null,
      changes: [
        '«Cantidad aprobada» pasa a un stepper (− / campo centrado / +).',
        'Mínimo 1, máximo la cantidad solicitada; el botón se deshabilita en el límite.',
        'Barra fija: «Sin cambios», ayuda de límites, Cancelar y Guardar (deshabilitado).',
      ],
      questions: ['¿La ayuda de límites va en la barra o mejor por fila?'],
    },
    { img: 'po-edit', before: 'po-normal' },
  ),
  poScreen(
    {
      key: 'c',
      title: 'Filas modificadas',
      lead: 'Primera fila de 10 a 7 y segunda de 17 a 12.',
      viewport: '1280 × 720',
      route: PO_ROUTE,
      changedIn: 2,
      inherited: false,
      roundNote: R2_NOTE,
      changes: [
        'Fila modificada: fondo suave y borde en color primario, con «Antes: N» bajo el stepper.',
        '«Cantidad adjudicada» y totales se recalculan con la cantidad nueva.',
        'La barra cuenta los cambios y habilita «Guardar cambios».',
      ],
      questions: ['¿El fondo primary/5 con borde de 2 px ya se distingue lo suficiente?'],
    },
    { img: 'po-changed-r2', previous: 'po-changed-r1', before: 'po-edit' },
  ),
  poScreen(
    {
      key: 'd',
      title: 'Desplazamiento a 1280 × 720',
      lead: 'La segunda fila modificada, después de bajar en la lista.',
      viewport: '1280 × 720',
      route: PO_ROUTE,
      changedIn: 2,
      inherited: false,
      roundNote: `${R2_NOTE} La barra no cambió: ver el comentario abierto.`,
      changes: [
        'Encabezado, pestañas y alerta no se desplazan; la lista corre en el espacio restante.',
        'Con la barra fija, a 720 px de alto se ven dos tarjetas a la vez.',
      ],
      questions: ['¿Barra más compacta o alerta colapsable para ganar alto?'],
    },
    { img: 'po-scroll-r2', previous: 'po-scroll-r1' },
  ),
  poScreen(
    {
      key: 'e',
      title: 'Modo edición a 1440 × 810',
      lead: 'Mismo estado con más espacio.',
      viewport: '1440 × 810',
      route: PO_ROUTE,
      changedIn: 2,
      inherited: false,
      roundNote: R2_NOTE,
      changes: ['Caben tres filas y la columna del producto respira.'],
      questions: [],
    },
    { img: 'po-wide-r2', previous: 'po-wide-r1' },
  ),
  poScreen(
    {
      key: 'f',
      title: 'Modo edición a 1024 × 720',
      lead: 'Ancho mínimo del rango objetivo.',
      viewport: '1024 × 720',
      route: PO_ROUTE,
      changedIn: 2,
      inherited: false,
      roundNote: R2_NOTE,
      changes: [
        'Bajo 1280 px la fila pasa a tarjeta apilada.',
        'La barra fija tapa parte de la segunda tarjeta.',
      ],
      questions: ['¿Aceptable así o la tarjeta debería ser más compacta?'],
    },
    { img: 'po-narrow-r2', previous: 'po-narrow-r1' },
  ),
  poScreen(
    {
      key: 'g',
      title: 'Pre-orden ya cotizada (no editable)',
      lead: 'PRE-000117, con cotizaciones.',
      viewport: '1280 × 720',
      route: PO_ROUTE,
      changedIn: 1,
      inherited: true,
      roundNote: null,
      changes: ['Sin botón de edición; se muestra un texto gris explicando por qué.'],
      questions: ['¿Texto suelto, alerta informativa o botón deshabilitado con tooltip?'],
    },
    { img: 'po-quoted' },
  ),
];

const ROUNDS_628: Round[] = [
  {
    n: 1,
    by: 'u1',
    createdAt: ago(DAY + 3 * HOUR),
    note: 'Primera versión: 7 pantallas capturadas por la skill.',
    changed: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    verdicts: {
      a: 'approved',
      b: 'approved',
      c: 'changes_requested',
      d: 'changes_requested',
      e: 'approved',
      f: 'approved',
      g: 'approved',
    },
    submission: {
      by: 'u2',
      createdAt: ago(DAY),
      result: 'changes_requested',
      approved: 5,
      changes: 2,
      body: 'Buen trabajo. Dos ajustes: la fila editada necesita más contraste y la barra pesa mucho a 720 px de alto.',
    },
  },
  {
    n: 2,
    by: 'u1',
    createdAt: ago(2 * HOUR),
    note: 'Fila editada con fondo primary/5 y borde de 2 px. La barra compacta la propongo para otra tarjeta (respuesta en el comentario de «Desplazamiento»).',
    changed: ['c', 'd', 'e', 'f'],
    verdicts: { a: 'approved', b: 'approved', g: 'approved' },
    submission: null,
  },
];

/* ── Resto de revisiones (capturas genéricas) ────────────────────────── */

interface GenericScreenSeed {
  title: string;
  kind: GenericKind;
  /** La pantalla tiene versión en develop sin el cambio. */
  compare?: boolean;
}

function genericScreens(
  reviewId: string,
  module: string,
  change: { moduleNav?: boolean; alert?: string },
  seeds: GenericScreenSeed[],
): ScreenSeed[] {
  return seeds.map((s, i) => {
    const key = String.fromCharCode(97 + i);
    const id = `${reviewId.toLowerCase()}-${key}`;
    const img = registerScene(
      id,
      genericScene({ kind: s.kind, module, title: s.title, ...change }),
    );
    const before = s.compare
      ? registerScene(`${id}-base`, genericScene({ kind: s.kind, module, title: s.title }))
      : null;
    const changes = change.moduleNav
      ? ['Se agrega la 2.ª navegación del módulo en la página hija.']
      : change.alert
        ? ['Nueva alerta cuando faltan documentos.']
        : [];
    return {
      key,
      title: s.title,
      lead: s.compare ? 'Compara con develop para ver el cambio.' : 'Pantalla nueva.',
      viewport: '1280 × 720',
      route: `/${module.toLowerCase()}`,
      img,
      before,
      previous: null,
      changedIn: 1,
      inherited: false,
      roundNote: null,
      diff: [],
      elements: sceneElements(id),
      changes,
      questions: [],
    };
  });
}

const SEED_VERDICTS: Record<string, Record<string, Verdict>> = {
  'QR-0012': { a: 'approved', b: 'approved', g: 'approved' },
  'QR-0010': { a: 'changes_requested', b: 'approved', c: 'approved' },
  'QR-0009': { a: 'approved' },
  'QR-0008': { a: 'approved', b: 'approved' },
  'QR-0007': { a: 'approved' },
  'QR-0006': { a: 'approved', b: 'approved' },
};

function withVerdicts(reviewId: string, screens: ScreenSeed[]): Screen[] {
  const verdicts = SEED_VERDICTS[reviewId] ?? {};
  return screens.map((s) => ({ ...s, verdict: verdicts[s.key] ?? 'pending' }));
}

function pr(
  number: number,
  head: string,
  state: PullRequest['state'] = 'open',
  check: PullRequest['check'] = 'pending',
  repo = 'pangea-soluciones/lideris-v2',
): PullRequest {
  return {
    number,
    url: `https://github.com/${repo}/pull/${number}`,
    base: 'develop',
    head,
    state,
    check,
    commit: (number * 2654435761).toString(16).slice(0, 7),
  };
}

function round1(
  by: string,
  createdAt: string,
  changed: string[],
  submission: Round['submission'] = null,
): Round[] {
  return [{ n: 1, by, createdAt, note: null, changed, verdicts: {}, submission }];
}

const keys = (n: number) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + i));

/* Revisiones viejas de Lideris: dan volumen al listado (paginación, filtros, métricas). */
interface HistorySeed {
  id: string;
  title: string;
  module: string;
  card: string;
  pr: number;
  author: string;
  assignee: string;
  days: number;
  rounds: 1 | 2;
  status: 'approved' | 'closed';
  kinds: GenericKind[];
}

function historyReview(h: HistorySeed): Review {
  const created = ago(h.days * DAY);
  const screens = genericScreens(
    h.id,
    h.module,
    {},
    h.kinds.map((kind, i) => ({ title: `${h.module} · vista ${i + 1}`, kind })),
  ).map((s) => ({ ...s, verdict: 'approved' as const, changedIn: h.rounds }));
  const all = keys(screens.length);
  const approvedAll = {
    by: h.assignee,
    result: 'approved' as const,
    approved: screens.length,
    changes: 0,
    body: null,
  };
  const rounds: Round[] =
    h.rounds === 1
      ? round1(h.author, created, all, { ...approvedAll, createdAt: ago((h.days - 1) * DAY) })
      : [
          {
            n: 1,
            by: h.author,
            createdAt: created,
            note: null,
            changed: all,
            verdicts: {},
            submission: {
              by: h.assignee,
              createdAt: ago((h.days - 1) * DAY),
              result: 'changes_requested',
              approved: screens.length - 1,
              changes: 1,
              body: 'Un ajuste de espaciado en la primera vista.',
            },
          },
          {
            n: 2,
            by: h.author,
            createdAt: ago((h.days - 2) * DAY),
            note: 'Espaciado corregido.',
            changed: ['a'],
            verdicts: Object.fromEntries(all.slice(1).map((k) => [k, 'approved' as const])),
            submission: { ...approvedAll, createdAt: ago((h.days - 3) * DAY) },
          },
        ];
  return {
    id: h.id,
    title: h.title,
    context: `${h.module} · ${h.title.toLowerCase()}`,
    card: h.card,
    pr: pr(h.pr, `feat/${h.card}`, h.status === 'closed' ? 'merged' : 'open', 'success'),
    project: 'lideris',
    module: h.module,
    author: h.author,
    assignees: [h.assignee],
    status: h.status,
    round: h.rounds,
    priority: 'medium',
    dueAt: null,
    createdAt: created,
    updatedAt: ago((h.days - (h.rounds === 1 ? 1 : 3)) * DAY),
    screens,
    rounds,
    summary: { steps: [], rules: [] },
    notCaptured: [],
  };
}

const HISTORY: HistorySeed[] = [
  {
    id: 'QR-0005',
    title: 'Filtros del listado de proveedores',
    module: 'Proveedores',
    card: 'LIDER-571',
    pr: 802,
    author: 'u5',
    assignee: 'u3',
    days: 18,
    rounds: 2,
    status: 'closed',
    kinds: ['list', 'dialog'],
  },
  {
    id: 'QR-0004',
    title: 'Agenda semanal de citas',
    module: 'Citas',
    card: 'LIDER-548',
    pr: 795,
    author: 'u1',
    assignee: 'u4',
    days: 22,
    rounds: 1,
    status: 'closed',
    kinds: ['list', 'detail', 'form'],
  },
  {
    id: 'QR-0003',
    title: 'Detalle de la orden de compra',
    module: 'Compras',
    card: 'LIDER-540',
    pr: 781,
    author: 'u5',
    assignee: 'u2',
    days: 27,
    rounds: 2,
    status: 'closed',
    kinds: ['detail'],
  },
  {
    id: 'QR-0002',
    title: 'Caja menor: registro de gastos',
    module: 'Caja menor',
    card: 'LIDER-546',
    pr: 770,
    author: 'u1',
    assignee: 'u3',
    days: 33,
    rounds: 1,
    status: 'approved',
    kinds: ['form', 'list'],
  },
  {
    id: 'QR-0001',
    title: 'Listado de bancos',
    module: 'Pagos',
    card: 'LIDER-485',
    pr: 742,
    author: 'u5',
    assignee: 'u4',
    days: 41,
    rounds: 1,
    status: 'closed',
    kinds: ['list'],
  },
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'QR-0012',
    title: 'Edición en bloque de las cantidades aprobadas',
    context: 'Pre-orden · pestaña Productos / Servicios',
    card: 'LIDER-628',
    pr: pr(868, 'feature/LIDER-628-pre-order-items-edit-develop'),
    project: 'lideris',
    module: 'Compras',
    author: 'u1',
    assignees: ['u2'],
    status: 'open',
    round: 2,
    priority: 'medium',
    dueAt: ahead(20 * HOUR),
    createdAt: ago(DAY + 3 * HOUR),
    updatedAt: ago(2 * HOUR),
    screens: withVerdicts('QR-0012', SCREENS_628),
    rounds: ROUNDS_628,
    summary: {
      steps: [
        { title: 'Editar', body: 'Pulsa «Editar cantidades»; todas las filas pasan a stepper.' },
        { title: 'Ajustar', body: 'Cambia las cantidades en cualquier página o búsqueda.' },
        {
          title: 'Revisar',
          body: 'Cada fila cambiada muestra su valor anterior; la barra cuenta los cambios.',
        },
        { title: 'Guardar', body: 'Un solo «Guardar cambios» envía todo junto.' },
      ],
      rules: [
        'Rango por fila: de 1 hasta la cantidad solicitada.',
        'Solo sin cotizaciones.',
        'Requiere permiso para editar pre-órdenes.',
      ],
    },
    notCaptured: [
      'Guardando: spinner en «Guardar cambios».',
      'Guardado: toast y salida del modo edición.',
      'Error: mensaje en rojo dentro de la barra.',
      'Sin permiso: no aparece el botón.',
    ],
  },
  {
    id: 'QR-0011',
    title: '2.ª navegación en las páginas hijas de los módulos',
    context: 'Compras, Pagos, Proveedores, Citas y Atención',
    card: 'LIDER-631',
    pr: pr(870, 'feature/LIDER-631-module-nav-child-pages'),
    project: 'lideris',
    module: 'Navegación',
    author: 'u1',
    assignees: ['u3'],
    status: 'open',
    round: 1,
    priority: 'high',
    dueAt: ahead(2 * DAY + 4 * HOUR),
    createdAt: ago(3 * HOUR),
    updatedAt: ago(HOUR),
    screens: withVerdicts(
      'QR-0011',
      genericScreens('QR-0011', 'Compras', { moduleNav: true }, [
        { title: 'Detalle de pre-orden', kind: 'detail', compare: true },
        { title: 'Nueva cotización', kind: 'form', compare: true },
        { title: 'Detalle de proveedor', kind: 'detail', compare: true },
        { title: 'Nuevo proveedor', kind: 'form', compare: true },
      ]),
    ),
    rounds: round1('u1', ago(3 * HOUR), keys(4)),
    summary: {
      steps: [
        {
          title: 'Entrar',
          body: 'Abre cualquier página hija de un módulo (detalle o formulario).',
        },
        {
          title: 'Navegar',
          body: 'La 2.ª navegación del módulo sigue visible bajo el encabezado.',
        },
      ],
      rules: ['Aplica a todos los módulos con dos navegaciones.'],
    },
    notCaptured: ['Módulos de Citas y Atención: mismas reglas.'],
  },
  {
    id: 'QR-0010',
    title: 'Alerta de documentos faltantes del proveedor',
    context: 'Proveedores · detalle',
    card: 'LIDER-629',
    pr: pr(859, 'feat/LIDER-629-supplier-missing-docs-alert-develop', 'open', 'failure'),
    project: 'lideris',
    module: 'Proveedores',
    author: 'u5',
    assignees: ['u4'],
    status: 'changes_requested',
    round: 1,
    priority: 'medium',
    dueAt: null,
    createdAt: ago(2 * DAY),
    updatedAt: ago(DAY - 2 * HOUR),
    screens: withVerdicts(
      'QR-0010',
      genericScreens(
        'QR-0010',
        'Proveedores',
        { alert: 'Faltan 2 documentos: RUT y cámara de comercio.' },
        [
          { title: 'Alerta en el detalle', kind: 'detail', compare: true },
          { title: 'Alerta en el listado', kind: 'list', compare: true },
          { title: 'Documento cargado', kind: 'detail' },
        ],
      ),
    ),
    rounds: round1('u5', ago(2 * DAY), keys(3), {
      by: 'u4',
      createdAt: ago(DAY - 2 * HOUR),
      result: 'changes_requested',
      approved: 2,
      changes: 1,
      body: 'La alerta del detalle compite con el encabezado; bajémosla a la tarjeta de documentos.',
    }),
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0009',
    title: 'Corrección del director en solicitudes',
    context: 'Compras · solicitudes',
    card: 'LIDER-624',
    pr: pr(855, 'feat/LIDER-624-requests-director'),
    project: 'lideris',
    module: 'Compras',
    author: 'u5',
    assignees: ['u3'],
    status: 'in_review',
    round: 1,
    priority: 'urgent',
    dueAt: ago(DAY),
    createdAt: ago(3 * DAY),
    updatedAt: ago(2 * DAY),
    screens: withVerdicts(
      'QR-0009',
      genericScreens('QR-0009', 'Compras', {}, [
        { title: 'Solicitud con corrección', kind: 'detail' },
        { title: 'Diálogo de corrección', kind: 'dialog' },
        { title: 'Historial', kind: 'list' },
      ]),
    ),
    rounds: round1('u5', ago(3 * DAY), keys(3)),
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0008',
    title: 'Filtros de autorizaciones en el rail',
    context: 'Autorizaciones · listado',
    card: 'LIDER-621',
    pr: pr(850, 'feat/LIDER-621-authorizations-filters', 'open', 'success'),
    project: 'lideris',
    module: 'Autorizaciones',
    author: 'u1',
    assignees: ['u4'],
    status: 'approved',
    round: 2,
    priority: 'medium',
    dueAt: null,
    createdAt: ago(6 * DAY),
    updatedAt: ago(4 * DAY),
    screens: withVerdicts(
      'QR-0008',
      genericScreens('QR-0008', 'Autorizaciones', {}, [
        { title: 'Rail con filtros', kind: 'list' },
        { title: 'Filtros aplicados', kind: 'list' },
      ]),
    ),
    rounds: [
      ...round1('u1', ago(6 * DAY), keys(2), {
        by: 'u4',
        createdAt: ago(5 * DAY),
        result: 'changes_requested',
        approved: 1,
        changes: 1,
        body: null,
      }),
      {
        n: 2,
        by: 'u1',
        createdAt: ago(4 * DAY + 3 * HOUR),
        note: 'Contador de filtros activos en el botón.',
        changed: ['b'],
        verdicts: { a: 'approved', b: 'approved' },
        submission: {
          by: 'u4',
          createdAt: ago(4 * DAY),
          result: 'approved',
          approved: 2,
          changes: 0,
          body: null,
        },
      },
    ],
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0007',
    title: 'Monto en el diálogo de aprobación',
    context: 'Pagos · solicitudes de pago',
    card: 'LIDER-605',
    pr: pr(830, 'fix/LIDER-605-approve-dialog-amount', 'merged', 'success'),
    project: 'lideris',
    module: 'Pagos',
    author: 'u1',
    assignees: ['u2'],
    status: 'closed',
    round: 1,
    priority: 'low',
    dueAt: null,
    createdAt: ago(10 * DAY),
    updatedAt: ago(8 * DAY),
    screens: withVerdicts(
      'QR-0007',
      genericScreens('QR-0007', 'Pagos', {}, [{ title: 'Diálogo de aprobación', kind: 'dialog' }]),
    ),
    rounds: round1('u1', ago(10 * DAY), keys(1), {
      by: 'u2',
      createdAt: ago(9 * DAY),
      result: 'approved',
      approved: 1,
      changes: 0,
      body: null,
    }),
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0013',
    title: 'Tablero de conversaciones del asistente',
    context: 'Auralis · tablero',
    card: 'AUR-88',
    pr: pr(
      141,
      'feat/AUR-88-conversations-board',
      'open',
      'pending',
      'pangea-soluciones/auralis-admin',
    ),
    project: 'auralis',
    module: 'Tablero',
    author: 'u3',
    assignees: ['u2'],
    status: 'open',
    round: 1,
    priority: 'medium',
    dueAt: ahead(3 * DAY),
    createdAt: ago(5 * HOUR),
    updatedAt: ago(5 * HOUR),
    screens: withVerdicts(
      'QR-0013',
      genericScreens('QR-0013', 'Tablero', {}, [
        { title: 'Listado de conversaciones', kind: 'list' },
        { title: 'Detalle de conversación', kind: 'detail' },
      ]),
    ),
    rounds: round1('u3', ago(5 * HOUR), keys(2)),
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0006',
    title: 'Formulario de alta de clínicas',
    context: 'Auralis · configuración',
    card: 'AUR-71',
    pr: pr(132, 'feat/AUR-71-clinic-form', 'merged', 'success', 'pangea-soluciones/auralis-admin'),
    project: 'auralis',
    module: 'Configuración',
    author: 'u3',
    assignees: ['u2'],
    status: 'approved',
    round: 1,
    priority: 'low',
    dueAt: null,
    createdAt: ago(14 * DAY),
    updatedAt: ago(12 * DAY),
    screens: withVerdicts(
      'QR-0006',
      genericScreens('QR-0006', 'Configuración', {}, [
        { title: 'Formulario', kind: 'form' },
        { title: 'Confirmación', kind: 'dialog' },
      ]),
    ),
    rounds: round1('u3', ago(14 * DAY), keys(2), {
      by: 'u2',
      createdAt: ago(12 * DAY),
      result: 'approved',
      approved: 2,
      changes: 0,
      body: null,
    }),
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  ...HISTORY.map(historyReview),
];

/* ── Comentarios ─────────────────────────────────────────────────────── */

function refOf(sceneId: string, name: string): ElementRef | null {
  const el = sceneElements(sceneId).find((e) => e.name === name);
  return el ? { name: el.name, file: el.file, line: el.line, selector: el.selector } : null;
}

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'c1',
    review: 'QR-0012',
    screen: 'c',
    round: 1,
    author: 'u2',
    createdAt: ago(DAY + 12 * MIN),
    body: 'El anillo primary/60 se pierde con brillo alto. Probemos un fondo primary/5 en la fila editada, además del borde.',
    anchor: { x: 0.45, y: 0.44 },
    el: refOf('po-changed-r1', 'itemRow · Card'),
    resolved: false,
    followUp: null,
    replies: [
      {
        id: 'r1',
        author: 'u1',
        createdAt: ago(2 * HOUR + MIN),
        body: 'Hecho en la ronda 2: fondo primary/5 y borde de 2 px.',
      },
    ],
  },
  {
    id: 'c2',
    review: 'QR-0012',
    screen: 'd',
    round: 1,
    author: 'u2',
    createdAt: ago(DAY + 8 * MIN),
    body: 'A 720 px la barra se come mucho alto. ¿La bajamos a una sola línea con el contador a la izquierda?',
    anchor: { x: 0.5, y: 0.93 },
    el: refOf('po-scroll-r1', 'Barra de guardado'),
    resolved: false,
    followUp: null,
    replies: [
      {
        id: 'r2',
        author: 'u1',
        createdAt: ago(2 * HOUR + MIN),
        body: 'La barra es la misma en todas las pantallas de edición; propongo hacerla en otra tarjeta para no frenar esta.',
      },
    ],
  },
  {
    id: 'c3',
    review: 'QR-0012',
    screen: 'a',
    round: 1,
    author: 'u2',
    createdAt: ago(DAY + 30 * MIN),
    body: 'Botón correcto. Variante outline está bien junto al buscador.',
    anchor: { x: 0.94, y: 0.31 },
    el: refOf('po-normal', 'Button · Editar cantidades'),
    resolved: true,
    followUp: 'resolved',
    replies: [],
  },
  {
    id: 'c4',
    review: 'QR-0010',
    screen: 'a',
    round: 1,
    author: 'u4',
    createdAt: ago(DAY - HOUR),
    body: '@Laura la alerta compite con el encabezado. ¿La llevamos a la tarjeta de documentos?',
    anchor: { x: 0.5, y: 0.15 },
    el: refOf('qr-0010-a', 'Alert'),
    resolved: false,
    followUp: null,
    replies: [],
  },
];

/* ── Actividad ───────────────────────────────────────────────────────── */

export const SEED_ACTIVITY: ActivityEvent[] = [
  {
    id: 'a1',
    type: 'round_uploaded',
    actor: 'u1',
    review: 'QR-0012',
    text: 'subió la ronda 2 desde la skill (4 pantallas cambiaron)',
    createdAt: ago(2 * HOUR),
  },
  {
    id: 'a2',
    type: 'comment_replied',
    actor: 'u1',
    review: 'QR-0012',
    text: 'respondió 2 comentarios de la ronda 1',
    createdAt: ago(2 * HOUR + MIN),
  },
  {
    id: 'a3',
    type: 'review_submitted',
    actor: 'u2',
    review: 'QR-0012',
    text: 'envió la ronda 1: 5 aprobadas, 2 con ajuste',
    createdAt: ago(DAY),
  },
  {
    id: 'a4',
    type: 'review_assigned',
    actor: 'u2',
    review: 'QR-0012',
    text: 'quedó asignada por la regla de módulo /preorders/*',
    createdAt: ago(DAY + 3 * HOUR - MIN),
  },
  {
    id: 'a5',
    type: 'review_published',
    actor: 'u1',
    review: 'QR-0012',
    text: 'publicó la revisión (7 pantallas) desde la skill',
    createdAt: ago(DAY + 3 * HOUR),
  },
  {
    id: 'a6',
    type: 'review_published',
    actor: 'u1',
    review: 'QR-0011',
    text: 'publicó la revisión (4 pantallas) desde la skill',
    createdAt: ago(3 * HOUR),
  },
  {
    id: 'a7',
    type: 'review_submitted',
    actor: 'u4',
    review: 'QR-0010',
    text: 'envió la revisión con 1 ajuste',
    createdAt: ago(DAY - 2 * HOUR),
  },
  {
    id: 'a8',
    type: 'review_published',
    actor: 'u3',
    review: 'QR-0013',
    text: 'publicó la revisión (2 pantallas) desde la skill',
    createdAt: ago(5 * HOUR),
  },
];

/* ── Notificaciones (por destinatario) ───────────────────────────────── */

export interface NotificationSeed extends Notification {
  user: string;
}

function notif(
  id: string,
  userId: string,
  data: Omit<Notification, 'id' | 'screen' | 'comment'> &
    Partial<Pick<Notification, 'screen' | 'comment'>>,
): NotificationSeed {
  return { id, user: userId, screen: null, comment: null, ...data };
}

export const SEED_NOTIFICATIONS: NotificationSeed[] = [
  notif('n1', 'u2', {
    type: 'round_uploaded',
    actor: 'u1',
    review: 'QR-0012',
    text: 'Kevin Martínez subió la ronda 2 de QR-0012: 4 pantallas cambiaron',
    createdAt: ago(2 * HOUR),
    readAt: null,
  }),
  notif('n2', 'u2', {
    type: 'reply',
    actor: 'u1',
    review: 'QR-0012',
    screen: 'd',
    comment: 'c2',
    text: 'Kevin Martínez respondió tu comentario en «Desplazamiento a 1280 × 720»',
    createdAt: ago(2 * HOUR + MIN),
    readAt: null,
  }),
  notif('n3', 'u2', {
    type: 'review_assigned',
    actor: null,
    review: 'QR-0013',
    text: 'Te asignaron QR-0013 · Tablero de conversaciones del asistente',
    createdAt: ago(5 * HOUR),
    readAt: null,
  }),
  notif('n4', 'u2', {
    type: 'overdue',
    actor: null,
    review: 'QR-0009',
    text: 'QR-0009 venció: Andrés Peña tiene la revisión asignada',
    createdAt: ago(DAY),
    readAt: ago(20 * HOUR),
  }),
  notif('n5', 'u2', {
    type: 'mention',
    actor: 'u4',
    review: 'QR-0010',
    screen: 'a',
    comment: 'c4',
    text: 'Sofía Vargas te mencionó en QR-0010: «¿La llevamos a la tarjeta de documentos?»',
    createdAt: ago(DAY - HOUR),
    readAt: ago(DAY - 2 * HOUR),
  }),
  notif('n6', 'u1', {
    type: 'review_submitted',
    actor: 'u2',
    review: 'QR-0012',
    text: 'Laura Ríos envió la ronda 1 de QR-0012: 5 aprobadas, 2 con ajuste',
    createdAt: ago(DAY),
    readAt: ago(3 * HOUR),
  }),
  notif('n7', 'u1', {
    type: 'review_assigned',
    actor: null,
    review: 'QR-0011',
    text: 'QR-0011 quedó asignada a Andrés Peña (regla por módulo)',
    createdAt: ago(3 * HOUR),
    readAt: null,
  }),
  notif('n8', 'u3', {
    type: 'overdue',
    actor: null,
    review: 'QR-0009',
    text: 'QR-0009 venció hace 1 día',
    createdAt: ago(DAY),
    readAt: null,
  }),
  notif('n9', 'u3', {
    type: 'review_assigned',
    actor: null,
    review: 'QR-0011',
    text: 'Te asignaron QR-0011 · 2.ª navegación en las páginas hijas',
    createdAt: ago(3 * HOUR),
    readAt: null,
  }),
];

export const DEFAULT_PREFS: NotificationPrefs = {
  review_assigned: true,
  round_uploaded: true,
  review_submitted: true,
  mention: true,
  reply: false,
  due_soon: true,
  overdue: true,
};

/* ── Auditoría de la organización ────────────────────────────────────── */

export const SEED_AUDIT: AuditEvent[] = [
  {
    id: 'au1',
    type: 'user_invited',
    actor: 'u2',
    target: 'mariana@ejemplo.co',
    text: 'invitó a mariana@ejemplo.co como diseñadora en Lideris',
    createdAt: ago(HOUR),
  },
  {
    id: 'au2',
    type: 'token_created',
    actor: 'u1',
    target: 'qa_pat_7f3a',
    text: 'creó el token «MacBook · Lideris»',
    createdAt: ago(12 * DAY),
  },
  {
    id: 'au3',
    type: 'role_changed',
    actor: 'u7',
    target: 'u2',
    text: 'cambió el rol de Laura Ríos a admin de la organización',
    createdAt: ago(20 * DAY),
  },
  {
    id: 'au5',
    type: 'project_updated',
    actor: 'u7',
    target: 'lideris',
    text: 'cambió la asignación de Lideris a «por módulo»',
    createdAt: ago(30 * DAY),
  },
  {
    id: 'au4',
    type: 'user_deactivated',
    actor: 'u7',
    target: 'u8',
    text: 'desactivó a Julián Ospina',
    createdAt: ago(60 * DAY),
  },
];
